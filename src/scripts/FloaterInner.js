import Page_Test from '../contents/TestContent';
import Floater from './Floater';

class FloaterInner extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    // console.log(this.src);
    //Add an element to hold the content so it can have it's visibilty toggled in super.float() and super.reveal()
    this.contentHolder = document.createElement('div');
    this.contentHolder.className = 'content-viewport';
    this.element.appendChild(this.contentHolder);
  }

  reveal() {
    const content = document.createElement('div');
    content.className = 'content-holder';
    content.innerHTML = this.src;
    this.contentHolder.appendChild(content);
    super.reveal();
  }
}

export default FloaterInner;
