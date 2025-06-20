import './style.css';
import SiteManager from './scripts/SiteManager.js';
import Page_Test from './contents/TestContent.js';
import Page_Test2 from './contents/TestContent2.js';
import Page_Test3 from './contents/TestContent3.js';
import Page_Test4 from './contents/TestContent4.js';
import NavManager from './scripts/NavManager.js';
import Colourist from './scripts/Colourist.js';
import WelcomeContent from './contents/Welcome.js';

//we'll remove the loading message when this loads...
document.querySelector('#loader').remove();
//adding my email address like this to try to avoid being the victim of spam...
document.querySelector('#email-address').innerHTML = ` <a
              href='mailto:gileswebberley@gmail.com?subject=${encodeURI(
                'Message from portfolio site'
              )}'
              target="_blank"
              rel="noreferrer"
            >
            <i class="fa-regular fa-envelope"></i></a>&nbsp; gileswebberley@gmail.com`;
//finally let's set the logo to clear all pages' reveal
document.querySelector('#logo').addEventListener('pointerup', (e) => {
  SiteManager.hideAllPages();
});

//set up all the colour styling now that I have implemented the colour-scheme functionality (rather than just the css @media (prefers-color-scheme: dark) stuff)
function setHeaderFooterColour() {
  const timeColours = Colourist.getTimeBasedColourBasedOnColourScheme();
  document.documentElement.style.setProperty(
    '--header-footer-time-colour',
    timeColours.bg
  );
  document.documentElement.style.setProperty(
    '--header-footer-time-colour-text',
    timeColours.text
  );
}
setHeaderFooterColour();

function setBodyColour() {
  document.documentElement.style.setProperty(
    'background-color',
    Colourist.getBackgroundColour()
  );
}
setBodyColour();

//final bit of colourisation is to take care of the navigation colours
function setNavColours() {
  const navSwatch = Colourist.getNavSwatch();
  document.documentElement.style.setProperty(
    '--colour-nav-button-text',
    navSwatch.text
  );
  document.documentElement.style.setProperty(
    '--colour-nav-button-bg',
    navSwatch.bg
  );
  document.documentElement.style.setProperty(
    '--colour-nav-button-border',
    navSwatch.border
  );
  document.documentElement.style.setProperty(
    '--colour-nav-button-visited',
    navSwatch.visited
  );
  document.documentElement.style.setProperty(
    '--colour-nav-button-hover',
    navSwatch.hover
  );
}
setNavColours();

// going to try to implement dark mode toggling as it looks nicer to me in dark mode and I think it will be good practice to implement it
const darkModeToggle = document.querySelector('#dark-mode-toggle');
// darkModeToggle.style.marginRight = '2rem';
// darkModeToggle.style.cursor = 'pointer'; //I should not be doing this here!!

function setDarkModeToggleButton() {
  darkModeToggle.innerHTML =
    Colourist.colourScheme === 'dark'
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
}
setDarkModeToggleButton();

darkModeToggle.addEventListener('pointerup', (e) => {
  Colourist.toggleColourScheme();
  //we'll also want to update the time colours
  setHeaderFooterColour();
  setNavColours();
  setBodyColour();
  setDarkModeToggleButton();
});

// Now build the site...
const container = document.querySelector('#container');
const navElement = document.querySelector('#main-nav');
const hamburger = document.querySelector('#hamburger-button');
SiteManager.init(navElement, container);
NavManager.setHamburger(hamburger);
SiteManager.buildPage(WelcomeContent);
SiteManager.buildPage(Page_Test);
SiteManager.buildPage(Page_Test2);
SiteManager.buildPage(Page_Test3);
SiteManager.buildPage(Page_Test4);
