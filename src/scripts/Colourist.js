const Colourist = {
  colourScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light',

  higherOrangeRange: [
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-500'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-600'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-700'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-800'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-900'
    ),
  ],

  lowerOrangeRange: [
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-50'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-100'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-200'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-300'
    ),
    getComputedStyle(document.documentElement).getPropertyValue(
      '--colour-orange-400'
    ),
  ],

  getBackgroundColour: function () {
    return getComputedStyle(document.documentElement).getPropertyValue(
      this.colourScheme === 'dark' ? '--colour-blue-600' : '--colour-blue-300'
    );
  },

  getNavSwatch: function () {
    const documentStyle = getComputedStyle(document.documentElement);
    const swatch = {
      text: documentStyle.getPropertyValue(
        this.colourScheme === 'dark' ? '--colour-blue-50' : '--colour-blue-900'
      ),
      bg: documentStyle.getPropertyValue(
        this.colourScheme === 'dark' ? '--colour-blue-700' : '--colour-blue-200'
      ),
      border: documentStyle.getPropertyValue(
        this.colourScheme === 'dark' ? '--colour-blue-50' : '--colour-blue-900'
      ),
      // I think maybe I'll just make the border orange when a page has been visited, I think it's a nicer subtle way to denote this event
      visited: documentStyle.getPropertyValue(
        this.colourScheme === 'dark'
          ? '--colour-orange-200'
          : '--colour-orange-700'
      ),
      hover: documentStyle.getPropertyValue(
        this.colourScheme === 'dark'
          ? '--colour-orange-800'
          : '--colour-orange-200'
      ),
    };
    return swatch;
  },

  //this is for the floaters so they know the number to use as the modulus value when they are setting their colours (I changed it from random to a static number that is incremented each time a colour is set)
  getColourSwatchLength: function () {
    return Math.min(
      this.higherOrangeRange.length,
      this.lowerOrangeRange.length
    );
  },
  //These are the selection of coloursa that can be used for the background and color settings of the floaters
  getOrangeBGSwatch: function () {
    if (this.colourScheme === 'dark') {
      // console.log('DARK MODE COLOURS.......');
      return this.higherOrangeRange;
    } else {
      // console.log('LIGHT MODE COLOURS.......');
      return this.lowerOrangeRange;
    }
  },

  getOrangeSwatch: function () {
    if (this.colourScheme === 'dark') {
      // console.log('DARK MODE COLOURS.......');
      return this.lowerOrangeRange;
    } else {
      // console.log('LIGHT MODE COLOURS.......');
      return this.higherOrangeRange;
    }
  },
  //make it an anonymous function rather than an arrow function so I can access the colourSwatchLength - stupid, I'd forgotten about the scope difference :/
  //The header and footer set their colour based on the time of day that the page is loaded, along with the colour-scheme setting.
  getTimeBasedColourBasedOnColourScheme: function () {
    const timestep = 24 / this.getColourSwatchLength(); //24 rather than 23 cos I was working on it at midnight and it obviously broke :D !?
    const currentTime = new Date().getHours();
    const currentTextSwatch =
      this.colourScheme === 'dark'
        ? this.lowerOrangeRange
        : this.higherOrangeRange;
    const currentSwatch =
      this.colourScheme === 'dark'
        ? this.higherOrangeRange
        : this.lowerOrangeRange;
    const indexSelection = Math.floor(currentTime / timestep);
    return {
      bg: currentSwatch[indexSelection],
      text: currentTextSwatch[indexSelection],
    };
  },

  colourModeEvent: new Event('colourModeChange'),

  toggleColourScheme: function () {
    this.colourScheme = this.colourScheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute(
      'data-colour-scheme',
      this.colourScheme
    );
    // this is for the floaters to listen to (ie document.addEventListener('colourModeChange', (e) => { ... })) as they programatically set their colours when they are created rather than being based on the pre-written css.
    document.dispatchEvent(this.colourModeEvent);
  },
};

export default Colourist;
