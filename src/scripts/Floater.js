'use strict';
import Colourist from './Colourist';
import World from './World';

// The base class for the various containers that can be revealed or float - see PageManager for usage
class Floater {
  static #colourNumber = 0; // Static variable to keep track of the colour index
  static repressFloaters = false; // Static variable to control whether floaters should be able to use the entire depth, so they stay in the background and slow down when a page is open. Implementation could be more subtle but it works for now
  static repressMoveSpeedDivisor = 5;

  static isLowPowerDevice = false;

  //I'm going to make everything apart from the Floater API private I think, I don't want to be able to mess up the inner workings (like setting the element to null or something equally catastrophic!!)
  #isFloating;
  #element;
  #container;
  #revealX;
  #revealY;
  #contentHolder;
  #revealTimeout;
  #floatTimeout;
  #myDuration;
  #easingStyle;
  //trying to avoid the drift of floaters to the bottom right of the container
  #currentX = 0;
  #currentY = 0;
  #currentZ = 0;

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
    // The layout manager will be setting the reveal positions but I want a manual override available still I think so I'll allow this if revealX/Y are passed in
    if (revealX !== 0 || revealY !== 0) {
      this.setRevealPosition(revealX, revealY);
    }
    this.#createPersonality();
    this.#createFloaterDiv(layoutNumber);

    this.#container = container; //Do not give container a z-index!
    this.#container.appendChild(this.#element);
    // Wait until the next animation frames when the browser has guaranteed
    // laid out the element and given it physical width/height
    const { x, y, z } = this.#createRandomPosition();

    // Seed initial position values safely
    this.#currentX = x;
    this.#currentY = y;
    this.#currentZ = z;

    //check for system capabilities
    // 1. PERFORMANCE DETECTION: Now in SiteManager.init()
    // Fallback to low-power rules if on a small screen or if the hardware reports low capabilities
    // const isLowPowerDevice =
    //   (navigator.deviceMemory && navigator.deviceMemory < 4) ||
    //   (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

    // Strip transitions, place it instantly, and force a layout lock
    this.#element.style.transition = 'none';
    if (Floater.isLowPowerDevice) {
      this.#element.style.willChange = 'auto';
    }

