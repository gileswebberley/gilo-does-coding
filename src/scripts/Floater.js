import World from './World';

class Floater {
  constructor(container, id = crypto.randomUUID(), revealX = 0, revealY = 0) {
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('A valid container element must be provided.');
    }
    //create our moving div
    this.element = document.createElement('div');
    //Add an element to hold the content so it can have it's visibilty toggled
    this.contentHolder = document.createElement('iframe');
    this.contentHolder.className = 'content-holder'; // Add a class for styling
    this.contentHolder.style.border = 'none'; // Remove border for the content holder
    this.contentHolder.style.width = '100%'; // Set width to 100% of the parent element
    this.element.appendChild(this.contentHolder); // Append content holder to the element

    this.container = container;
    this.container.style.zIndex = World.DEPTH * -1; // Set z-index for the container
    this.container.style.position = 'fixed'; // Set position to relative for absolute positioning of children
    this.containerRect = this.container.getBoundingClientRect(); // Get the bounding rectangle of the container

    this.element.style.position = 'absolute'; // Set position to absolute for the floater
    this.element.id = id;
    this.element.className = 'floater'; // Add a class for styling
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
    // this.startX = this.element.getBoundingClientRect().x;
    // this.startY = this.element.getBoundingClientRect().y;
    // console.log(this.startX, this.startY);
    const { x, y, z } = this.createRandomPosition();
    this.moveTo(x, y, z, this.myDuration); // move to initial position
  }

  float() {
    let counter = 0;
    this.contentHolder.style.visibility = 'hidden'; // Hide the content holder initially
    // const myDuration = World.DURATION * this.speed;
    const interval = setInterval(() => {
      if (!this.isFloating || counter > 5) {
        this.isFloating = false; // Stop floating after 25 iterations
        clearInterval(interval);
        this.reveal();
        return;
      }
      const { x, y, z } = this.createRandomPosition();
      counter++;
      this.moveTo(x, y, z, this.myDuration); // Move to new position
      //   console.log(`z-index: ${z}`); // Log the z-index for debugging
    }, this.myDuration);
  }

  createRandomPosition() {
    const actualSize = this.element.getBoundingClientRect();
    // const containerSize = this.container.getBoundingClientRect();
    const x = Math.random() * (this.containerRect.right - actualSize.width); // - this.startX; // Random x position
    const y = Math.random() * (window.innerHeight - actualSize.height); // - this.startY; // Random y position
    const z = Math.floor(Math.random() * World.DEPTH + 1) * -1; // Random z-index between -1 and -100
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
    this.element.style.zIndex = z; // Set z-index for stacking order
    this.setZBasedScale(z); // Adjust scale based on z-index
    this.rotateTowardsTarget(x, y); // Rotate towards the target position
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
    this.element.style.transform = `scale(${10 + 90 / Math.abs(z)}%)`;
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
    // this.element.style.position = 'relative'; // Change position to relative for content display
    const containerRect = this.container.getBoundingClientRect();
    console.table(containerRect);
    console.log(this.element.style.width);
    // this.contentHolder.src = `<p>This is ${this.element.id} test content</p>`;
    this.moveTo(
      this.revealX + containerRect.x,
      this.revealY + containerRect.y,
      1,
      this.myDuration
    ); // Move to the top left corner
    const timeout = setTimeout(() => {
      this.rotateTowardsTarget(0, 0);
      this.contentHolder.style.visibility = 'visible'; // Show the content holder
      clearTimeout(timeout);
    }, this.myDuration - 10);
  }
}

export default Floater;
