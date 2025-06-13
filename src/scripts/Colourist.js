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

  colourModeEvent: new Event('colourModeChange'),

  toggleColourScheme: function () {
    this.colourScheme = this.colourScheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute(
      'data-colour-scheme',
      this.colourScheme
    );
    console.log(`Setting colour scheme to ${this.colourScheme}`);
    document.dispatchEvent(this.colourModeEvent);
  },

  getColourSwatchLength: function () {
    return Math.min(
      this.higherOrangeRange.length,
      this.lowerOrangeRange.length
    );
  },
  getOrangeBGSwatch: function () {
    if (this.colourScheme === 'dark') {
      console.log('DARK MODE COLOURS.......');
      return this.higherOrangeRange;
    } else {
      console.log('LIGHT MODE COLOURS.......');
      return this.lowerOrangeRange;
    }
  },
  getOrangeSwatch: function () {
    if (this.colourScheme === 'dark') {
      console.log('DARK MODE COLOURS.......');
      return this.lowerOrangeRange;
    } else {
      console.log('LIGHT MODE COLOURS.......');
      return this.higherOrangeRange;
    }
  },
  //make it an anonymous function rather than an arrow function so I can access the colourSwatchLength - stupid, I'd forgotten about the scope difference :/
  getTimeBasedColourBasedOnColourScheme: function () {
    const timestep = 23 / this.getColourSwatchLength();
    console.log(`Timestep in colourist is ${timestep}`);
    const currentTime = new Date().getHours();
    const currentTextSwatch =
      this.colourScheme === 'dark'
        ? this.lowerOrangeRange
        : this.higherOrangeRange;
    const currentSwatch =
      this.colourScheme === 'dark'
        ? this.higherOrangeRange
        : this.lowerOrangeRange;
    console.log(
      `colour selected: time: ${currentTime} ${Math.floor(
        currentTime / timestep
      )} ${currentSwatch[Math.floor(currentTime / timestep) - 1]}`
    );
    const indexSelection = Math.floor(currentTime / timestep) - 1;
    return {
      bg: currentSwatch[indexSelection],
      text: currentTextSwatch[indexSelection],
    };
  },
};

export default Colourist;
