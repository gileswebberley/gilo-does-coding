import Floater from './Floater';

class FloaterInner extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    // console.log(this.src);
    //Add an element to hold the content so it can have it's visibilty toggled in super.float() and super.reveal()
    this.contentHolder = document.createElement('div');
    this.contentHolder.className = 'content-viewport';
    // this.element.appendChild(this.contentHolder);
    this.appendChildToElement(this.contentHolder);
    this.hasContentAppended = false;
  }

  reveal() {
    if (!this.hasContentAppended) {
      const content = document.createElement('div');
      content.classList.add('content-holder');
      content.innerHTML = this.src;
      this.contentHolder.appendChild(content);
      this.hasContentAppended = true;
    }
    super.reveal();
  }
}

export default FloaterInner;
