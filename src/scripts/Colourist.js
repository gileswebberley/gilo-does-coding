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
  getOrangeBGSwatch: () => {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      console.log('DARK MODE COLOURS.......');
      return lowerOrangeRange;
    } else {
      console.log('LIGHT MODE COLOURS.......');
      return higherOrangeRange;
    }
  },
  getOrangeSwatch: () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      console.log('LIGHT MODE COLOURS.......');
      return lowerOrangeRange;
    } else {
      console.log('DARK MODE COLOURS.......');
      return higherOrangeRange;
    }
  },
};

export default Colourist;
