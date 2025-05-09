import './style.css';
import Floater from './scripts/Floater.js';

const container = document.querySelector('#container');

const floater = new Floater(container, 1, -50, 0);
floater.float();
const floater2 = new Floater(container, 2, 10, -30);
floater2.float();
const floater3 = new Floater(container, 3, -20, 0);
floater3.float();
const floater4 = new Floater(container, 4, 10, -30);
floater4.float();
