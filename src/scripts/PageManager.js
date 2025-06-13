// I don't think this needs to know the name of the page but instead it will simply return the Page object back to SiteManager so it can call the show() and hide() methods. I think each page will want a LayoutManager that works out sizes and layout based on screen size etc. The LayoutManager will want to be able to get to each individual Floater in some way  so that it can call their moveTo() and setDimensions() methods. No, that's unneccessary, the PageManager will call those but just use the LayoutManager to get an array of size and position objects for each Floater.

import FloaterBlank from './FloaterBlank';
import FloaterIframe from './FloaterIframe';
import FloaterImage from './FloaterImage';
import FloaterInner from './FloaterInner';
import FloaterTitle from './FloaterTitle';
import FloaterVideo from './FloaterVideo';
import LayoutManager from './LayoutManager';
import World from './World';

class PageManger {
  constructor(pageObject, pageContainer, baseLayoutAspectRatio = '16:9') {
    if (!pageObject || !pageContainer) {
      throw new Error('Page object and page container are required.');
    }
    this.pageObject = pageObject;
    //I think sharing the container is causing the layout manager some trouble now that I've got a few pages (ie when a page is open the container size has been adjusted for that page so all the other pages think that the viewport height is whatever it's set to :/ maybe I just need a sizing div that is not touched by the layout but instead simply fills up the available space according to the screen size being changed? fixed with if(this.isOpen) inside the resize event listener)
    this.pageContainer = pageContainer;
    this.layoutManager = null; // Placeholder for LayoutManager instance
    this.baseLayoutAspectRatio = baseLayoutAspectRatio; //see LayoutManager
    this.floaterMap = new Map(); // Array to hold Floater instances
    this.isOpen = false;
  }

  init() {
    this.#createLayoutManager();
    this.#createFloaters();
    this.#startListeningForResize();
  }

  #createFloaters() {
    this.pageObject.forEach((content) => {
      switch (content.type) {
        case 'image':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterImage(content.src, this.pageContainer)
          );
          break;
        case 'title':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterTitle(content.src, this.pageContainer)
          );
          break;
        case 'video':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterVideo(content.src, this.pageContainer)
          );
          break;
        case 'html':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterInner(content.src, this.pageContainer)
          );
          break;
        case 'iframe':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterIframe(content.src, this.pageContainer)
          );
          break;
        case 'blank':
          this.floaterMap.set(
            content.layoutNumber,
            new FloaterBlank(this.pageContainer)
          );
          break;
        default:
          console.warn(`Unknown content type: ${content.type}`);
      }
      const currentFloater = this.floaterMap.get(content.layoutNumber);
      const { x, y, w, h } = this.layoutManager.getFloaterLayoutObject(
        content.layoutNumber
      );
      // console.log(`Floater ${content.layoutNumber} position:`, x, y, w, h);
      currentFloater.setRevealPosition(x, y);
      currentFloater.setDimensions(w, h);
      currentFloater.float();
    });
  }

  #startListeningForResize() {
    this.resizeListener = window.addEventListener('resize', () => {
      if (!this.hasHeardResize) {
        this.hasHeardResize = true;
        //add a little 'debounce' so that we don't react to 100s of resize events that are triggered by the browser being resized
        setTimeout(() => {
          this.#resizeFunctionality();
          this.hasHeardResize = false;
        }, World.RESIZE_TIMEOUT);
      }
    });
  }

  #resizeFunctionality() {
    // console.log('Layout shifting from resize...');
    //ok so trying to work out how to get the top and bottom margin calculations in LayoutManager if the page is open - if it is then the container will have it's size set so we cannot use the container rect to calculate them. I have realised that I could change it back to fill the available space whilst we're working out the layout perhaps?

    // Right, this checks the height of the page currently (in case another page is open) and stores it so it can change the height to 100% to get the viewportHeight within LayoutManager and then put it back to how it found it. This means that the various pages don't interfere with the container height for other pages. It's a bit hacky as sharing the container amongst pages probably wasn't the ultimate decision to have made early on, but it works so I'm going with it as a solution to the problem I was trying to overcome!
    const tempHeight = getComputedStyle(this.pageContainer).getPropertyValue(
      'height'
    );
    this.pageContainer.style.height = '100%';
    this.layoutManager.inspectScreenForLayout(
      this.pageContainer.getBoundingClientRect()
    );
    if (!this.isOpen) {
      this.pageContainer.style.height = tempHeight;
    } else {
      this.pageContainer.style.height = this.layoutManager.getPageHeight();
    }
    this.floaterMap.forEach((floater, key) => {
      const { x, y, w, h } = this.layoutManager.getFloaterLayoutObject(key);
      floater.setRevealPosition(x, y);
      floater.setDimensions(w, h);
    });
  }

  #createLayoutManager() {
    // create an array of {position:{row, column}, size:{width, height}, offset:{Xpx,Ypx}} objects from the pageObject
    const wireframe = this.pageObject.map((content) => {
      return {
        layoutNumber: content.layoutNumber,
        position: content.position,
        offset: content.offset,
        size: content.size,
        sizeType: content.sizeType,
        clamp: content.clamp ?? null,
      };
    });
    // console.table(wireframe);
    this.layoutManager = new LayoutManager(
      wireframe,
      this.pageContainer.getBoundingClientRect(),
      this.baseLayoutAspectRatio
    );
  }

  show() {
    this.isOpen = true;
    this.pageContainer.style.height = this.layoutManager.getPageHeight();
    this.floaterMap.forEach((floater) => floater.reveal());
  }

  hide() {
    this.isOpen = false;
    this.pageContainer.style.height = '100%';
    this.floaterMap.forEach((floater) => floater.float());
  }
}

export default PageManger;
