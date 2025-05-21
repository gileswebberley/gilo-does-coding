class SiteManager {
  static instance = null; // Singleton instance
  // keep track of open pages
  static #openPage = '';
  static #pages = new Map(); // key: pageName, value: PageManager instance

  // basically this is a static class so we want any instance to be the same
  constructor() {
    if (SiteManager.instance) {
      return SiteManager.instance;
    }
    SiteManager.instance = this;
    return this;
  }

  // I think I want to use this to set the navigation element
  static init(navElement) {
    // Initialization logic here
    console.log('SiteManager initialized');
  }

  static addPage(pageName, pageManager) {
    if (this.#pages.has(pageName)) {
      console.error(`Page ${pageName} already exists.`);
      return;
    }
    this.#pages.set(pageName, pageManager); // Add the page manager to the map
    console.log(`Page ${pageName} added.`);
  }

  static getInstance() {
    if (!SiteManager.instance) {
      SiteManager.instance = new SiteManager();
    }
    return SiteManager.instance;
  }

  static hideAllPages() {
    console.log('Hiding all pages');
    if (this.#openPage !== '') {
      this.#pages.get(this.#openPage).hide(); // Hide the currently open page
    }
    this.#openPage = ''; // Reset the open page
  }

  static selectPage(pageName) {
    if (!this.#pages.has(pageName)) {
      console.error(`Page ${pageName} does not exist.`);
      return;
    }
    if (this.#openPage === pageName) {
      console.log(`Page ${pageName} is already open.`);
      return; // No need to change the page if it's already open
    } else if (this.#openPage !== '') {
      this.#pages.get(this.#openPage).hide(); // Hide the currently open page
    }
    this.#openPage = pageName;
    this.#pages.get(pageName).show();
  }
}
/* When build(contents) is called we will want to go through each 'page' and add it's title to the navigation with an onPointerDown event that calls this revealPage(pageName) method. This will then call the PageManager associated with that pageName to call reveal on all of it's own floaters. We'll want to check whether that page is already open, or indeed if any page is open, and set the open page's floaters to float as well*/
export default SiteManager;
