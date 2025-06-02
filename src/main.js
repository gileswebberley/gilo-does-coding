import './style.css';
import SiteManager from './scripts/SiteManager.js';
import Page_Test from './contents/TestContent.js';

//we'll remove the loading message when this loads...
document.querySelector('#loader').remove();
//adding my email address like this to try to avoid being the victim of spam...
const noHarvestSubject = encodeURI('Message from portfolio site');
document.querySelector('#email-address').innerHTML = ` <a
              href='mailto:gileswebberley@gmail.com?subject=${noHarvestSubject}'
              target="_blank"
              rel="noreferrer"
            >
            <i class="fa-regular fa-envelope"></i></a> gileswebberley@gmail.com`;

const container = document.querySelector('#container');
const navElement = document.querySelector('#main-nav');
SiteManager.init(navElement, container);
SiteManager.buildPage(Page_Test);
