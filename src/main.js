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

//make the header and footer colour time responsive...
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

// going to try to implement dark mode toggling
const darkModeToggle = document.querySelector('#dark-mode-toggle');
darkModeToggle.style.marginRight = '2rem';
darkModeToggle.style.cursor = 'pointer';

function setDarkModeToggle() {
  darkModeToggle.innerHTML =
    Colourist.colourScheme === 'dark'
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
}
setDarkModeToggle();

darkModeToggle.addEventListener('pointerup', (e) => {
  Colourist.toggleColourScheme();
  //we'll also want to update the time colours
  setHeaderFooterColour();
  setBodyColour();
  setDarkModeToggle();
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
