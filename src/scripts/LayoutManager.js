/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  static #MAX_WIDTH = 1024;
  static #MIN_WIDTH = 480;
  static #AUTO_FLOATER_HEIGHT = 320;
  //   static #MIN_HEIGHT = 320;
  static #PAGE_PADDING = 20;
  //an instance property so it can be adjusted for small screens
  #pagePadding = LayoutManager.#PAGE_PADDING;
  static #FLOATER_GAP = 10;

  /* Wireframe entries format
    layoutNumber: 1 - this is what we will use to get the information from the wireframe map when building our floaters
    offset: {x: 0, y: 0}
    position: {row: 1, column: 1}
    size: {width: 100, height: 100}
    sizeType: {width: 'auto', height: 'fixed'} which means width is a percentage and height is in pixels
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
    this.#createLayoutMarkers();
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

  #buildLayout() {
    let currentX = this.originX;
    let nextX = 0;
    let currentY = this.originY;
    let nextY = 0;
  }

  #getRowElements(rowNumber) {
    if (!this.smallScreenWidth) {
      return this.wireframe.filter((floater) => {
        return floater.position.row === rowNumber;
      });
    } else {
      //when smallScreen is true then we are putting all columns as extra rows
      return this.wireframe.filter((floater) => {
        //ooh maths :/ so row 1 col 2 is actually row 2, row 1 col 3 is row 3, row 2 col 1 is row 4
        return (
          (floater.position.row - 1) * this.columnCount +
            floater.position.column ===
          rowNumber
        );
      });
    }
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
    }
  }

  #createLayoutMarkers() {
    this.#pagePadding = LayoutManager.#PAGE_PADDING;
    this.originX = this.pageContainerBoundingRect.left;
    this.originY = this.pageContainerBoundingRect.top;
    //because I want to keep the columns as counted from the wireframe (for use in getRowElements) but still want the columnWidth sum to be calculated for small windows...
    let tmpColumnCount = this.columnCount;
    if (this.smallScreenWidth) {
      //page size is less than MIN width
      this.#pagePadding = LayoutManager.#PAGE_PADDING / 2;
      tmpColumnCount = 1;
    } else if (this.largeScreenWidth) {
      //page size is locked to MAX width
      this.originX += (this.screenWidth - this.pageWidth) / 2;
    } else {
      // page size is in between MIN and MAX width
    }
    this.originX += this.#pagePadding;
    this.originY += this.#pagePadding;
    this.columnWidth =
      (this.pageWidth - 2 * this.#pagePadding) / tmpColumnCount;

    console.log(`originX: ${this.originX}`);
    console.log(`originY: ${this.originY}`);
    console.log(`columnWidth: ${this.columnWidth}`);
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
      //   this.columnCount = 1;//I think this should remain as discovered so that we can use it in the getRowElements sums...
    }
    console.log(`Rows: ${this.rowCount}, Columns: ${this.columnCount}`);
  }
}

export default LayoutManager;
