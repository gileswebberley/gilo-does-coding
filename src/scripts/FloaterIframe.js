import Floater from './Floater';

class FloaterIframe extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.iframeUrl = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('iframe');
    this.contentHolder.setAttribute(
      'sandbox',
      'allow-scripts allow-same-origin allow-top-navigation'
    );
    this.element.appendChild(this.contentHolder);
  }

  reveal() {
    // this.iframer.setAttribute('src', this.iframeUrl);
    this.contentHolder.setAttribute('src', this.iframeUrl);
    // this.iframer.setAttribute('scrolling', 'yes');
    super.reveal();
  }
}

export default FloaterIframe;
