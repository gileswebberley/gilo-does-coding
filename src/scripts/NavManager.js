import SiteManager from './SiteManager';

//This will be the class that manages building the navigation bar, it will receive the nav element in it's constructor and then we'll want the SiteManager to be able to call an add button method. I'll want the responsive design of the navigation to be of no concern to this I think, so we'll just add the buttons to the nav element and let CSS take care of it.

// It has a 1..1 relationship with the SieManager so I have made it a static singleton class, I think this makes sense but still need to work on my OOD skills!
class NavManager {
  static #instance = null;
  static navElement = null;

  constructor() {
    if (NavManager.#instance) {
      return NavManager.#instance; // Return the existing instance if it exists
    }
    NavManager.#instance = this; // Set the instance to the current instance
    console.log(
      'NavManager instance initialized, we only need static methods atm'
    );
    return this; // Return the current instance
  }

  static init(navElement, hamburger = null) {
    this.navElement = navElement;
    this.hamburger = hamburger;
    console.log('NavManager initialized with nav element:', navElement);
  }

  static addButton(pageName, title, callback) {
    const button = document.createElement('button');
    button.innerText = title; //.toUpperCase();
    button.className = 'nav-button';
    button.setAttribute('data-page', pageName);
    button.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.target.classList.add('active'); //for the css styling
      callback(pageName, e);
    });
    this.navElement.appendChild(button);
    console.log(`Button for ${pageName} added to navigation`);
  }
}

export default NavManager;
