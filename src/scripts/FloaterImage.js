import Floater from './Floater';
//src is {src,alt}
class FloaterImage extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('image');
    this.contentHolder.setAttribute('loading', 'lazy');
    // this.contentHolder.setAttribute(
    //   'src',
    //   this.src.src
    // );
    this.contentHolder.setAttribute('alt', this.src.alt);
    this.element.appendChild(this.contentHolder);
  }

  reveal() {
    this.contentHolder.setAttribute('src', this.src.src);
    super.reveal();
  }
}

export default FloaterImage;
