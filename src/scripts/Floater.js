'use strict';
import Colourist from './Colourist';
import World from './World';

// The base class for the various containers that can be revealed or float - see PageManager for usage
class Floater {
  static #colourNumber = 0; // Static variable to keep track of the colour index
  static repressFloaters = false; // Static variable to control whether floaters should be able to use the entire depth, so they stay in the background and slow down when a page is open. Implementation could be more subtle but it works for now
  static repressMoveSpeedDivisor = 5;

  //I'm going to make everything apart from the Floater API private I think, I don't want to be able to mess up the inner workings (like setting the element to null or something equally catastrophic!!)
  #isFloating;
  #element;
  #container;
  #revealX;
  #revealY;
  #contentHolder;
  #revealTimeout;
  #floatInterval;
  #myDuration;
  #easingStyle;

  /**
   *
   * @param {HTMLElement} container - the html element that the floaters will be attached to and is also the space within which they will move whilst floating (the bounding rect of this element make up the floating space)
   * @param {number} layoutNumber - a unique identifier that is attached to the floater element as an attribute called 'data-layout-number'
   * @param {number} revealX - optional - see setRevealPosition() - default: 0
   * @param {number} revealY - optional - see setRevealPosition() - default: 0
   */
  constructor(container, layoutNumber, revealX = 0, revealY = 0) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('A valid container element must be provided.');
    }
    // it's a 'floater' so let's get it floating! This has to be declared first so it can be checked in the setRevealPosition method
    this.#isFloating = true; //this is true because it is checked in the setRevealPosition
    this.setRevealPosition(revealX, revealY);
    this.#createPersonality();
    this.#createFloaterDiv(layoutNumber);

    this.#container = container; //Do not give container a z-index!
    this.#container.appendChild(this.#element);
    const { x, y, z } = this.#createRandomPosition();
    this.#setPosition(x, y, z);
  }

  float() {
    this.#triggerMove();
    //call this first so that when a new page is selected they go at full speed
    this.#isFloating = true;
    // this was when I was playing with the divs being self aware as it were
    this.#element.setAttribute('data-floating', this.#isFloating);
    if (this.#revealTimeout) {
      clearTimeout(this.#revealTimeout);
    }
    //a bit of housework to stop any possibility of these leaking
    if (this.#floatInterval) {
      clearInterval(this.#floatInterval);
    }
    // just unneccesarily processor intensive to show the contents whilst floating (and the reason for the name 'reveal')
    this.#contentHolder.style.visibility = 'hidden';
    // depending on the individual personality this creates the actual movement cyclically
    this.#floatInterval = setInterval(() => {
      //I've just discovered that I can stop this processing if the window is not visible (ie running in the background). This is my quick fix, I may come back to this in the future
      if (document.visibilityState === 'hidden') return;
      this.#triggerMove(); // Move to new position
    }, this.#myDuration); // this.#calculateMyDuration()
  }

  reveal() {
    //stop the floating cycle cos now we want to take control of the floater
    clearInterval(this.#floatInterval);
    this.#isFloating = false;
    // z-index of 1 passed in as we don't want any scaling
    this.#moveTo(this.#revealX, this.#revealY, 1, World.DURATION);
    //This is now used by the css to remove the border when floating
    this.#element.setAttribute('data-floating', this.#isFloating);
    // This is what we want to happen at the end of the reveal hence it's a timeout with the same duration as the moveTo function is using (I've made it fractionally longer so that the call to resizeContainerRect works as hoped)
    this.#revealTimeout = setTimeout(() => {
      this.#contentHolder.style.visibility = 'visible';
    }, World.DURATION + 100);
  }

  /**
   * Attach your chosen HTML Element to the floater element, this element will be shown and hidden by the Floater.reveal() and Floater.float()
   * @param {HTMLElement} child - this is the content of the floater element
   */
  appendChildToElement(child) {
    if (!child || !(child instanceof HTMLElement)) {
      throw new Error('A valid child element must be provided.');
    }
    this.#element.appendChild(child);
    this.#contentHolder = child;
  }

  /**
   *
   * @returns style property of the floater element so you can affect it's styling, for example make it invisible with getElementStyle().visibility = 'hidden'
   */
  getElementStyle() {
    return this.#element.style;
  }

  /**
   * Set the position to move to when Floater.reveal() is called - It is in pixels and will be relative to the container element passed into the constructor. If this floater is revealed then it will move to the newly set position
   * @param {number} x - eqivalent to setting the css left property (must be an absolute pixel value)
   * @param {number} y - eqivalent to setting the css top property (must be an absolute pixel value)
   */
  setRevealPosition(x, y) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Reveal position coordinates: unable to parseInt');
    }
    this.#revealX = x;
    this.#revealY = y;
    //if this is changed by PageManager whilst open then let's move the floaters
    if (!this.#isFloating) {
      this.#moveTo(x, y, 1, World.DURATION);
    }
  }

  /**
   * Set the dimensions of the revealed floater. If this floater is revealed then it will resize to the newly set dimensions
   * @param {number} width - eqivalent to setting the css width property (must be an absolute pixel value)
   * @param {number} height - eqivalent to setting the css height property (must be an absolute pixel value)
   */
  setDimensions(width, height) {
    typeof width !== 'number' && (width = parseInt(width));
    typeof height !== 'number' && (height = parseInt(height));
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Width and height: unable to parseInt');
    }
    this.#element.style.width = `${width}px`;
    this.#element.style.height = `${height}px`;
    //if this has happened whilst open we want it to happen quickly
    // if (!this.#isFloating) {
    this.#element.style.transition = `all ${World.DURATION}ms ${
      this.#easingStyle
    }`;
    // }
  }

  //now that I have repressed the motion when a page is open (and at some point I should deal with prefers-reduced-motion in the near future)
  #calculateMyDuration() {
    //I want them to move quickly back into position if they are currently revealed as it means another page has been selected and with repression switched on it will currently be slow
    if (!this.#isFloating) return World.DURATION;
    else
      return Floater.repressFloaters
        ? this.#myDuration * Floater.repressMoveSpeedDivisor
        : this.#myDuration;
  }

  #createPersonality() {
    const speed = Math.random() * World.MAX_DRAG + World.MIN_DRAG;
    this.#myDuration = World.DURATION * speed;
    this.#easingStyle =
      World.POSSIBLE_EASING_STYLES[
        Math.floor(Math.random() * World.POSSIBLE_EASING_STYLES.length)
      ];
  }

  #createFloaterDiv(layoutNumber) {
    //create our moving div
    this.#element = document.createElement('div');
    this.#element.style.position = 'absolute';
    this.#element.setAttribute('data-layout-number', layoutNumber);
    // this.#element.setAttribute('data-floating', this.#isFloating);
    this.#element.className = 'floater'; // Add a class for styling
    //set up an initial transition (this is over-written by moveTo()) but now we're setting dimensions from the PageManager we want this here as we won't be setting it in the css
    this.#element.style.transition = `all ${this.#myDuration}ms ${
      this.#easingStyle
    }`;
    // add the listener for the custom event emitted by Colourist
    document.addEventListener('colourModeChange', (e) => {
      this.#colouriseFloater();
    });
    this.#colouriseFloater();
  }

  #colouriseFloater() {
    //I'm not liking the way we can end up with #elements majoritively with the same colour to be honest, so I'm going to use a static variable to loop through on each #element.
    const colourRandomiser =
      Floater.#colourNumber % Colourist.getColourSwatchLength();
    Floater.#colourNumber++;
    this.#element.style.backgroundColor =
      Colourist.getOrangeBGSwatch()[colourRandomiser];
    this.#element.style.color = Colourist.getOrangeSwatch()[colourRandomiser];
  }

  #triggerMove() {
    const { x, y, z } = this.#createRandomPosition();
    this.#moveTo(x, y, z, this.#calculateMyDuration()); //slow them down when a page is showing
  }

  #createRandomPosition() {
    const actualSize = this.#element.getBoundingClientRect();
    //stupidly I didn't consider the fact that absolute positioned #elements are positioned 'absolutely' in relation to their container. I don't want to use 'fixed' positioning otherwise I don't believe they will scroll inside the container. Therefore I have removed the calculation of the top and left
    const containerRect = this.#container.getBoundingClientRect();
    const x = Math.random() * (containerRect.width - actualSize.width);
    const y = Math.random() * (containerRect.height - actualSize.height);
    const z = Floater.repressFloaters
      ? Math.floor((Math.random() * World.DEPTH) / 2 + World.DEPTH / 2) * -1
      : Math.floor(Math.random() * World.DEPTH) * -1; //this keeps the floaters below a certain depth to make them less distracting when a page is open
    return { x, y, z };
  }

  // essentially set's the transition property before calling setPosition()
  #moveTo(x, y, z, duration = World.DURATION) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    typeof z !== 'number' && (z = parseInt(z));
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for moveTo:', x, y, z);
      return;
    }
    //I think I want to scale the duration based on the distance it's moving? Hmm no, this would take a re-engineering of the floating loop logic so maybe come back to this for v2
    this.#element.style.transition = `all ${duration}ms ${this.#easingStyle}`;
    //I think this helps it sync the animation to the native screen refresh
    requestAnimationFrame(() => this.#setPosition(x, y, z));
  }

  // This does the grunt work of actually setting the style properties including the transform (used for scaling and rotation)
  #setPosition(x, y, z = 1) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    typeof z !== 'number' && (z = parseInt(z));
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for setPosition:', x, y, z);
      return;
    }
    this.#element.style.left = `${x}px`;
    this.#element.style.top = `${y}px`;
    this.#element.style.zIndex = z;
    let transformStr;
    //let's test an idea of using translate rather than top left - no, it makes the rotation function fall apart (because it uses top/left for the calculations) and is not any smoother than what I've got already
    // transformStr = `translate(${x}px, ${y}px) `;
    // transformStr += ' ';
    transformStr = this.#rotateTowardsTarget(x, y);
    transformStr += ' ';
    transformStr += this.#setZBasedScale(z);
    this.#element.style.transform = transformStr;
  }

  // change these to return their transform strings instead
  #rotateTowardsTarget(targetX, targetY) {
    typeof targetX !== 'number' && (targetX = parseInt(targetX));
    typeof targetY !== 'number' && (targetY = parseInt(targetY));
    if (isNaN(targetX) || isNaN(targetY)) {
      console.error(
        'Invalid target values for rotateTowardsTarget:',
        targetX,
        targetY
      );
      return;
    }
    const dx = targetX - parseFloat(this.#element.style.left);
    const dy = targetY - parseFloat(this.#element.style.top);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
    return `rotate(${angle}deg)`; // Return the rotation transform string
  }

  #setZBasedScale(z) {
    if (typeof z !== 'number') {
      z = parseInt(z);
    }
    // just fiddled around with so that they don't become too small
    return `scale(${(95 / World.DEPTH) * (World.DEPTH / Math.abs(z)) + 5}%)`;
  }

  // Set the container height to fit content so it will scroll when the floaters overflow the height of the container
  // I'm moving this functionality to the PageManager
}

export default Floater;
