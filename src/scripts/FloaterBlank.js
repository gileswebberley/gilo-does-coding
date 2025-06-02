import Floater from './Floater';
//This is a hidden floater just to use as a layout spacer
class FloaterBlank extends Floater {
  constructor(...rest) {
    super(...rest);
    this.contentHolder = document.createElement('span');
    this.element.appendChild(this.contentHolder);
    this.element.style.visibility = 'hidden';
  }

  reveal() {
    // this.contentHolder.setAttribute('src', this.src.src);
    super.reveal();
  }
}

export default FloaterBlank;
