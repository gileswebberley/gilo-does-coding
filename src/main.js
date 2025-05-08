import './style.css';
import Floater from './scripts/Floater.js';

const container = document.querySelector('#container');

const floater = new Floater(container, 'floater1', 10, 10);
// floater.setPosition(100, 100);
floater.float();
const floater2 = new Floater(container, 'floater2', 10, 140);
// floater.setPosition(100, 100);
floater2.float();
const floater3 = new Floater(container, 'floater3', 10, 270);
// floater.setPosition(100, 100);
floater3.float();
const floater4 = new Floater(container, 'floater4', 10, 420);
// floater.setPosition(100, 100);
floater4.float();
