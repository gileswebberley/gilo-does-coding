/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  static #MAX_WIDTH = 1024;
  static #MIN_WIDTH = 480;
  static #MAX_HEIGHT = 768;
  static #MIN_HEIGHT = 320;
  static #PAGE_PADDING = 20;
  static #FLOATER_GAP = 10;

  screenWidth = window.innerWidth; // Set initial screen width
  screenHeight = window.innerHeight; // Set initial screen height

  /* Wireframe entries format
    offset: {x: 0, y: 0}
    position: {row: 1, column: 1}
    size: {width: 100, height: 100}
    sizeType: {width: 'auto', height: 'fixed'}
 */

  constructor(wireframe, pageContainerBoundingRect) {
    this.wireframe = wireframe;
    this.pageContainerBoundingRect = pageContainerBoundingRect; // This is the bounding rect of the page container element
    this.rowCount = 0;
    this.columnCount = 0;

    this.#findMaxRowAndColumn(); // Find the maximum row and column numbers in the wireframe
    this.#setPageDimensions();
    this.hasHeardResize = false; // Flag to prevent multiple resize events
    this.#startListeningForResize();
  }

  #startListeningForResize() {
    this.resizeListener = window.addEventListener('resize', () => {
      if (!this.hasHeardResize) {
        this.hasHeardResize = true;
        //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
        setTimeout(() => {
          this.screenWidth = window.innerWidth; // Set initial screen width
          this.screenHeight = window.innerHeight; // Set initial screen height
          this.#setPageDimensions();
          console.log('Layout shifting from resize...');
          console.log(
            `Screen Width: ${this.screenWidth}, Screen Height: ${this.screenHeight}`
          );
          this.hasHeardResize = false;
        }, 1000);
      }
    });
  }

  #setPageDimensions() {
    this.pageWidth = Math.max(
      LayoutManager.#MIN_WIDTH,
      Math.min(LayoutManager.#MAX_WIDTH, this.screenWidth) //so if the screen is larger than max width it will be set to max width, if it's smaller than min width though it will be set to min width
    );
    if (this.screenWidth < this.pageWidth) {
      this.smallScreen = true;
    }
    this.pageHeight = Math.max(
      LayoutManager.#MIN_HEIGHT - this.pageContainerBoundingRect.top,
      Math.min(LayoutManager.#MAX_HEIGHT, this.screenHeight)
    );
  }

  #findMaxRowAndColumn() {
    this.wireframe.forEach((content) => {
      if (content.position.row > this.rowCount) {
        this.rowCount = content.position.row;
      }
      if (content.position.column > this.columnCount) {
        this.columnCount = content.position.column;
      }
    });
    console.log(`Max Rows: ${this.rowCount}, Max Columns: ${this.columnCount}`);
  }
}

export default LayoutManager;
