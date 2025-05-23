import './style.css';
import Floater from './scripts/Floater.js';
import FloaterIframe from './scripts/FloaterIframe.js';
import FloaterInner from './scripts/FloaterInner.js';
import SiteManager from './scripts/SiteManager.js';
import Page_Test from './contents/TestContent.js';

// window.SiteManager = SiteManager;
const container = document.querySelector('#container');
const navElement = document.querySelector('#main-nav');
SiteManager.init(navElement, container);
SiteManager.buildPage(Page_Test); // console.log(SiteManager.hideAllPages());

// const floater = new FloaterInner(Page_Test.content[0].src, container, 1, 10, 0);
// floater.float();
// const floater2 = new FloaterInner(
//   Page_Test.content[0].src,
//   container,
//   2,
//   210,
//   140
// );
// floater2.float();
// const floater3 = new FloaterInner(
//   Page_Test.content[0].src,
//   container,
//   3,
//   10,
//   270
// );
// floater3.float();
// const floater4 = new FloaterIframe('../TestPage.html', container, 4, 200, 340);
// floater4.float();

// const page1 = [floater, floater2, floater3, floater4];

// setTimeout(() => {
//   page1.forEach((floater) => {
//     floater.reveal();
//   });
// }, 10000); // Change the interval as needed
