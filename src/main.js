import './style.css';
import Floater from './scripts/Floater.js';
import FloaterIframe from './scripts/FloaterIframe.js';
import FloaterInner from './scripts/FloaterInner.js';
import SiteManager from './scripts/SiteManager.js';
import Page_Test from './contents/TestContent.js';

//we'll remove the loading message when this loads...
document.querySelector('#loader').remove();
document.querySelector('#email-address').textContent =
  'gileswebberley@gmail.com';

const container = document.querySelector('#container');
const navElement = document.querySelector('#main-nav');
SiteManager.init(navElement, container);
SiteManager.buildPage(Page_Test);
