const lowerOrangeRange = [
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
];

const higherOrangeRange = [
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
];

const Colourist = {
  colourSwatchLength: 5,
  getOrangeBGSwatch: () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('DARK MODE COLOURS.......');
      return higherOrangeRange;
    } else {
      console.log('LIGHT MODE COLOURS.......');
      return lowerOrangeRange;
    }
  },
  getOrangeSwatch: () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('DARK MODE COLOURS.......');
      return lowerOrangeRange;
    } else {
      console.log('LIGHT MODE COLOURS.......');
      return higherOrangeRange;
    }
  },
  //make it an anonymous function rather than an arrow function so I can access the colourSwatchLength - stupid, I'd forgotten about the scope difference :/
  getTimeBasedColourBasedOnColourScheme: function () {
    const timestep = 23 / this.colourSwatchLength;
    console.log(`Timestep in colourist is ${timestep}`);
    const currentTime = new Date().getHours();
    const currentTextSwatch = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? lowerOrangeRange
      : higherOrangeRange;
    const currentSwatch = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? higherOrangeRange
      : lowerOrangeRange;
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
