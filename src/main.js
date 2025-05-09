import './style.css';
import Floater from './scripts/Floater.js';

const container = document.querySelector('#container');

const floater = new Floater(container, 1, 10, 0);
floater.float();
const floater2 = new Floater(container, 2, 210, 140);
floater2.float();
const floater3 = new Floater(container, 3, 10, 270);
floater3.float();
const floater4 = new Floater(container, 4, 200, 340);
floater4.float();
