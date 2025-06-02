import World from './World';

//I think pass these a reference to their LayoutManager and perhaps let their PageManager take care of sizing the container??
class Floater {
  constructor(container, layoutNumber, revealX = 0, revealY = 0) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('A valid container element must be provided.');
    }
    // it's a 'floater' so let's get it floating! This has to be declared first so it can be checked in the setRevealPosition method
    this.isFloating = true;
    this.setRevealPosition(revealX, revealY);
    this.createPersonality();
    this.createFloaterDiv(layoutNumber);

    this.container = container; //Do not give container a z-index!
    this.container.style.position = 'relative';
    this.container.appendChild(this.element);
    this.setPosition(
      World.BIRTH_POSITION.x,
      World.BIRTH_POSITION.y,
      World.BIRTH_POSITION.z
    );

    const { x, y, z } = this.createRandomPosition();
    this.moveTo(x, y, z, this.myDuration); // move to initial position whilst waiting for float loop
    // this.float();
  }

  createPersonality() {
    this.speed = Math.random() * World.MAX_SPEED + World.MIN_SPEED;
    this.myDuration = World.DURATION * this.speed;
    this.easingStyle =
      World.POSSIBLE_EASING_STYLES[
        Math.floor(Math.random() * World.POSSIBLE_EASING_STYLES.length)
      ];
  }

  setRevealPosition(x, y) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Reveal position coordinates: unable to parseInt');
    }
    this.revealX = x;
    this.revealY = y;
    //if this is changed by PageManager whilst open then let's move the floaters
    if (!this.isFloating) {
      this.moveTo(x, y, 1, this.myDuration);
    }
  }

  setDimensions(width, height) {
    typeof width !== 'number' && (width = parseInt(width));
    typeof height !== 'number' && (height = parseInt(height));
    if (typeof width !== 'number' || typeof height !== 'number') {
      throw new Error('Width and height: unable to parseInt');
    }
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  }

  createFloaterDiv(layoutNumber) {
    //create our moving div
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.setAttribute('data-layout-number', layoutNumber);
    // this.element.setAttribute('data-floating', this.isFloating);
    this.element.className = 'floater'; // Add a class for styling
    //set up an initial transition (this is over-written by moveTo()) but now we're setting dimensions from the PageManager we want this here as we won't be setting it in the css
    this.element.style.transition = `all ${this.myDuration}ms ${this.easingStyle}`;
    const colourRandomiser = Math.floor(
      Math.random() * World.FLOATER_BG_COLOURS.length
    );
    this.element.style.backgroundColor =
      World.FLOATER_BG_COLOURS[colourRandomiser];
    this.element.style.color =
      World.FLOATER_COLOURS[World.FLOATER_COLOURS.length - colourRandomiser];
  }

  float() {
    this.isFloating = true;
    // this was when I was playing with the divs being self aware as it were
    this.element.setAttribute('data-floating', this.isFloating);
    if (this.revealTimeout) {
      clearTimeout(this.revealTimeout);
    }
    // just unneccesarily processor intensive to show the contents whilst floating (and the reason for the name 'reveal')
    this.contentHolder.style.visibility = 'hidden';
    // depending on the individual personality this creates the actual movement cyclically
    this.floatInterval = setInterval(() => {
      //I've just discovered that I can stop this processing if the window is not visible (ie running in the background). This is my quick fix, I may come back to this in the future
      if (document.visibilityState === 'hidden') return;
      const { x, y, z } = this.createRandomPosition();
      this.moveTo(x, y, z, this.myDuration); // Move to new position
    }, this.myDuration);
  }

  createRandomPosition() {
    const actualSize = this.element.getBoundingClientRect();
    //stupidly I didn't consider the fact that absolute positioned elements are positioned 'absolutely' in relation to their container. I don't want to use 'fixed' positioning otherwise I don't believe they will scroll inside the container. Therefore I have removed the calculation of the top and left
    const containerRect = this.container.getBoundingClientRect();
    const x = Math.random() * (containerRect.width - actualSize.width);
    const y = Math.random() * (containerRect.height - actualSize.height);
    const z = Math.floor(Math.random() * World.DEPTH) * -1; //removed +1 from World.DEPTH as I don't think it's needed any more
    // console.log(`RANDOM POSITION: ${x} ${y} ${z}`);
    return { x, y, z };
  }

  // This does the grunt work of actually setting the style properties including the transform (used for scaling and rotation)
  setPosition(x, y, z = 1) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    typeof z !== 'number' && (z = parseInt(z));
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for setPosition:', x, y, z);
      return;
    }
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.zIndex = z;
    let transformStr;
    transformStr = this.setZBasedScale(z);
    transformStr += ' ';
    transformStr += this.rotateTowardsTarget(x, y);
    this.element.style.transform = transformStr;
  }

  // change these to return their transform strings instead
  rotateTowardsTarget(targetX, targetY) {
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
    const dx = targetX - parseFloat(this.element.style.left);
    const dy = targetY - parseFloat(this.element.style.top);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
    return `rotate(${angle}deg)`; // Return the rotation transform string
  }

  setZBasedScale(z) {
    if (typeof z !== 'number') {
      z = parseInt(z);
    }
    // just fiddled around with so that they don't become too small
    return `scale(${(95 / World.DEPTH) * (World.DEPTH / Math.abs(z)) + 5}%)`;
  }

  // essentially set's the transition property before calling setPosition()
  moveTo(x, y, z, duration = 500) {
    typeof x !== 'number' && (x = parseInt(x));
    typeof y !== 'number' && (y = parseInt(y));
    typeof z !== 'number' && (z = parseInt(z));
    if (isNaN(x) || isNaN(y) || isNaN(z)) {
      console.error('Invalid position values for moveTo:', x, y, z);
      return;
    }
    //I think I want to scale the duration based on the distance it's moving? Hmm no, this would take a re-engineering of the floating loop logic so maybe come back to this for v2
    this.element.style.transition = `all ${duration}ms ${this.easingStyle}`;
    this.setPosition(x, y, z);
  }

  reveal() {
    //stop the floating cycle cos now we want to take control of the floater
    clearInterval(this.floatInterval);
    // z-index of 1 passed in as we don't want any scaling
    this.moveTo(this.revealX, this.revealY, 1, World.DURATION);
    // add a resize listener so we can look after the container height
    // this.resizeListener = window.addEventListener('resize', () => {
    //   if (!this.hasHeardResize) {
    //     this.hasHeardResize = true;
    //     //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
    //     setTimeout(() => {
    //       console.log('Resizing container...');
    //       this.resizeContainerRect();
    //       this.hasHeardResize = false;
    //     }, 1000);
    //   }
    // });
    // This is what we want to happen at the end of the reveal hence it's a timeout with the same duration as the moveTo function is using (I've made it fractionally longer so that the call to resizeContainerRect works as hoped)
    this.revealTimeout = setTimeout(() => {
      this.contentHolder.style.visibility = 'visible';
      this.isFloating = false;
      this.element.setAttribute('data-floating', this.isFloating);
      // clearTimeout(timeout);//no need I reckon as it clears once it's finished - I'll clear it in float() for the case where it's revealed and then quickly set to float again
      // this.resizeContainerRect();
      this.revealTimeout = null;
    }, World.DURATION + 100);
  }

  // Set the container height to fit content so it will scroll when the floaters overflow the height of the container
  // I'm moving this functionality to the PageManager
  // resizeContainerRect() {
  //   if (this.isFloating) {
  //     return;
  //   }
  //   setTimeout(() => {
  //     const containerRect = this.container.getBoundingClientRect();
  //     const elementRect = this.element.getBoundingClientRect();
  //     this.container.style.height =
  //       Math.max(
  //         parseInt(this.container.style.height),
  //         elementRect.bottom - containerRect.top + World.CONTENT_PADDING
  //       ) + 'px';
  //   }, this.myDuration + 100);
  // }
}

export default Floater;
