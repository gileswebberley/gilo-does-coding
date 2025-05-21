//This will be the class that manages building the navigation bar, it will receive the nav element in it's constructor and then we'll want the SiteManager to be able to call an add button method. I'll want the responsive design of the navigation to be of no concern to this I think, so we'll just add the buttons to the nav element and let CSS take care of it.
class NavManager {
  constructor() {
    console.log(
      'NavManager instance initialized, we only need static methods atm'
    );
  }

  static init(navElement) {
    this.navElement = navElement;
    console.log('NavManager initialized with nav element:', navElement);
  }

  static addButton(pageName, title) {
    const button = document.createElement('button');
    button.innerText = title;
    button.className = 'nav-button';
    button.setAttribute('data-page', pageName);
    button.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      SiteManager.selectPage(pageName);
    });
    this.navElement.appendChild(button);
    console.log(`Button for ${pageName} added to navigation`);
  }
}
