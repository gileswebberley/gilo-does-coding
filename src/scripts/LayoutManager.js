/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  static #MAX_WIDTH = 1024;
  static #MIN_WIDTH = 512;
  //this is for the height of a row element if sizeType is set to 'auto', kinda like the equivalent of columnWidth
  static #AUTO_FLOATER_HEIGHT = 320;
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
    //This is for the vertical centre alignment in buildLayout - no cos if another page is revealed then it might have changed the height of the viewport so we can't know on resize. We'll have to assume that when these are created there won't be one open...
    this.topMargin = pageContainerBoundingRect.top;
    this.bottomMargin = window.innerHeight - pageContainerBoundingRect.bottom;
    // this.veiwportHeight =
    //   pageContainerBoundingRect.bottom - pageContainerBoundingRect.top;
    console.log(
      `viewportHeight: ${this.veiwportHeight} screenHeight: ${window.innerHeight}`
    );
    // this.layoutArray = [];//let's use the map as it is indexed by their layoutNumber
    this.layoutMap = new Map();
    this.inspectScreenForLayout();
    //think I'm going to move this to the PageManager and remove it from LayoutManager and Floater
    // this.#startListeningForResize();
  }

  getPageHeight() {
    console.log(`PAGE HEIGHT REQUESTED: ${this.pageHeight}`);
    return this.pageHeight;
  }

  getFloaterLayoutObject(layoutNumber) {
    console.log(`get layout for #${layoutNumber}`);
    console.table(this.layoutMap);
    return this.layoutMap.get(layoutNumber);
  }

  inspectScreenForLayout() {
    //Not sure if I need to put some kind of lock flag in here so PageManager can't execute the get functions whilst this is doing it's work??
    this.leftMargin = this.pageContainerBoundingRect.left;
    this.rightMargin = window.innerWidth - this.pageContainerBoundingRect.right;
    this.screenWidth = window.innerWidth - (this.leftMargin + this.rightMargin); // Set initial screen width shifted across by container x position
    this.veiwportHeight =
      window.innerHeight - (this.topMargin + this.bottomMargin);
    console.log(
      `leftMargin: ${this.leftMargin} rightMargin: ${this.rightMargin} screenWidth: ${this.screenWidth}`
    );
    // this.screenHeight = window.innerHeight - this.topMargin; // Set initial screen height shifted down by container y position
    this.#setPageWidth();
    this.#findMaxRowAndColumn();
    this.#createLayoutMarkers();
    this.#buildLayout();
  }

  //   #startListeningForResize() {
  //     this.resizeListener = window.addEventListener('resize', () => {
  //       if (!this.hasHeardResize) {
  //         this.hasHeardResize = true;
  //         //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
  //         setTimeout(() => {
  //           console.log('Layout shifting from resize...');
  //           this.inspectScreenForLayout();
  //           this.hasHeardResize = false;
  //         }, 1000);
  //       }
  //     });
  //   }

  #buildLayout() {
    let currentX = this.originX;
    let nextX = 0;
    let currentY = this.originY;
    let nextY = 0;
    let currentRow = 1;

    for (let i = 1; i <= this.rowCount; i++) {
      const row = this.#getRowElements(i);
      row.forEach((element) => {
        //ok, so, I decided it would be more readable by having the various logic inside self contained functions but I wanted them to be able to share this method's variables (eg currentX) but also refer to this class instance's variables (eg this.smallScreenWidth). I realised that this is the perfect time to use the Function.prototype.call() method to bind it to 'this'
        const { x, w } = calculateX.call(this, element);
        console.log(`calculateX: x:${x} w:${w}`);
        const { y, h } = calculateY.call(this, element, i);
        console.log(`calculateY: y:${y} h:${h}`);
        // this.layoutArray.push({ id: element.layoutNumber, x, y, w, h });
        // if the layout has already been calculated this will simply update the values for each layoutNumber
        console.log(`Making map entry for #${element.layoutNumber}`);
        console.table(element);
        this.layoutMap.set(Number(element.layoutNumber), { x, y, w, h });
      });
    }
    nextY += this.#pagePadding;
    const layoutHeight = nextY - this.topMargin;
    //We need to check whether the available screen height is greater than the height of all of the layout and adjust the y values for each to shift it to vertically centre align. nextY will have been left as the height of all elements but the height of the container may have been changed by the floaters on reveal() :/ hmm, maybe grab the bottom property in the constructor?
    if (layoutHeight < this.veiwportHeight) {
      //loop through the map and add to y property
      const yShift = (this.veiwportHeight - layoutHeight) / 2;
      this.layoutMap.forEach((layoutObject) => {
        layoutObject.y = parseInt(layoutObject.y) + yShift + 'px';
      });
      this.pageHeight = this.veiwportHeight + 'px';
    } else {
      this.pageHeight = nextY - this.topMargin + 'px';
    }
    //No :( this doesn't have this in scope...but ahhh, this is where the Function.call() comes into play :)
    function calculateX(element) {
      currentX = this.smallScreenWidth
        ? this.originX
        : this.originX + this.columnWidth * (element.position.column - 1);
      if (currentX < nextX) {
        //we're dealing with multiple elements inside a single grid square
        currentX = nextX;
        nextX = 0;
      }
      let x = currentX + element.offset.x;
      // let y = currentY + element.offset.y;
      let w =
        element.sizeType.width === 'auto'
          ? (this.columnWidth / 100) * element.size.width
          : element.size.width;
      nextX = currentX + w;
      //using this to round to full pixels and parseInt is apparently slightly more efficient than Math.floor
      w = parseInt(w);
      console.log(`currentX: ${currentX}, nextX: ${nextX}`);
      //to implement the gap between floaters I'll just adjust the final settings now that the numbers have been used to create their 'placeholders' as it were. This is a simplified bit of logic that will create slightly bigger padding on either side but it's all I can think of at the moment without having to loop through again checking whether they are at the beginning of a column and so on - ROOM FOR IMPROVEMENT TO THIS
      x += LayoutManager.#FLOATER_GAP / 2;
      w -= LayoutManager.#FLOATER_GAP;
      //then create a string which can be set as the floater's style.width and style.left
      x += 'px';
      w += 'px';
      return { x, w };
    }

    function calculateY(element, rowNumber) {
      if (rowNumber > currentRow) {
        //we've moved onto the 'next row' in the layout
        currentRow = rowNumber;
        currentY = nextY;
      }
      let y = currentY + element.offset.y;
      let h =
        element.sizeType.width === 'auto'
          ? (LayoutManager.#AUTO_FLOATER_HEIGHT / 100) * element.size.height
          : element.size.width;
      // if this is another element in the same row check whether it's taller than any other element in the row to set the beginning Y for the next row
      if (currentY + h > nextY) {
        nextY = currentY + h;
      }
      // nextX = currentX + w;
      h = parseInt(h);
      console.log(`currentY: ${currentY}, nextY: ${nextY}`);
      y += LayoutManager.#FLOATER_GAP / 2;
      h -= LayoutManager.#FLOATER_GAP;
      y += 'px';
      h += 'px';
      return { y, h };
    }
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
      LayoutManager.#MIN_WIDTH - (this.leftMargin + this.rightMargin),
      Math.min(
        LayoutManager.#MAX_WIDTH - (this.leftMargin + this.rightMargin),
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

    //We're only dealing with whether the container is shifted to the right, we should also consider a layout where there's a sidebar on the right side of the screen...is it as simple as this? No cos it needs to be part of the minmax calculation I think.
    // this.pageWidth -= window.innerWidth - this.pageContainerBoundingRect.right;
  }

  #createLayoutMarkers() {
    this.#pagePadding = LayoutManager.#PAGE_PADDING;
    this.originX = this.pageContainerBoundingRect.left;
    this.originY = this.topMargin;
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
