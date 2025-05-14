import Page_Test from '../contents/TestContent';
import Floater from './Floater';

class FloaterInner extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = Page_Test.content[src].html;
    console.log(this.src);
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('div');
    this.contentHolder.className = 'content-viewport';
    const content = document.createElement('div');
    content.className = 'content-holder';
    content.innerHTML = this.src;
    this.contentHolder.appendChild(content);
    // this.contentHolder = document.createElement('div');
    // this.iframer = document.createElement('iframe');
    // this.contentHolder.className = 'content-holder';
    // this.iframer.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    // this.contentHolder.setAttribute(
    //   'sandbox',
    //   'allow-scripts allow-same-origin'
    // );
    // this.contentHolder.appendChild(this.iframer);
    // this.contentHolder.setAttribute('src', this.iframeUrl);
    this.element.appendChild(this.contentHolder);
  }

  reveal() {
    // this.iframer.setAttribute('src', this.iframeUrl);
    // this.contentHolder.setAttribute('src', this.iframeUrl);
    // this.iframer.setAttribute('scrolling', 'yes');
    super.reveal();
  }
}

export default FloaterInner;
