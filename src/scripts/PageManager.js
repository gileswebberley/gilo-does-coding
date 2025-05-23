// I don't think this needs to know the name of the page but instead it will simply return the Page object back to SiteManager so it can call the show() and hide() methods. I think each page will want a LayoutManager that works out sizes and layout based on screen size etc. The LayoutManager will want to be able to get to each individual Floater in some way  so that it can call their moveTo() and setDimensions() methods. No, that's unneccessary, the PageManager will call those but just use the LayoutManager to get an array of size and position objects for each Floater.

import LayoutManager from './LayoutManager';
import World from './World';

class PageManger {
  constructor(pageObject, pageContainer) {
    if (!pageObject || !pageContainer) {
      throw new Error('Page object and page container are required.');
    }
    this.pageObject = pageObject;
    this.pageContainer = pageContainer;
    this.layoutManager = null; // Placeholder for LayoutManager instance
    this.floaterMap = new Map(); // Array to hold Floater instances
    this.isOpen = false;
  }

  init() {
    this.#createLayoutManager();
    // this.createFloaters();
    this.#startListeningForResize();
  }

  #startListeningForResize() {
    this.resizeListener = window.addEventListener('resize', () => {
      if (!this.hasHeardResize) {
        this.hasHeardResize = true;
        //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
        setTimeout(() => {
          console.log('Layout shifting from resize...');
          this.layoutManager.inspectScreenForLayout();
          this.hasHeardResize = false;
        }, World.RESIZE_TIMEOUT);
      }
    });
  }

  #createLayoutManager() {
    // create an array of {position:{row, column}, size:{width, height}, offset:{Xpx,Ypx}} objects from the pageObject
    const wireframe = this.pageObject.map((content) => {
      return {
        layoutNumer: content.layoutNumber,
        position: content.position,
        offset: content.offset,
        size: content.size,
        sizeType: content.sizeType,
      };
    });
    console.table(wireframe);
    this.layoutManager = new LayoutManager(
      wireframe,
      this.pageContainer.getBoundingClientRect()
    );
  }

  show() {
    this.isOpen = true;
    console.table(this.pageObject);
    this.pageContainer.style.height = this.layoutManager.getPageHeight();
    // this.layoutManager.updateLayout(); // Update layout when showing the page
    this.floaterMap.forEach((floater) => floater.reveal());
  }

  hide() {
    this.isOpen = false;
    this.pageContainer.style.height = '100%';
    this.floaterMap.forEach((floater) => floater.float());
  }
}

export default PageManger;
