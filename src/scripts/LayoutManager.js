'use strict';
import World from './World';

/**
 * * Instance Variables:
 * - baseHeightRatio: Number - Height part of the base aspect ratio.
 * - baseWidthRatio: Number - Width part of the base aspect ratio.
 * - aspectHeightMultiplier: Number - Ratio of height/width for aspect calculations.
 * - verticalCentre: Boolean - Whether to vertically center elements in rows.
 * - wireframe: Array - The layout wireframe describing floaters.
 * - layoutMap: Map - Maps layoutNumber to {x, y, w, h} for each floater.
 * - leftMargin: Number - Left margin of the container.
 * - rightMargin: Number - Right margin of the container.
 * - screenWidth: Number - Usable width for layout.
 * - topMargin: Number - Top margin of the container.
 * - bottomMargin: Number - Bottom margin of the container.
 * - veiwportHeight: Number - Usable height for layout (typo: should be 'viewportHeight').
 * - pageWidth: Number - Calculated page width.
 * - smallScreenWidth: Boolean - True if in small screen mode.
 * - largeScreenWidth: Boolean - True if in large screen mode.
 * - rowCount: Number - Number of rows in the layout.
 * - columnCount: Number - Number of columns in the layout.
 * - pagePadding: Number - Padding around the page.
 * - originX: Number - X origin for layout.
 * - originY: Number - Y origin for layout.
 * - maxColumnWidth: Number - Maximum width of a column.
 * - maxRowHeight: Number - Maximum height of a row (aspect-based).
 * - pageXBound: Number - Right boundary for layout (used for wrapping).
 * - columnWidth: Number - Width of a column.
 * - rowHeight: Number - Height of a row (aspect-based).
 * - pageHeight: String - Calculated page height (with 'px').
 * - clamped: Boolean - Used during layout calculation to indicate width clamping.
 * - clampedWidth: Number|null - Used during layout calculation for clamped width.
 * - wrapMe: Boolean - Used during layout calculation for wrapping.
 * - forceGrow: Boolean - Used during layout calculation for forced height growth.
 * - lastBottom: Number - Used during layout calculation for tracking bottom Y.
 */

/* Ok, so this will be sent the wireframe from it's page manager and work out the postions and sizes for all of the floaters (by index) and also keep an eye on page resizing. I will want to be able to call, say, getLayout(floaterIndex) and it will return {x,y,w,h} */
class LayoutManager {
  //Having almost completed development I'm not sure why I started with these as static vars?
  //largest page size
  static #MAX_WIDTH = World.MAX_PAGE_WIDTH;
  //let's work out a max column width for the grow height functionality
  //   #maxColumnWidth = LayoutManager.#MAX_WIDTH;
  //smallest page size - if smaller than this then it is in small screen mode (ie one column)
  static #MIN_WIDTH = World.MIN_PAGE_WIDTH;
  //this is for the height of a row element if sizeType is set to 'auto', kinda like the equivalent of columnWidth, I think I will have the ability to set a base aspect ratio but I have also been thinking that it would be good if elements could grow in height when the width becomes small....hmm - maybe each element could select aspect or grow?
  //   static #AUTO_FLOATER_HEIGHT = 320; //this needs replacing - now this.rowHeight set according to baseAspectRatio and this.columnWidth
  static #PAGE_PADDING = World.PAGE_PADDING;
  static #FLOATER_GAP = World.FLOATER_GAP;

