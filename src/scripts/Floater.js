import World from './World';

class Floater {
  constructor(container, layoutNumber, revealX = 0, revealY = 0) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('A valid container element must be provided.');
    }

    this.createFloaterDiv(layoutNumber);
    //Add an element to hold the content so it can have it's visibilty toggled
    this.contentHolder = document.createElement('iframe');
    this.contentHolder.className = 'content-holder'; // Add a class for styling
    this.contentHolder.style.border = 'none'; // Remove border for the content holder
    this.contentHolder.style.width = '100%';
    this.element.appendChild(this.contentHolder);

    this.container = container;
    this.container.style.zIndex = World.DEPTH * -1;
    this.container.style.position = 'relative';
    // this.containerRect = this.container.getBoundingClientRect(); // Get the bounding rectangle of the container
    this.setPosition(
      World.BIRTH_POSITION.x,
      World.BIRTH_POSITION.y,
      World.BIRTH_POSITION.z
    ); // Set initial position
    this.revealX = revealX; // Set the reveal position
    this.revealY = revealY; // Set the reveal position

    //set up the floater's 'personality'
    this.speed = Math.random() * World.MAX_SPEED + World.MIN_SPEED;
    this.myDuration = World.DURATION * this.speed;
    this.easingStyle =
      World.POSSIBLE_EASING_STYLES[
        Math.floor(Math.random() * World.POSSIBLE_EASING_STYLES.length)
      ];
    this.isFloating = true;
    this.container.appendChild(this.element);

    //This was for calculating their starting positions when using relative positioning - now moved on to absolute positioning with a display position passed through as revealX and revealY
    this.startX = this.element.getBoundingClientRect().x;
    this.startY = this.element.getBoundingClientRect().y;
    // console.log(this.startX, this.startY);
    const { x, y, z } = this.createRandomPosition();
    this.moveTo(x, y, z, this.myDuration); // move to initial position
  }

  createFloaterDiv(layoutNumber) {
    //create our moving div
    const colourRandomiser = Math.floor(
      Math.random() * World.FLOATER_COLOURS.length
    );
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.setAttribute('data-layout-number', layoutNumber);
    this.element.setAttribute('data-floating', this.isFloating);
    this.element.className = 'floater'; // Add a class for styling
    this.element.style.backgroundColor =
      World.FLOATER_COLOURS[colourRandomiser];
    this.element.style.borderColor =
      World.FLOATER_COLOURS[World.FLOATER_COLOURS.length - colourRandomiser];
  }

  float() {
    let counter = 0;
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.hasHeardResize = false;
    }
    this.contentHolder.style.visibility = 'hidden'; // Hide the content holder initially
    // const myDuration = World.DURATION * this.speed;
    this.floatInterval = setInterval(() => {
      const { x, y, z } = this.createRandomPosition();
      counter++;
      this.moveTo(x, y, z, this.myDuration); // Move to new position
      //   console.log(`z-index: ${z}`); // Log the z-index for debugging
    }, this.myDuration);
  }

  createRandomPosition() {
    const actualSize = this.element.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();
    const x = Math.random() * containerRect.right - actualSize.width;
    const y =
      Math.random() * (containerRect.height - actualSize.height) -
      containerRect.top;
    const z = Math.floor(Math.random() * World.DEPTH + 1) * -1;
    return { x, y, z };
  }

  setPosition(x, y, z = 1) {
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      (z !== undefined && typeof z !== 'number')
    ) {
      throw new Error('Position coordinates must be numbers.');
    }
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    this.element.style.zIndex = z;
    this.setZBasedScale(z);
    //this must be called AFTER the setZBasedScale function to avoid overwriting the transform property
    this.rotateTowardsTarget(x, y);
  }

  // Due to the += operator this needs to be called AFTER the setZBasedScale function to avoid overwriting the transform property
  rotateTowardsTarget(targetX, targetY) {
    if (typeof targetX !== 'number' || typeof targetY !== 'number') {
      throw new Error('Target coordinates must be numbers.');
    }
    const dx = targetX - parseFloat(this.element.style.left);
    const dy = targetY - parseFloat(this.element.style.top);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees
    this.element.style.transform += `rotate(${angle}deg)`;
  }

  setZBasedScale(z) {
    if (typeof z !== 'number') {
      throw new Error('Z coordinate must be a number.');
    }
    this.element.style.transform = `scale(${
      (95 / World.DEPTH) * (World.DEPTH / Math.abs(z)) + 5
    }%)`;
  }

  moveTo(x, y, z, duration = 500) {
    if (
      typeof x !== 'number' ||
      typeof y !== 'number' ||
      typeof z !== 'number'
    ) {
      throw new Error('Position coordinates must be numbers.');
    }
    this.element.style.transition = `all ${duration}ms ${this.easingStyle}`; // Smooth transition
    this.setPosition(x, y, z);
  }

  reveal() {
    clearInterval(this.floatInterval); // Stop floating
    this.contentHolder.srcdoc = `<html><body><p>This is ${this.element.getAttribute(
      'data-layout-number'
    )} test content</p></body></html>`;
    this.moveTo(this.revealX, this.revealY, 1, World.DURATION); // When using relative positioning this was the move function call
    const timeout = setTimeout(() => {
      //   this.rotateTowardsTarget(0, 0);
      this.element.style.zIndex = parseInt(
        this.element.getAttribute('data-layout-number')
      ); // Set z-index so higher layoutNumber will be above
      this.contentHolder.style.visibility = 'visible';
      this.isFloating = false;
      this.element.setAttribute('data-floating', this.isFloating);
      this.resizeContainerRect();
      this.resizeListener = window.addEventListener('resize', () => {
        if (!this.hasHeardResize) {
          this.hasHeardResize = true;
          setTimeout(() => {
            console.log('Resizing container...');
            this.resizeContainerRect();
            this.hasHeardResize = false;
          }, 1000); // Delay to allow for resizing}
        }
      });
      clearTimeout(timeout);
    }, World.DURATION - 10);
  }
  // Set the container height to fit content
  resizeContainerRect() {
    const containerRect = this.container.getBoundingClientRect();
    const elementRect = this.element.getBoundingClientRect();
    if (parseFloat(containerRect.bottom) < elementRect.bottom) {
      this.container.style.height =
        elementRect.bottom - containerRect.top + World.CONTENT_PADDING + 'px';
    }
    // console.log(this.container.style.height);
  }
}

export default Floater;
