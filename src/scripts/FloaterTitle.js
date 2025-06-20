import Floater from './Floater';

class FloaterTitle extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('h1');
    this.contentHolder.classList.add('content-title');
    this.contentHolder.innerHTML = this.src;
    // this.element.appendChild(this.contentHolder);
    this.appendChildToElement(this.contentHolder);
  }

  reveal() {
    // this.contentHolder.setAttribute('src', this.src.src);
    super.reveal();
  }
}

export default FloaterTitle;
