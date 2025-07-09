'use strict';
import './style.css';
import SiteManager from './scripts/SiteManager.js';
import NavManager from './scripts/NavManager.js';
import Colourist from './scripts/Colourist.js';
import WelcomeContent from './contents/Welcome.js';
import TimeographyContent from './contents/Timeography.js';
import ParticlesContent from './contents/Particles.js';
import SpectrumContent from './contents/Spectrum.js';
import VtSContent from './contents/VisionToSound.js';
import UnityContent from './contents/MeteorStorm.js';
import WildOasisContent from './contents/WildOasis.js';
import HomeContent from './contents/Home.js';

//we'll remove the loading message when this loads...
document.querySelector('#loader').remove();
//adding my email address like this to try to avoid being the victim of spam...
document.querySelector('#email-address').innerHTML = ` <a
              href='mailto:gileswebberley@gmail.com?subject=${encodeURI(
                'Message from portfolio site'
              )}'
              target="_blank"
              rel="noreferrer"
              aria-label="Click to open your email client and compose an email to me"
              tabindex="0"
            >
            <i class="fa-regular fa-envelope"></i></a>&nbsp; gileswebberley@gmail.com`;
//finally let's set the logo to clear all pages' reveal
document.querySelector('#logo').addEventListener('click', (e) => {
  e.preventDefault();
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

function setDarkModeToggleButton() {
  darkModeToggle.innerHTML =
    Colourist.colourScheme === 'dark'
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
  //continuing my attempts to make this a bit more accessible friendly
  darkModeToggle.setAttribute(
    'aria-checked',
    Colourist.colourScheme === 'dark'
  );
}
setDarkModeToggleButton();

//I have made this a click event rather than pointer for accessibilty - apparently pointer events do not fire when the enter key is pressed but a click event does
darkModeToggle.addEventListener('click', (e) => {
  e.preventDefault();
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
SiteManager.buildPage(HomeContent);
SiteManager.buildPage(WelcomeContent);
SiteManager.buildPage(TimeographyContent);
SiteManager.buildPage(ParticlesContent);
SiteManager.buildPage(SpectrumContent);
SiteManager.buildPage(VtSContent);
SiteManager.buildPage(UnityContent);
SiteManager.buildPage(WildOasisContent);
