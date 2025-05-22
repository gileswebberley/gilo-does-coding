/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  static #MAX_WIDTH = 1024;
  static #MIN_WIDTH = 480;
  static #AUTO_FLOATER_HEIGHT = 320;
  //   static #MIN_HEIGHT = 320;
  static #PAGE_PADDING = 20;
  static #FLOATER_GAP = 10;

  /* Wireframe entries format
    offset: {x: 0, y: 0}
    position: {row: 1, column: 1}
    size: {width: 100, height: 100}
    sizeType: {width: 'auto', height: 'fixed'}
 */

  constructor(wireframe, pageContainerBoundingRect) {
    this.wireframe = wireframe;
    this.pageContainerBoundingRect = pageContainerBoundingRect; // This is the bounding rect of the page container element to check top and left properties
    this.#inspectScreenForLayout();
    this.#startListeningForResize();
  }

  #inspectScreenForLayout() {
    this.screenWidth = window.innerWidth - this.pageContainerBoundingRect.left; // Set initial screen width shifted across by container x position
    this.screenHeight = window.innerHeight - this.pageContainerBoundingRect.top; // Set initial screen height shifted down by container y position
    this.#setPageWidth();
    this.#findMaxRowAndColumn();
  }

  #startListeningForResize() {
    this.resizeListener = window.addEventListener('resize', () => {
      if (!this.hasHeardResize) {
        this.hasHeardResize = true;
        //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
        setTimeout(() => {
          this.#inspectScreenForLayout();
          console.log('Layout shifting from resize...');
          this.hasHeardResize = false;
        }, 1000);
      }
    });
  }

  #setPageWidth() {
    this.smallScreenWidth = false;
    this.largeScreenWidth = false;
    // so...we're trying to make page width in between MIN and MAX width, taking into account that our space is effected by where the page container starts on the left
    this.pageWidth = Math.max(
      LayoutManager.#MIN_WIDTH - this.pageContainerBoundingRect.left,
      Math.min(
        LayoutManager.#MAX_WIDTH - this.pageContainerBoundingRect.left,
        this.screenWidth
      ) //so if the screen is larger than max width it will be set to max width, if it's smaller than min width though it will be set to min width
    );
    console.log(`Page Width: ${this.pageWidth}`);
    // now check whether the screen is smaller than the MIN width and if so we're on a small screen which effects the rows and columns, we want the columns to become rows
    if (this.screenWidth < this.pageWidth) {
      console.log(
        `Small screen width detected: set pageWidth to ${this.screenWidth}...`
      );
      this.smallScreenWidth = true;
      this.pageWidth = this.screenWidth;
    }
    // else is the screen bigger than the MAX width and if so we'll want to work out our centre line differently
    else if (this.screenWidth > this.pageWidth) {
      console.log(`Large screen detected, setting centreLine...`);
      this.largeScreenWidth = true;
      this.centreLine =
        this.pageContainerBoundingRect.left + this.screenWidth / 2;
    }
    //this is just to vertically centre if the screen size is bigger than the page size
    // this.pageHeight = Math.max(
    //   LayoutManager.#MIN_HEIGHT - this.pageContainerBoundingRect.top,
    //   Math.min(LayoutManager.#MAX_HEIGHT, this.screenHeight)
    // );
  }

  #findMaxRowAndColumn() {
    this.rowCount = 0;
    this.columnCount = 0;
    this.wireframe.forEach((content) => {
      if (content.position.row > this.rowCount) {
        this.rowCount = content.position.row;
      }
      if (content.position.column > this.columnCount) {
        this.columnCount = content.position.column;
      }
    });

    if (this.smallScreenWidth) {
      // if we're on a small screen then we want to make columns into extra rows
      this.rowCount *= this.columnCount;
      this.columnCount = 1;
    }
    console.log(`Rows: ${this.rowCount}, Columns: ${this.columnCount}`);
  }
}

export default LayoutManager;