  /* Wireframe entries format
    layoutNumber: 1 - this is what we will use to get the information from the wireframe map when building our floaters
    offset: {x: 0, y: 0}
    position: {row: 1, column: 1}
    size: {width: 100, height: 100}
    sizeType: {width: 'auto', height: 'fixed'} which means width is a percentage and height is in pixels
 */
  //I'm going to add aspect ratio sizing so set your grid base aspect ratio then you can use percentage sizes - control grid height on width - we'll also let the height be controlled by the width, so it can grow as width becomes smaller - it's a bit fuzzy but let's start with aspect ratio - I've added some functionality to make row elements centre vertically if the previous column has make it taller than the element being calculated; I'll make this optional
  constructor(
    wireframe,
    pageContainerBoundingRect,
    baseAspectRatio = '16:9',
    verticalCentre = true
  ) {
    // this.baseAspectRatio = baseAspectRatio;
    const ratioSplitString = baseAspectRatio.split(':');
    this.baseHeightRatio = ratioSplitString[1];
    this.baseWidthRatio = ratioSplitString[0];
    //used in createLayoutMarkers to produce this.rowHeight
    this.aspectHeightMultiplier = this.baseHeightRatio / this.baseWidthRatio;
    // console.log(
    //   `----------------Aspect ratio H/W: ${this.aspectHeightMultiplier}`
    // );
    this.verticalCentre = verticalCentre;
    //to improve the 'grow' functionality I think I need to make the min size based on max size
    // LayoutManager.#MIN_WIDTH =
    //   LayoutManager.#MAX_WIDTH * this.aspectHeightMultiplier;
    this.wireframe = wireframe;
    this.wireframe
      .sort(this.#compareWireframeRow)
      .sort(this.#compareWireframeColumns);
    this.layoutMap = new Map();
    // start the 'brain' working with the initial bounding rect
    this.inspectScreenForLayout(pageContainerBoundingRect);
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
  //The solution is to make sure that the pageContainer is set to it's initial size before calling this, whatever calls it can then getPageHeight and set the container to that afterwards. See PageManager for explaination of why we send the bounding rect
  inspectScreenForLayout(pageContainerBoundingRect) {
    this.leftMargin = pageContainerBoundingRect.left;
    this.rightMargin = window.innerWidth - pageContainerBoundingRect.right;
    this.screenWidth = window.innerWidth - (this.leftMargin + this.rightMargin); // Set initial screen width taking into account the left and right boundaries of the pageContainer
    this.topMargin = pageContainerBoundingRect.top;
    this.bottomMargin = window.innerHeight - pageContainerBoundingRect.bottom;
    //This is the available screen space so if the layout is taller then pageHeight will be the height of the layout, and if it's smaller then this will be used to centre the layout vertically
    this.veiwportHeight =
      window.innerHeight - (this.topMargin + this.bottomMargin);
    //The call order is important so don't switch these around
    this.#setPageWidth();
    this.#findMaxRowAndColumn();
    this.#createLayoutMarkers();
    this.#buildLayout();
  }

  //This method is why we sort the elements' wireframe in the constructor
  #buildLayout() {
    //These are so each element can be 'aware' of the position of other elements essentially
    // I THOUGHT I MIGHT HAVE A MEMORY LEAK AS THE 'MEMORY USAGE' IN CHROME WAS SCREAMING ABOUT IT BUILDING UP (ALL THE WAY TO 1GB+!!) AND SO I EXTRACTED THE calculateX/Y METHODS AS IT WAS ALL I COULD THINK OF THAT MIGHT NOT BE GARBAGE COLLECTED. These variables were originally defined in here and so were the methods, I used the call() method to bind them and it was all working correctly (I had never found a need for this methodology before so it seemed like a perfect solution) however I have moved them out now and the memory usage seems to be more under control so I shall have to investigate this further (or if you're reading this and can explain then please do contact me, I'd love some mentoring for exactly this kind of thing!!) - I have experimented now and I have the funny feeling that it is actually being caused by the HMR (hot reloading) that Vite does during development! There is a couple of mentions on stack overflow and Google's AI answer seems to imply that this is a thing! I'll leave it now because I think it's fine and I can always change back if I realise that it was a genius way of doing things after all!! :D
    this.currentX = this.originX;
    this.nextX = 0;
    this.currentY = this.originY;
    this.nextY = 0;
    this.currentRow = 1;
    this.currentColumn = 1;
    this.nthChild = 0; //This is because I want to be able to know about where the element sits inside their own containing grid square...It's going to be for wrapping behaviour and whether to attach a offsetY, namely it will be like a text wrap with the alignment to the left (I hope)
    this.nthWrapped = 0;
    //So we have the height based on the width and whether the mode is grow....
    this.currentWidthModifier = 1;

    for (let i = 1; i <= this.rowCount; i++) {
      const row = this.#getRowElements(i);
      row.forEach((element) => {
        //ok, so, I decided it would be more readable by having the various logic inside self contained functions but I wanted them to be able to share this method's variables (eg currentX) but also refer to this class instance's variables (eg this.smallScreenWidth). I realised that this is the perfect time to use the Function.prototype.call() method to bind it to 'this' - UPDATE: please read my note at the top about this being the culpret of a possible memory leak.
        // const { x, w } = calculateX.call(this, element, i);
        const { x, w } = this.#calculateX(element, i);
        // console.log(`calculateX: x:${x} w:${w}`);
        // const { y, h } = calculateY.call(this, element, i);
        const { y, h } = this.#calculateY(element, i);
        // console.log(`Making layoutMap entry for #${element.layoutNumber}`);
        // if the layout has already been calculated this will simply update the values for each layoutNumber which is why we're using a map rather than array
        this.layoutMap.set(Number(element.layoutNumber), { x, y, w, h });
      });
    }
    //changed these to instance variables as part of the memory leak investigation
    this.nextY += this.pagePadding;
    const layoutHeight = this.nextY;
    // //add the padding to the bottom before setting the total layout height
    // nextY += this.pagePadding;
    // const layoutHeight = nextY; // - this.topMargin; this is not needed as we are positioning with absolute so it's relative to the container
    //We need to check whether the available screen height is greater than the height of all of the layout and adjust the y values for each to shift it to vertically centre align. nextY will have been left as the height of all elements but the height of the container may have been changed by the floaters on reveal() which is why it's important to read the comment above inspectScreenForLayout
    if (layoutHeight < this.veiwportHeight) {
      // console.log(`shifting y down for centering.....................!!!`);
      const yShift = (this.veiwportHeight - layoutHeight) / 2;
      //loop through the map and add to y property
      this.layoutMap.forEach((layoutObject) => {
        layoutObject.y = parseInt(layoutObject.y) + yShift + 'px';
      });
      this.pageHeight = this.veiwportHeight + 'px';
    } else {
      // console.log(`making page bigger for scrolling....................`);
      this.pageHeight = layoutHeight + 'px'; // thought it wasn't good logic but it turned out to be me forgetting to add the 'px' :D !!
    }

    //No this doesn't have 'this' in scope...but ah-ha, this is where the Function.call() comes into play :) Is this creating the memory build up cos I can't find any forgotten timeouts or intervals or excess event listeners?? Could it just be down to the hot reloading during development though??
    //IMPORTANT - This must be called BEFORE calculateY!!!!!!!!!!!!!!!!!!!!!!!!
    // function calculateX(element, rowNumber) {
    //   //clamping can only be set on auto sized elements - changed this when using it for an actual layout, it can now be set on grow elements too
    //   this.clamped = false;
    //   this.clampedWidth = null;
    //   this.wrapMe = false;
    //   this.forceGrow = false;
    //   // reset the x position (like hitting return for a new-line) this is why this called before calculateY - although we do not set the currentRow here because it will be checked and changed in the calculateY (where it should be)
    //   if (rowNumber > currentRow) {
    //     nextX = this.originX;
    //     nthChild = 0; //it's a new grid square
    //     nthWrapped = 0;
    //   }
    //   //We're only passing the row number because of the column folding that we're performing for small screens so this is a bit more simple - if it's a new row because of the small screen it's still within the same grid square if the column number's the same
    //   if (element.position.column !== currentColumn) {
    //     currentColumn = element.position.column;
    //     nthChild = 0;
    //     nthWrapped = 0; //reset the wrapped marker now we're in a new column
    //   } else if (rowNumber === currentRow) {
    //     //we're in the same grid square as the last element
    //     nthChild++;
    //   }

    //   if (this.smallScreenWidth) {
    //     currentX = this.originX;
    //     // if (nextX < currentX + this.columnWidth && nextX !== 0) {
    //     if (nthChild > 0 && nextX !== 0) {
    //       //nextX !== 0 is for the first element on a page
    //       //we're dealing with multiple elements inside a single grid square
    //       currentX = nextX;
    //     }
    //   } else {
    //     //I'm trying to get it so I can have a row that only has something in a later column eg {row:2, column:2} when there is no {row:2, column:1}. If this is the case then nextX has been reset to originX in the new-row check so this currentX will not be less than nextX unless there is already something in this grid square (hence the additional check in comparison to the smallScreenWidth check)
    //     currentX =
    //       this.originX + this.columnWidth * (element.position.column - 1);
    //     // if (currentX < nextX) {
    //     if (nthChild > 0 && nextX !== 0) {
    //       // || currentX < nextX) {
    //       //NO, if we did row:1 col:2 followed by row:2 col:3 then nthChild would be zero whereas if it was row:1 col:2 followed by row:2 col:2 then nthChild would be one...added a check before nthChild++ to solve this I think
    //       //we're dealing with multiple elements inside a single grid square or an element in a column next to an empty one
    //       currentX = nextX;
    //     }
    //   }
    //   //width must be a percentage!! we'll want to check if height percentage should grow
    //   //adding the ability to set a minimum width with clamp: Xpx so we can do wrap (I'm thinking, when they get too small we'll wrap them!? particularly for images/videos)
    //   let w = (this.columnWidth / 100) * element.size.width;
    //   //check that our natural width is not smaller than our clamped width
    //   if (element.clamp !== null) {
    //     // if (element.clamp !== null && element.sizeType === 'auto') {
    //     //we have to ignore the clamp size if the screen (column width on small screen) is smaller, to avoid going off the edge
    //     this.clampedWidth = Math.min(element.clamp, this.columnWidth);
    //     //set this to true if the calculated width has gone below the clamped width
    //     this.clamped = w < this.clampedWidth;
    //     if (this.clamped) {
    //       w = this.clampedWidth;
    //       console.log(
    //         `I've had my width clamped - row:${element.position.row} column:${element.position.column}`
    //       );
    //     }
    //   }
    //   //the area of the elements was becoming much bigger on a small screen so this essentially compares the max width of a column with the width of the single column used in small screen layout and so adjusts accordingly - it has kept the area within <4% of it's initial stated size (ie with text content it resizes so that the same amount of text fits into the element without adding scrolling or excess space at the top and bottom - this is what I wanted so you can do the layout sizing for the content and not worry about it)
    //   const smallScreenMaxWidthAdjuster =
    //     this.maxColumnWidth / (LayoutManager.#MIN_WIDTH - 2 * this.pagePadding);
    //   if (element.sizeType === 'grow' || element.size.width > 100) {
    //     currentWidthModifier =
    //       (((this.maxColumnWidth * smallScreenMaxWidthAdjuster) / 100) *
    //         element.size.width) /
    //       w;
    //     //Trying to deal with elements that are > 100% wide when going onto a small screen
    //     if (this.smallScreenWidth && element.size.width > 100) {
    //       const adjustment = 100 / element.size.width;
    //       console.log(`adjustment for over width element: ${adjustment}`);
    //       w *= adjustment; //yep, keeps the area
    //       currentWidthModifier *= adjustment; //so that the height is adjusted accordingly
    //       this.forceGrow = true; //so an element spans columns in desktop view which means it's content is probably designed to fit nicely, if it's now made smaller I think it should grow in height even if it's sizeType is auto - I'll make some pages and review this decision
    //     }
    //   } else {
    //     currentWidthModifier = 1 * smallScreenMaxWidthAdjuster;
    //   }
    //   //Blimey, finally here's the beginnings of the wrapping functionality - calculate how far it's going over the edge of the page - this needs to be adjusted to deal with wrapping in columns rather than just the page
    //   let overflowSize = 0;
    //   // console.log(`set up overflowSize: ${overflowSize}`);
    //   if (this.smallScreenWidth) {
    //     overflowSize += this.columnWidth + this.pagePadding;
    //   } else {
    //     //if not a small screen set the overflow boundary to the edge of the column we're in
    //     overflowSize +=
    //       this.originX + this.columnWidth * element.position.column;
    //   }

    //   //add any offsetX to the position, making offset a percentage of the element width
    //   const offsetWidth = element.offset.x * (w / 100);
    //   let x = currentX + offsetWidth;
    //   //stop the offset making the box go off the edge of a small screen or stretch it if it's offset to the left - add a force grow behaviour to account for this (ie change the height accordingly) - but not if it's wrapped or in the same grid square
    //   if (
    //     this.smallScreenWidth &&
    //     offsetWidth !== 0 &&
    //     overflowSize < x + w + this.pagePadding &&
    //     nthChild === 0 //rowNumber > currentRow
    //   ) {
    //     this.forceGrow = true;
    //     const unadjustedWidth = w;
    //     w -= offsetWidth;
    //     currentWidthModifier *= unadjustedWidth / w;
    //   }
    //   overflowSize -= x - offsetWidth + w; // - this.pagePadding; //kept noticing things being wrapped by 10px on a small screen so put the pagePadding back onto this sum, oh no, it leads to wrapping in the first column on a large screen not work ffs
    //   // console.log(`checked overflowSize: ${overflowSize}`);
    //   // if it is going over the edge of the page put it below the previous element in the row and drag it back so it starts a new sub-row. I've got a problem with offsetX pushing an item in the last column across the page boundary so I've created the pageXBounds variable in createLayotMarkers. I need the overflowSize calculation to remove the offsetWidth so it works in the first column though!?
    //   if (
    //     (overflowSize < 0 && element.size.width <= 100) ||
    //     (x + w > this.pageXBound && nthChild > 0)
    //   ) {
    //     console.log(
    //       `WRAP ME - ${overflowSize} row:${element.position.row} col:${element.position.column} nthChild:${nthChild}`
    //     );
    //     this.wrapMe = true;
    //     nthWrapped = nthChild; //I'm putting this in so that calculateY will know if it's dealing with an element inside the same grid square that comes after a wrapped element
    //     //overflowSize is clearly a negative number if we're in here so + to move it backwards
    //     // x += overflowSize - LayoutManager.#FLOATER_GAP / 2;//original style of wrapping but it was a bit ugly and could produce a column of wrapped elements (eg - you have 4 elements in a column and there's only room for 2, you end up with 2 in a row and then 2 in a column below)
    //     x =
    //       this.originX +
    //       (!this.smallScreenWidth &&
    //         this.columnWidth * (element.position.column - 1));
    //     currentX = x;
    //     x += offsetWidth;
    //   }
    //   //we ignore the offset here so that this element's offset doesn't shift the following elements - if I implement a wrap functionality would I want to change this? I don't think so cos offset is kinda for forcing overlapping behaviour.
    //   nextX = currentX + w; //x + w;
    //   //using this to round to full pixels and parseInt is apparently slightly more efficient than Math.floor
    //   w = parseInt(w);
    //   //to implement the gap between floaters I'll just adjust the final settings now that the numbers have been used to create their 'placeholders' as it were. This is a simplified bit of logic that will create slightly bigger padding on either side but it's all I can think of at the moment without having to loop through again checking whether they are at the beginning of a column and so on
    //   // x += !this.wrapMe && LayoutManager.#FLOATER_GAP / 2;
    //   x += LayoutManager.#FLOATER_GAP / 2;
    //   w = Math.max(w - LayoutManager.#FLOATER_GAP, 1); //in case the size is smaller than floater gap
    //   //then create a string which can be set as the floater's style.width and style.left
    //   x += 'px';
    //   w += 'px';
    //   return { x, w };
    // }

    //call AFTER calculateX
    // function calculateY(element, rowNumber) {
    //   //if we are on a new row then ignore y-offset
    //   let isNewRow = false;

    //   if (rowNumber > currentRow) {
    //     //we've moved onto the 'next row' in the layout
    //     currentRow = rowNumber;
    //     currentY = Math.max(nextY, this.lastBottom);
    //     isNewRow = true;
    //   }
    //   // else if (this.wrapMe) {
    //   //   currentY = this.lastBottom;//No, this makes the next column start at the wrapped height
    //   // }
    //   //'auto' now means it wants to grow from it's clamp percentage if width is below it's max - no, we'll have 'auto' 'grow' or 'fixed' - see ContentTemplateExample for jsdocs of the layout object....coming back to this, I'm going to make grow based on the max row height otherwise it's very close to fixed in behaviour (forceGrow is related to offset based width adjustment that occurs on small screens)
    //   //gosh, this has grown to a bit of a mess of ternary operators but essentially it's dealing with the various sizeType options including keeping the same aspect ratio of elements that have been 'clamped' to a minimum width (forceGrow is for >100% width and for offset driven width resizing on small screens)
    //   let h =
    //     element.sizeType === 'auto' && !this.forceGrow
    //       ? this.clamped
    //         ? this.clampedWidth *
    //           this.aspectHeightMultiplier *
    //           (element.size.height / element.size.width)
    //         : (this.rowHeight / 100) * element.size.height
    //       : element.sizeType === 'grow' || this.forceGrow
    //       ? (this.maxRowHeight / 100) *
    //         element.size.height *
    //         currentWidthModifier
    //       : element.size.height; //this is if the height is a fixed number of pixels
    //   //adding the clamp functionality so I won't over-confuse the original sizing, I'll just take care of it seperately - oh no, I'll add it into the 'auto' function. Simply remove offsetY when on a small screen because it ends up messy and we are wrapping columns into rows so it doesn't seem appropriate
    //   let y =
    //     currentY +
    //     (this.smallScreenWidth //nthChild === 0 &&
    //       ? 0
    //       : element.offset.y * (h / 100));
    //   //for wrap behaviour we'll store the bottom of each for the next to wrap underneath
    //   if (this.wrapMe) {
    //     y = this.lastBottom; // - Math.abs(element.offset.y) * (this.rowHeight / 100);
    //     //  nextY = y + h;
    //     if (this.smallScreenWidth) currentY = y;
    //   }
    //   y += LayoutManager.#FLOATER_GAP / 2;
    //   // if this is another element in the same row check whether it's taller than any other element in the row to set the beginning Y for the next row. If there's a y-offset it's probably a column that has become a row for a small screen, so we'll allow for the positioning to still be offset by doing this little check, x-offset is looked after in calculateX.
    //   if (y + h > nextY) {
    //     // && !this.wrapMe
    //     nextY = y + h;
    //   } else if (
    //     !isNewRow &&
    //     this.verticalCentre
    //     // && !(nthWrapped > 0 && nthChild > nthWrapped)
    //   ) {
    //     // && !(nthWrapped > 0) && !(nthChild > nthWrapped)
    //     // console.log(
    //     //   `Y is being adlusted because it needs to be vertically centred`
    //     // );
    //     y += (nextY - (y + h)) / 2;
    //   }
    //   this.lastBottom = y + h;
    //   h = parseInt(h);
    //   h = Math.max(h - LayoutManager.#FLOATER_GAP, 1); //in case the size is smaller than floater gap
    //   y += 'px';
    //   h += 'px';
    //   return { y, h };
    // }
  }

  //----------------------------------------------------------------------------

  //IMPORTANT - This must be called BEFORE calculateY !!!!!!!!!!!!!!!!!!!!!!!!
  #calculateX(element, rowNumber) {
    //clamping can only be set on auto sized elements - changed this when using it for an actual layout, it can now be set on grow elements too
    this.clamped = false;
    this.clampedWidth = null;
    this.wrapMe = false;
    this.forceGrow = false;
    // reset the x position (like hitting return for a new-line) this is why this called before calculateY - although we do not set the currentRow here because it will be checked and changed in the calculateY (where it should be)
    if (rowNumber > this.currentRow) {
      this.nextX = this.originX;
      this.nthChild = 0; //it's a new grid square
      this.nthWrapped = 0;
    }
    //We're only passing the row number because of the column folding that we're performing for small screens so this is a bit more simple - if it's a new row because of the small screen it's still within the same grid square if the column number's the same
    if (element.position.column !== this.currentColumn) {
      this.currentColumn = element.position.column;
      this.nthChild = 0;
      this.nthWrapped = 0; //reset the wrapped marker now we're in a new column
    } else if (rowNumber === this.currentRow) {
      //we're in the same grid square as the last element
      this.nthChild++;
    }

    if (this.smallScreenWidth) {
      this.currentX = this.originX;
      // if (nextX < currentX + this.columnWidth && nextX !== 0) {
      if (this.nthChild > 0 && this.nextX !== 0) {
        //nextX !== 0 is for the first element on a page
        //we're dealing with multiple elements inside a single grid square
        this.currentX = this.nextX;
      }
    } else {
      //I'm trying to get it so I can have a row that only has something in a later column eg {row:2, column:2} when there is no {row:2, column:1}. If this is the case then nextX has been reset to originX in the new-row check so this currentX will not be less than nextX unless there is already something in this grid square (hence the additional check in comparison to the smallScreenWidth check)
      this.currentX =
        this.originX + this.columnWidth * (element.position.column - 1);
      // if (currentX < nextX) {
      if (this.nthChild > 0 && this.nextX !== 0) {
        // || currentX < nextX) {
        //NO, if we did row:1 col:2 followed by row:2 col:3 then nthChild would be zero whereas if it was row:1 col:2 followed by row:2 col:2 then nthChild would be one...added a check before nthChild++ to solve this I think
        //we're dealing with multiple elements inside a single grid square or an element in a column next to an empty one
        this.currentX = this.nextX;
      }
    }
    //width must be a percentage!! we'll want to check if height percentage should grow
    //adding the ability to set a minimum width with clamp: Xpx so we can do wrap (I'm thinking, when they get too small we'll wrap them!? particularly for images/videos)
    let w = (this.columnWidth / 100) * element.size.width;
    //check that our natural width is not smaller than our clamped width
    if (element.clamp !== null) {
      // if (element.clamp !== null && element.sizeType === 'auto') {
      //we have to ignore the clamp size if the screen (column width on small screen) is smaller, to avoid going off the edge
      this.clampedWidth = Math.min(element.clamp, this.columnWidth);
      //set this to true if the calculated width has gone below the clamped width
      this.clamped = w < this.clampedWidth;
      if (this.clamped) {
        w = this.clampedWidth;
        console.log(
          `I've had my width clamped - row:${element.position.row} column:${element.position.column}`
        );
      }
    }
    //the area of the elements was becoming much bigger on a small screen so this essentially compares the max width of a column with the width of the single column used in small screen layout and so adjusts accordingly - it has kept the area within <4% of it's initial stated size (ie with text content it resizes so that the same amount of text fits into the element without adding scrolling or excess space at the top and bottom - this is what I wanted so you can do the layout sizing for the content and not worry about it)
    const smallScreenMaxWidthAdjuster =
      this.maxColumnWidth / (LayoutManager.#MIN_WIDTH - 2 * this.pagePadding);
    if (element.sizeType === 'grow' || element.size.width > 100) {
      this.currentWidthModifier =
        (((this.maxColumnWidth * smallScreenMaxWidthAdjuster) / 100) *
          element.size.width) /
        w;
      //Trying to deal with elements that are > 100% wide when going onto a small screen
      if (this.smallScreenWidth && element.size.width > 100) {
        const adjustment = 100 / element.size.width;
        console.log(`adjustment for over width element: ${adjustment}`);
        w *= adjustment; //yep, keeps the area
        this.currentWidthModifier *= adjustment; //so that the height is adjusted accordingly
        this.forceGrow = true; //so an element spans columns in desktop view which means it's content is probably designed to fit nicely, if it's now made smaller I think it should grow in height even if it's sizeType is auto - I'll make some pages and review this decision
      }
    } else {
      this.currentWidthModifier = 1 * smallScreenMaxWidthAdjuster;
    }
    //Blimey, finally here's the beginnings of the wrapping functionality - calculate how far it's going over the edge of the page - this needs to be adjusted to deal with wrapping in columns rather than just the page
    let overflowSize = 0;
    // console.log(`set up overflowSize: ${overflowSize}`);
    if (this.smallScreenWidth) {
      overflowSize += this.columnWidth + this.pagePadding;
    } else {
      //if not a small screen set the overflow boundary to the edge of the column we're in
      overflowSize += this.originX + this.columnWidth * element.position.column;
    }

    //add any offsetX to the position, making offset a percentage of the element width
    const offsetWidth = element.offset.x * (w / 100);
    let x = this.currentX + offsetWidth;
    //stop the offset making the box go off the edge of a small screen or stretch it if it's offset to the left - add a force grow behaviour to account for this (ie change the height accordingly) - but not if it's wrapped or in the same grid square
    if (
      this.smallScreenWidth &&
      offsetWidth !== 0 &&
      overflowSize < x + w + this.pagePadding &&
      this.nthChild === 0 //rowNumber > currentRow
    ) {
      this.forceGrow = true;
      const unadjustedWidth = w;
      w -= offsetWidth;
      this.currentWidthModifier *= unadjustedWidth / w;
    }
    overflowSize -= x - offsetWidth + w; // - this.pagePadding; //kept noticing things being wrapped by 10px on a small screen so put the pagePadding back onto this sum, oh no, it leads to wrapping in the first column on a large screen not work ffs
    // console.log(`checked overflowSize: ${overflowSize}`);
    // if it is going over the edge of the page put it below the previous element in the row and drag it back so it starts a new sub-row. I've got a problem with offsetX pushing an item in the last column across the page boundary so I've created the pageXBounds variable in createLayotMarkers. I need the overflowSize calculation to remove the offsetWidth so it works in the first column though!?
    if (
      (overflowSize < 0 && element.size.width <= 100) ||
      (x + w > this.pageXBound && this.nthChild > 0)
    ) {
      console.log(
        `WRAP ME - ${overflowSize} row:${element.position.row} col:${element.position.column} nthChild:${this.nthChild}`
      );
      this.wrapMe = true;
      this.nthWrapped = this.nthChild; //I'm putting this in so that calculateY will know if it's dealing with an element inside the same grid square that comes after a wrapped element
      //overflowSize is clearly a negative number if we're in here so + to move it backwards
      // x += overflowSize - LayoutManager.#FLOATER_GAP / 2;//original style of wrapping but it was a bit ugly and could produce a column of wrapped elements (eg - you have 4 elements in a column and there's only room for 2, you end up with 2 in a row and then 2 in a column below)
      x =
        this.originX +
        (!this.smallScreenWidth &&
          this.columnWidth * (element.position.column - 1));
      this.currentX = x;
      x += offsetWidth;
    }
    //we ignore the offset here so that this element's offset doesn't shift the following elements - if I implement a wrap functionality would I want to change this? I don't think so cos offset is kinda for forcing overlapping behaviour.
    this.nextX = this.currentX + w; //x + w;
    //using this to round to full pixels and parseInt is apparently slightly more efficient than Math.floor
    w = parseInt(w);
    //to implement the gap between floaters I'll just adjust the final settings now that the numbers have been used to create their 'placeholders' as it were. This is a simplified bit of logic that will create slightly bigger padding on either side but it's all I can think of at the moment without having to loop through again checking whether they are at the beginning of a column and so on
    // x += !this.wrapMe && LayoutManager.#FLOATER_GAP / 2;
    x += LayoutManager.#FLOATER_GAP / 2;
    w = Math.max(w - LayoutManager.#FLOATER_GAP, 1); //in case the size is smaller than floater gap
    //then create a string which can be set as the floater's style.width and style.left
    x += 'px';
    w += 'px';
    return { x, w };
  }

  //IMPORTANT - This must be called AFTER calculateX !!!!!!!!!!!!!!!!!!!!!!!!
  #calculateY(element, rowNumber) {
    //if we are on a new row then ignore y-offset
    let isNewRow = false;

    if (rowNumber > this.currentRow) {
      //we've moved onto the 'next row' in the layout
      this.currentRow = rowNumber;
      this.currentY = Math.max(this.nextY, this.lastBottom);
      isNewRow = true;
    }
    // else if (this.wrapMe) {
    //   currentY = this.lastBottom;//No, this makes the next column start at the wrapped height
    // }
    //'auto' now means it wants to grow from it's clamp percentage if width is below it's max - no, we'll have 'auto' 'grow' or 'fixed' - see ContentTemplateExample for jsdocs of the layout object....coming back to this, I'm going to make grow based on the max row height otherwise it's very close to fixed in behaviour (forceGrow is related to offset based width adjustment that occurs on small screens)
    //gosh, this has grown to a bit of a mess of ternary operators but essentially it's dealing with the various sizeType options including keeping the same aspect ratio of elements that have been 'clamped' to a minimum width (forceGrow is for >100% width and for offset driven width resizing on small screens)
    let h =
      element.sizeType === 'auto' && !this.forceGrow
        ? this.clamped
          ? this.clampedWidth *
            this.aspectHeightMultiplier *
            (element.size.height / element.size.width)
          : (this.rowHeight / 100) * element.size.height
        : element.sizeType === 'grow' || this.forceGrow
        ? (this.maxRowHeight / 100) *
          element.size.height *
          this.currentWidthModifier
        : element.size.height; //this is if the height is a fixed number of pixels
    //adding the clamp functionality so I won't over-confuse the original sizing, I'll just take care of it seperately - oh no, I'll add it into the 'auto' function. Simply remove offsetY when on a small screen because it ends up messy and we are wrapping columns into rows so it doesn't seem appropriate
    let y =
      this.currentY +
      (this.smallScreenWidth //nthChild === 0 &&
        ? 0
        : element.offset.y * (h / 100));
    //for wrap behaviour we'll store the bottom of each for the next to wrap underneath
    if (this.wrapMe) {
      y = this.lastBottom; // - Math.abs(element.offset.y) * (this.rowHeight / 100);
      //  nextY = y + h;
      if (this.smallScreenWidth) this.currentY = y;
    }
    y += LayoutManager.#FLOATER_GAP / 2;
    // if this is another element in the same row check whether it's taller than any other element in the row to set the beginning Y for the next row. If there's a y-offset it's probably a column that has become a row for a small screen, so we'll allow for the positioning to still be offset by doing this little check, x-offset is looked after in calculateX.
    if (y + h > this.nextY) {
      // && !this.wrapMe
      this.nextY = y + h;
    } else if (
      !isNewRow &&
      this.verticalCentre
      // && !(nthWrapped > 0 && nthChild > nthWrapped)
    ) {
      // && !(nthWrapped > 0) && !(nthChild > nthWrapped)
      // console.log(
      //   `Y is being adlusted because it needs to be vertically centred`
      // );
      y += (this.nextY - (y + h)) / 2;
    }
    this.lastBottom = y + h;
    h = parseInt(h);
    h = Math.max(h - LayoutManager.#FLOATER_GAP, 1); //in case the size is smaller than floater gap
    y += 'px';
    h += 'px';
    return { y, h };
  }
  //----------------------------------------------------------------------------

  #getRowElements(rowNumber) {
    //we retrieve an array of all the elements in this row when not on a small screen
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
    // now check whether the screen is smaller than the MIN width and if so we're on a small screen which effects the rows and columns, we want the columns to become rows
    if (this.screenWidth < this.pageWidth) {
      this.smallScreenWidth = true;
      this.pageWidth = this.screenWidth;
    }
    // else is the screen bigger than the MAX width and if so we'll want to work out our originX differently
    else if (this.screenWidth > this.pageWidth) {
      this.largeScreenWidth = true;
    }
  }

  //Need to keep in mind that we are positioning the floaters with 'absolute' which is relative to the container!!
  #createLayoutMarkers() {
    this.pagePadding = LayoutManager.#PAGE_PADDING;
    this.originX = 0; //this.pageContainerBoundingRect.left;
    this.originY = 0; // this.topMargin;
    //this is for working out height when set to 'auto' or 'grow', adjusted if on a small screen
    this.maxColumnWidth =
      (LayoutManager.#MAX_WIDTH - 2 * this.pagePadding) / this.columnCount;
    //because I want to keep the columns as counted from the wireframe (for use in getRowElements) but still want the columnWidth sum to be calculated for small windows...
    let tmpColumnCount = this.columnCount;
    if (this.smallScreenWidth) {
      //page size is less than MIN width so reduce the padding and make each row consist of only one column
      this.pagePadding = LayoutManager.#PAGE_PADDING / 2;
      tmpColumnCount = 1;
      //...and the max column width needs adjusting accordingly - no cos now we can't compare the large screen size with the small screen size...hmm
      // this.maxColumnWidth -= this.pagePadding;
      //   this.maxColumnWidth = LayoutManager.#MIN_WIDTH - 2 * this.pagePadding;
    } else if (this.largeScreenWidth) {
      //page size is locked to MAX width
      this.originX += (this.screenWidth - this.pageWidth) / 2;
    }
    //... for sizeType: 'grow' behaviour which will grow when width is shrunk - should this be based on the initial MAX_WIDTH based column rather than here where it can be small screen affected?
    this.maxRowHeight = this.maxColumnWidth * this.aspectHeightMultiplier;
    //for the wrapping I need to know where the left edge of the page is (because of offsetX use in the left-most column)
    this.pageXBound = this.originX + this.pageWidth - this.pagePadding;
    //add some padding to the top and left
    this.originX += this.pagePadding;
    this.originY += this.pagePadding;
    this.columnWidth = (this.pageWidth - 2 * this.pagePadding) / tmpColumnCount;
    //I'm adding the aspect ratio based grid square height now too
    this.rowHeight = this.columnWidth * this.aspectHeightMultiplier;
    // console.log(`columnWidth: ${this.columnWidth}`);
    // console.log(`rowHeight: ${this.rowHeight}`);
  }

  //whizz through the wireframe to get an idea of it's basic layout
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
      //   this.columnCount = 1;//I think this should remain as discovered so that we can use it in the getRowElements sums...yep
    }
    console.log(
      `Rows: ${this.rowCount}, Columns: ${
        this.smallScreenWidth ? 1 : this.columnCount
      }`
    );
  }
}

export default LayoutManager;
