import Floater from './Floater';
//src is {src,alt}
class FloaterVideo extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('video');
    this.contentHolder.className = 'content-video';
    this.contentHolder.setAttribute('controls', '');
    this.contentHolder.setAttribute(
      'controlslist',
      'nodownload noremoteplayback'
    );
    this.contentHolder.setAttribute('disablepictureinpicture', '');
    this.contentHolder.setAttribute('loop', '');
    this.contentHolder.setAttribute('playsinline', '');
    this.contentHolder.setAttribute('preload', 'metadata');
    if (this.src.alt) this.contentHolder.setAttribute('poster', this.src.alt);
    this.contentHolder.innerText =
      'Unfortunately it seems that your browser does not support this video';
    this.element.appendChild(this.contentHolder);
  }

  reveal() {
    this.contentHolder.setAttribute('src', this.src.src);
    super.reveal();
  }
}

export default FloaterVideo;