    this.#setPosition(x, y, z);
    void this.#element.offsetHeight;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // NOW it is safe to start the floating cycle
        this.float();
      });
    });
  }

  float() {
    //call this first so that when a new page is selected they go at full speed
    this.#triggerMove();
    this.#isFloating = true;
    // this was when I was playing with the divs being self aware as it were
    this.#element.setAttribute('data-floating', this.#isFloating);
    if (this.#revealTimeout) {
      clearTimeout(this.#revealTimeout);
    }
    //a bit of housework to stop any possibility of these leaking
    if (this.#floatTimeout) {
      clearTimeout(this.#floatTimeout);
    }
    // just unneccesarily processor intensive to show the contents whilst floating (and the reason for the name 'reveal')
    this.#contentHolder.style.visibility = 'hidden';
    //moved this from the top of the function based on advise from gemini
    // this.#triggerMove();
    // Use a clean recursive loop via setTimeout instead of a rigid setInterval
    const runLoop = () => {
      if (!this.#isFloating) return; // Exit loop if no longer floating
      // don't use the processor if the window is hidden
      if (document.visibilityState !== 'hidden') {
        this.#triggerMove();
      }

      this.#floatTimeout = setTimeout(runLoop, this.#calculateMyDuration());
    };

    // kick off the loading movement
    this.#floatTimeout = setTimeout(() => {
      // this.#element.style.transformOrigin = 'top left';// with changes to rotation logic this is now hardcoded in the css
      runLoop();
    }, 50);
  }

  reveal() {
    //stop the floating cycle cos now we want to take control of the floater
    // clearInterval(this.#floatTimeout);
    // changed to timeout based on gemini's suggestion
    clearTimeout(this.#floatTimeout);
    this.#isFloating = false;
    // this.#element.style.transformOrigin = 'center'; // Reset transform origin to top left for reveal - no longer needed as I have worked on the tranform matrix in the setPosition function
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
    // because they can be passed through as strings with the 'px' suffix from the css
    typeof x !== 'number' && (x = parseFloat(x));
    typeof y !== 'number' && (y = parseFloat(y));
    // console.log(`Setting reveal position to ${x}, ${y}`);
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Reveal position coordinates: unable to parseFloat');
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
    typeof width !== 'number' && (width = parseFloat(width));
    typeof height !== 'number' && (height = parseFloat(height));
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Width and height: unable to parseFloat');
    }
    //if this has happened whilst open we want it to happen quickly - this was being overridden by the transition in moveTo() since converting to transform3d so I've added the width height to there which works on resize as hoped. I have now discovered that when the screen is resized whilst another page is open the transition for setting width and height will run at the repressed speed meaning when they open they can be crawling to the correct dimensions so we'll have to override that transition
    const duration = this.#calculateMyDuration();
    this.#element.style.transition = `
      transform ${duration}ms ${this.#easingStyle},
      z-index ${duration}ms,
      width ${World.DURATION}ms ${this.#easingStyle},
      height ${World.DURATION}ms ${this.#easingStyle},
      background-color ${duration}ms ${this.#easingStyle},
      color ${duration}ms ${this.#easingStyle}
    `.replace(/\s+/g, ' ');
    //we've now put the transition into the style so all we need to change is the duration property that it relies on
    // this.#element.style.setProperty('--transition-duration', duration);

    this.#element.style.width = `${width}px`;
    this.#element.style.height = `${height}px`;
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
        Math.floor(Math.random() * (World.POSSIBLE_EASING_STYLES.length - 1))
      ];
    // this.#element.style.setProperty('--transition-easing', this.#easingStyle);
  }

  #createFloaterDiv(layoutNumber) {
    //create our moving div
    this.#element = document.createElement('div');
    this.#element.style.position = 'absolute';
    this.#element.setAttribute('data-layout-number', layoutNumber);
    this.#element.setAttribute('data-floating', this.#isFloating);
    this.#element.className = 'floater'; // Add a class for styling
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
    if (!this.#isFloating) return; // Exit if not floating
    const { x, y, z } = this.#createRandomPosition();
    this.#moveTo(x, y, z, this.#calculateMyDuration()); //slow them down when a page is showing
  }

  //avoiding boundingRect for the floaters as it may have been causing the drift to the bottom right of the container due to the scale transforms
  #createRandomPosition() {
    // FIX: Using offsetWidth/Height ignores the CSS scale() transformations!
    const elementWidth = this.#element.offsetWidth || 300;
    const elementHeight = this.#element.offsetHeight || 300;

    const containerRect = this.#container.getBoundingClientRect();

    // Accurately bound positioning layout space, but add scaling into the calculations to avoid clustering in the centre of a narrow screen
    const scalar = this.#calculateScaleFromZ(this.#currentZ) / 100;
    const scaledWidth = elementWidth * scalar;
    const scaledHeight = elementHeight * scalar;
    const maxX = containerRect.width - scaledWidth;
    const maxY = containerRect.height - scaledHeight;

    const x = Math.random() * (maxX > 0 ? maxX : 0);
    const y = Math.random() * (maxY > 0 ? maxY : 0);
    //this keeps the floaters below a certain depth to make them less distracting when a page is open
    const z = Floater.repressFloaters
      ? Math.floor((Math.random() * World.DEPTH) / 2 + World.DEPTH / 2) * -1
      : Math.floor(Math.random() * World.DEPTH) * -1;

    return { x, y, z };
  }

  // essentially set's the transition property before calling setPosition()
  #moveTo(x, y, z, duration = World.DURATION) {
    typeof x !== 'number' && (x = parseFloat(x));
    typeof y !== 'number' && (y = parseFloat(y));
    typeof z !== 'number' && (z = parseFloat(z));

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for moveTo:', x, y, z);
      return;
    }
    //if the page is open let's set duration to be the default
    if (!this.#isFloating) {
      duration = World.DURATION;
    }
    //I think I want to scale the duration based on the distance it's moving? Hmm no, this would take a re-engineering of the floating loop logic so maybe come back to this for v2
    // Smooth, hardware-accelerated transitions
    // Notice that left and top are completely gone from the transition rule!
    this.#element.style.transition = `
      transform ${duration}ms ${this.#easingStyle},
      z-index ${duration}ms,
      width ${World.DURATION}ms ${this.#easingStyle},
      height ${World.DURATION}ms ${this.#easingStyle},
      background-color ${duration}ms ${this.#easingStyle},
      color ${duration}ms ${this.#easingStyle}
    `.replace(/\s+/g, ' ');
    //new version where we set the css property for duration instead of overwriting the transition itself
    // this.#element.style.setProperty('--transition-duration', duration);
    //I think this helps it sync the animation to the native screen refresh
    requestAnimationFrame(() => this.#setPosition(x, y, z));
  }

  // This does the grunt work of actually setting the style properties including the transform (used for scaling and rotation)
  #setPosition(x, y, z = 1) {
    //suggested change by gemini to avoid the parseInt() and just use Number() instead, no, it's not safe and I can't see any reason not to sanitize the input when I so simply can. I'll just use parseFlaot instead of parseInt so we keep the floating points
    typeof x !== 'number' && (x = parseFloat(x));
    typeof y !== 'number' && (y = parseFloat(y));
    typeof z !== 'number' && (z = parseFloat(z));
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for setPosition:', x, y, z);
      return;
    }

    // Combine all spatial manipulations into a single transform chain
    // translate3d handles X, Y, and forces a hardware-accelerated layer on capable machines - be sure to set the z to 0px so that the perspective calculations do not make the floaters shift when the container changes size
    let transformStr = Floater.isLowPowerDevice
      ? `translate(${x}px, ${y}px)`
      : `translate3d(${x}px, ${y}px, 0px)`;
    // Append scaling
    transformStr += ' ' + this.#setZBasedScale(z);
    // as we have set the transform-origin to top left to help with distribution the rotation is quite ugly, to fix it we'll simply shift the transform matrix for the rotation calculations
    transformStr += ' translate(50%, 50%)';
    // Append rotation
    transformStr += ' ' + this.#rotateTowardsTarget(x, y);
    transformStr += ' translate(-50%, -50%)';
    this.#element.style.transform = transformStr;
    // z-index is now part of the transition which works as hoped even though AI says it can't
    this.#element.style.zIndex = z;
    // Track the final target destination safely
    this.#currentX = x;
    this.#currentY = y;
    // used for the random position calculation as a way of working out the actual screen size rather than the offset size so that the floaters are distributed evenly in the container
    this.#currentZ = z;
  }

  // change these to return their transform strings instead
  #rotateTowardsTarget(targetX, targetY, stringReturn = true) {
    if (!this.#isFloating) {
      return stringReturn ? 'rotate(0deg)' : 0; // No rotation when not floating
    }
    typeof targetX !== 'number' && (targetX = parseFloat(targetX));
    typeof targetY !== 'number' && (targetY = parseFloat(targetY));
    const randomRotation = Math.random() * 720;
    if (isNaN(targetX) || isNaN(targetY)) {
      console.error(
        'Invalid target values for rotateTowardsTarget:',
        targetX,
        targetY,
      );
      return stringReturn ? `rotate(${randomRotation}deg)` : randomRotation;
    }
    // Safely look up previous destination to prevent mid-transition mathematical decay loops
    const baseLineX =
      typeof this.#currentX === 'number' ? this.#currentX : targetX;
    const baseLineY =
      typeof this.#currentY === 'number' ? this.#currentY : targetY;

    const dx = targetX - baseLineX;
    const dy = targetY - baseLineY;

    if (dx === 0 && dy === 0) {
      return stringReturn ? `rotate(${randomRotation}deg)` : randomRotation;
    }
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
    return stringReturn ? `rotate(${angle + 360}deg)` : angle + 360; // Return the rotation transform string
  }

  // I'm converting to use transform3d by adding perspective: 1500px; transform-style: preserve-3d; to the container css
  #setZBasedScale(z) {
    if (typeof z !== 'number') {
      z = parseFloat(z);
    }
    if (isNaN(z) || z === 0) z = 1;

    return `scale(${this.#calculateScaleFromZ(z)}%)`;
  }

  // moving the scale calculation itself out into a seperate function so I can use it in the createRandomPosition() function to allow for the whole screen to be used as they are now collecting in the middle of a smaller screen
  #calculateScaleFromZ(z) {
    // just fiddled around with so that they don't become too small
    return (95 / World.DEPTH) * (World.DEPTH / Math.abs(z)) + 5;
  }

  // Set the container height to fit content so it will scroll when the floaters overflow the height of the container
  // I'm moving this functionality to the PageManager
}

export default Floater;
