// I don't think this needs to know the name of the page but instead it will simply return the Page object back to SiteManager so it can call the show() and hide() methods. I think each page will want a LayoutManager that works out sizes and layout based on screen size etc. The LayoutManager will want to be able to get to each individual Floater in some way  so that it can call their moveTo() and setDimensions() methods. No, that's unneccessary, the PageManager will call those but just use the LayoutManager to get an array of size and position objects for each Floater.

import FloaterBlank from './FloaterBlank';
import FloaterIframe from './FloaterIframe';
import FloaterImage from './FloaterImage';
import FloaterInner from './FloaterInner';
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
        // case 'text':
        //   this.floaterMap.set(
        //     content.layoutNumber,
        //     new TextFloater(content.src, this.pageContainer)
        //   );
        //   break;
        // case 'video':
        //   this.floaterMap.set(
        //     content.layoutNumber,
        //     new VideoFloater(content.src, this.pageContainer)
        //   );
        //   break;
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
          console.log('Layout shifting from resize...');
          this.layoutManager.inspectScreenForLayout();
          this.pageContainer.style.height = this.layoutManager.getPageHeight();
          this.floaterMap.forEach((value, key) => {
            const { x, y, w, h } =
              this.layoutManager.getFloaterLayoutObject(key);
            value.setRevealPosition(x, y);
            value.setDimensions(w, h);
          });
          this.hasHeardResize = false;
        }, World.RESIZE_TIMEOUT);
      }
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
      };
    });
    console.table(wireframe);
    this.layoutManager = new LayoutManager(wireframe, this.pageContainer);
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
