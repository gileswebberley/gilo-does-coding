import World from './World';

/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  //largest page size
  static #MAX_WIDTH = World.MAX_PAGE_WIDTH;
  //let's work out a max column width for the grow height functionality
  //   #maxColumnWidth = LayoutManager.#MAX_WIDTH;
  //smallest page size - if smaller than this then it is in small screen mode (ie one column)
  static #MIN_WIDTH = World.MIN_PAGE_WIDTH;
  //this is for the height of a row element if sizeType is set to 'auto', kinda like the equivalent of columnWidth, I think I will have the ability to set a base aspect ratio but I have also been thinking that it would be good if elements could grow in height when the width becomes small....hmm - maybe each element could select aspect or grow?
  //   static #AUTO_FLOATER_HEIGHT = 320; //this needs replacing - now this.rowHeight set according to baseAspectRatio and this.columnWidth
  static #PAGE_PADDING = World.PAGE_PADDING;
  //an instance property so it can be adjusted for small screens
  #pagePadding = LayoutManager.#PAGE_PADDING;
  static #FLOATER_GAP = World.FLOATER_GAP;

  /* Wireframe entries format
    layoutNumber: 1 - this is what we will use to get the information from the wireframe map when building our floaters
    offset: {x: 0, y: 0}
    position: {row: 1, column: 1}
    size: {width: 100, height: 100}
    sizeType: {width: 'auto', height: 'fixed'} which means width is a percentage and height is in pixels
 */
  //I'm going to add aspect ratio sizing so set your grid base a.r. then you can use percentage sizes - control grid height on width - we'll also let the height be controlled by the width, so it can grow as width becomes smaller - it's a bit fuzzy but let's start with a.r.
  constructor(wireframe, pageContainer, baseAspectRatio = '16:9') {
    // this.baseAspectRatio = baseAspectRatio;
    const ratioSplitString = baseAspectRatio.split(':');
    this.baseHeightRatio = ratioSplitString[1];
    this.baseWidthRatio = ratioSplitString[0];
    //used in createLayoutMarkers to produce this.rowHeight
    this.aspectHeightMultiplier = this.baseHeightRatio / this.baseWidthRatio;
    console.log(
      `----------------Aspect ratio H/W: ${this.aspectHeightMultiplier}`
    );
    this.wireframe = wireframe;
    this.wireframe
      .sort(this.#compareWireframeRow)
      .sort(this.#compareWireframeColumns);
    // this.wireframe.sort(this.#compareWireframeColumns);
    this.pageContainer = pageContainer;
    // this.pageContainerBoundingRect = pageContainer.getBoundingClientRect(); // This is the bounding rect of the page container element to check top and bottom margins for viewportHeight calculation later
    //This is for the vertical centre alignment in buildLayout - no cos if another page is revealed then it might have changed the height of the viewport so we can't know on resize. We'll have to assume that when these are created there won't be one open...
    // this.topMargin = this.pageContainerBoundingRect.top;
    // this.bottomMargin =
    //   window.innerHeight - this.pageContainerBoundingRect.bottom;
    this.layoutMap = new Map();
    this.inspectScreenForLayout();
  }

  //I need to sort the wireframe so that it is laid out as row 1 col 1 row 1 col 2 row 2 col 1 etc {2,1}{1,1}{1,3}{2,2}{1,2}{2,3} - I am going to sort by row first and then for each row I'll sort by column
  #compareWireframeRow(a, b) {
    const rowA = a.position.row;
    const rowB = b.position.row;
    return rowA - rowB;
  }
  #compareWireframeColumns(a, b) {
    //this is to take care of when we move to the next row which has already been sorted
    if (a.position.row !== b.position.row) return 0;
    const colA = a.position.column;
    const colB = b.position.column;
    return colA - colB;
  }

  getPageHeight() {
    // console.log(`PAGE HEIGHT REQUESTED: ${this.pageHeight}`);
    return this.pageHeight;
  }

  //This is the main public access for the page manager to get each floater's layout info
  getFloaterLayoutObject(layoutNumber) {
    // console.log(`get layout for #${layoutNumber}`);
    // console.table(this.layoutMap);
    return this.layoutMap.get(layoutNumber);
  }

  //Need to find a way to recalculate top and bottom margin even if this page is open???
  inspectScreenForLayout() {
    this.pageContainerBoundingRect = this.pageContainer.getBoundingClientRect();
    //Not sure if I need to put some kind of lock flag in here so PageManager can't execute the get functions whilst this is doing it's work??
    this.leftMargin = this.pageContainerBoundingRect.left;
    this.rightMargin = window.innerWidth - this.pageContainerBoundingRect.right;
    this.screenWidth = window.innerWidth - (this.leftMargin + this.rightMargin); // Set initial screen width shifted across by container x position
    this.topMargin = this.pageContainerBoundingRect.top;
    this.bottomMargin =
      window.innerHeight - this.pageContainerBoundingRect.bottom;
    this.veiwportHeight =
      window.innerHeight - (this.topMargin + this.bottomMargin);
    // console.log(
    //   `leftMargin: ${this.leftMargin} rightMargin: ${this.rightMargin} screenWidth: ${this.screenWidth}`
    // );
    // console.log(
    //   `viewportHeight: ${this.veiwportHeight} screenHeight: ${window.innerHeight}`
    // );
    // this.screenHeight = window.innerHeight - this.topMargin; // Set initial screen height shifted down by container y position
    this.#setPageWidth();
    this.#findMaxRowAndColumn();
    this.#createLayoutMarkers();
    this.#buildLayout();
  }

  #buildLayout() {
    let currentX = this.originX;
    let nextX = 0;
    let currentY = this.originY;
    let nextY = 0;
    let currentRow = 1;
    //So we have the height based on the width and whether the mode (to be implemented) is aspect or grow....
    let currentWidthModifier = 1;
    // let currentColumn = 1;
    // let lastColumn = 1;

    for (let i = 1; i <= this.rowCount; i++) {
      const row = this.#getRowElements(i);
      row.forEach((element) => {
        //ok, so, I decided it would be more readable by having the various logic inside self contained functions but I wanted them to be able to share this method's variables (eg currentX) but also refer to this class instance's variables (eg this.smallScreenWidth). I realised that this is the perfect time to use the Function.prototype.call() method to bind it to 'this'
        const { x, w } = calculateX.call(this, element, i);
        // console.log(`calculateX: x:${x} w:${w}`);
        const { y, h } = calculateY.call(this, element, i);
        // console.log(`calculateY: y:${y} h:${h} row number:${i}`);
        // if the layout has already been calculated this will simply update the values for each layoutNumber
        console.log(`Making layoutMap entry for #${element.layoutNumber}`);
        // console.table(element);
        this.layoutMap.set(Number(element.layoutNumber), { x, y, w, h });
      });
    }
    //put a bit of space at the bottom before setting the total layout height
    nextY += this.#pagePadding;
    const layoutHeight = nextY; // - this.topMargin;
    //We need to check whether the available screen height is greater than the height of all of the layout and adjust the y values for each to shift it to vertically centre align. nextY will have been left as the height of all elements but the height of the container may have been changed by the floaters on reveal() :/ hmm, maybe grab the bottom property in the constructor?
    const yShift = (this.veiwportHeight - layoutHeight) / 2;
    if (layoutHeight < this.veiwportHeight) {
      console.log(`shifting y down for centering.....................!!!`);
      //loop through the map and add to y property
      //   const yShift = (this.veiwportHeight - layoutHeight) / 2;
      this.layoutMap.forEach((layoutObject) => {
        layoutObject.y = parseInt(layoutObject.y) + yShift + 'px';
      });
      this.pageHeight = this.veiwportHeight + 'px';
    } else {
      console.log(`making page bigger for scrolling....................`);
      this.pageHeight = layoutHeight + 'px'; // thought it wasn't good logic but it turned out to be me forgetting to add the 'px'!!
    }

    //No :( this doesn't have this in scope...but ahhh, this is where the Function.call() comes into play :)
    //IMPORTANT - This must be called BEFORE calculateY!!!!!!!!!!!!!!!!!!!!!!!!
    function calculateX(element, rowNumber) {
      if (rowNumber > currentRow) {
        // reset the x position (like hitting return for a new-line) this is why it's called first
        nextX = this.originX;
      }
      if (this.smallScreenWidth) {
        currentX = this.originX;
        if (
          currentX !== this.originX ||
          (nextX < currentX + this.columnWidth && nextX !== 0)
        ) {
          //we're dealing with multiple elements inside a single grid square
          currentX = nextX;
        }
      } else {
        //I'm trying to get it so I can have a row that only has something in a later column eg {row:2, column:2} when there is no {row:2, column:1}
        currentX =
          this.originX + this.columnWidth * (element.position.column - 1);
        if (currentX < nextX) {
          currentX = nextX;
        }
      }
      //width must be a percentage!! we'll want to check if height percentage should grow
      let w = (this.columnWidth / 100) * element.size.width;
      if (element.sizeType === 'grow') {
        currentWidthModifier =
          ((this.maxColumnWidth / 100) * element.size.width) / w;
        console.log(
          `++++++++++++++++ current width modifier: ${currentWidthModifier}`
        );
      } else {
        currentWidthModifier = 1;
      }
      //Making offset a percentage
      let x = currentX + element.offset.x * (w / 100);
      nextX = currentX + w; //x + w;
      //using this to round to full pixels and parseInt is apparently slightly more efficient than Math.floor
      w = parseInt(w);
      //   console.log(`currentX: ${currentX}, nextX: ${nextX}`);
      //to implement the gap between floaters I'll just adjust the final settings now that the numbers have been used to create their 'placeholders' as it were. This is a simplified bit of logic that will create slightly bigger padding on either side but it's all I can think of at the moment without having to loop through again checking whether they are at the beginning of a column and so on
      x += LayoutManager.#FLOATER_GAP / 2;
      w -= LayoutManager.#FLOATER_GAP;
      //stop the offset making the box go off the edge of a small screen
      if (this.smallScreenWidth) w -= element.offset.x * (w / 100);
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
      //'auto' now means it wants to grow from it's clamp percentage if width is below it's max - no, we'll have 'auto' 'grow' or 'fixed'
      let h =
        element.sizeType === 'auto'
          ? (this.rowHeight / 100) * element.size.height
          : element.sizeType === 'grow'
          ? (this.rowHeight / 100) *
            (element.size.height * currentWidthModifier)
          : element.size.height;
      let y = currentY + element.offset.y * (h / 100);
      // if this is another element in the same row check whether it's taller than any other element in the row to set the beginning Y for the next row. If there's a y-offset it's probably a column that has become a row so we'll allow for the positioning to still be offset by doing this little check, x-offset is looked after in calculateX.
      if (currentY + h > nextY) {
        nextY =
          this.smallScreenWidth && element.offset.y !== 0
            ? y + h
            : currentY + h;
      }
      h = parseInt(h);
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
    // console.log(`Page Width: ${this.pageWidth}`);
    // now check whether the screen is smaller than the MIN width and if so we're on a small screen which effects the rows and columns, we want the columns to become rows
    if (this.screenWidth < this.pageWidth) {
      //   console.log(
      //     `Small screen width detected: set pageWidth to ${this.screenWidth}...`
      //   );
      this.smallScreenWidth = true;
      this.pageWidth = this.screenWidth;
    }
    // else is the screen bigger than the MAX width and if so we'll want to work out our centre line differently
    else if (this.screenWidth > this.pageWidth) {
      //   console.log(`Large screen detected....`);
      this.largeScreenWidth = true;
    }

    //We're only dealing with whether the container is shifted to the right, we should also consider a layout where there's a sidebar on the right side of the screen...is it as simple as this? No cos it needs to be part of the minmax calculation I think.
    // this.pageWidth -= window.innerWidth - this.pageContainerBoundingRect.right;
  }

  //Need to keep in mind that we are positioning the floaters with absolute which is relative to the container!!
  #createLayoutMarkers() {
    this.#pagePadding = LayoutManager.#PAGE_PADDING;
    this.originX = 0; //this.pageContainerBoundingRect.left;
    this.originY = 0; // this.topMargin;
    //this is for working out height when set to 'auto' which will grow when width is shrunk
    this.maxColumnWidth =
      (LayoutManager.#MAX_WIDTH - 2 * this.#pagePadding) / this.columnCount;
    //because I want to keep the columns as counted from the wireframe (for use in getRowElements) but still want the columnWidth sum to be calculated for small windows...
    let tmpColumnCount = this.columnCount;
    if (this.smallScreenWidth) {
      //page size is less than MIN width
      this.#pagePadding = LayoutManager.#PAGE_PADDING / 2;
      tmpColumnCount = 1;
      this.maxColumnWidth = LayoutManager.#MIN_WIDTH - 2 * this.#pagePadding;
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
    //I'm adding the aspect ratio based grid square height now too
    this.rowHeight = this.columnWidth * this.aspectHeightMultiplier;
    // console.log(`originX: ${this.originX}`);
    // console.log(`originY: ${this.originY}`);
    console.log(`columnWidth: ${this.columnWidth}`);
    console.log(`rowHeight: ${this.rowHeight}`);
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
    console.log(
      `Rows: ${this.rowCount}, Columns: ${
        this.smallScreenWidth ? 1 : this.columnCount
      }`
    );
  }
}

export default LayoutManager;
