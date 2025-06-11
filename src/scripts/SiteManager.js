import NavManager from './NavManager';
import PageManger from './PageManager';

class SiteManager {
  static #instance = null; // Singleton instance
  // keep track of open pages
  static #openPage = '';
  static #pages = new Map(); // key: pageName, value: PageManager instance
  static #pageContainer = null; // container element that the Floaters are attached to - set in init()

  // basically this is a static class so we want any instance to be the same, we use the instance for sending the callback to NavManager
  constructor() {
    if (SiteManager.#instance) {
      return SiteManager.#instance;
    }
    SiteManager.#instance = this;
    return this;
  }

  // I think I want to use this to set the navigation element
  static init(navElement, pageContainer) {
    this.#pageContainer = pageContainer;
    NavManager.init(navElement);
    console.log('SiteManager initialized');
  }

  static buildPage(pageData) {
    const pageManager = new PageManger(
      pageData.content,
      this.#pageContainer,
      pageData.aspectRatio
    );
    pageManager.init(); //this builds the layout manager wireframe
    SiteManager.#addPage(pageData.pageId, pageManager); // Add the page manager to the map
    NavManager.addButton(
      pageData.pageId,
      pageData.buttonText,
      SiteManager.getInstance().selectPage
    );
  }

  static #addPage(pageName, pageManager) {
    if (this.#pages.has(pageName)) {
      console.error(`Page ${pageName} already exists.`);
      return;
    }
    this.#pages.set(pageName, pageManager); // Add the page manager to the map
    console.log(`Page ${pageName} added.`);
  }

  static getInstance() {
    if (!SiteManager.#instance) {
      SiteManager.#instance = new SiteManager();
    }
    return SiteManager.#instance;
  }

  static hideAllPages() {
    console.log('Hiding all pages');
    if (this.#openPage !== '') {
      this.#pages.get(this.#openPage).hide(); // Hide the currently open page
    }
    this.#openPage = ''; // Reset the open page
  }

  // I think I want to pass an instance to the nav manager to keep it less coupled so perhaps I should define an instance method for this instead of a static one?
  static selectPage(pageName) {
    if (!this.#pages.has(pageName)) {
      console.error(`Page ${pageName} does not exist.`);
      return;
    }
    if (this.#openPage === pageName) {
      console.log(`Page ${pageName} is already open.`);
      return; // No need to change the page if it's already open
    } else if (this.#openPage !== '') {
      // Hide the currently open page before showing the selected one
      this.#pages.get(this.#openPage).hide();
    }
    this.#openPage = pageName;
    this.#pages.get(pageName).show();
  }

  // can I access these private static variables from here? Yep, passing this into NavManager.addButton as a callback seems to work fine!
  selectPage(pageName, e) {
    // console.log(`event target: ${e.target}`);
    SiteManager.selectPage(pageName); // Call the static method to select the page
  }
}

/* When build(contents) is called we will want to go through each 'page' and add it's title to the navigation with an onPointerDown event that calls this selectPage(pageName) method. This will then call the PageManager associated with that pageName to call reveal on all of it's own floaters. We'll want to check whether that page is already open, or indeed if any page is open, and set the open page's floaters to float as well*/
export default SiteManager;
