import Colourist from './Colourist';

const World = {
  //these are for the LayoutManager - min is half of max for 'grow' based sizing, it keeps it relatively similar, but perhaps it should be based on the layout aspect ratio?
  MAX_PAGE_WIDTH: 1280,
  MIN_PAGE_WIDTH: 640,
  PAGE_PADDING: 20,
  FLOATER_GAP: 10,
  //these are for the Floater
  DEPTH: 200,
  DURATION: 1000,
  //these are randomly chosen from and essentially multiply the duration for the amount of time floaters take to move from one position to the next
  MAX_DRAG: 10,
  MIN_DRAG: 3,
  POSSIBLE_EASING_STYLES: ['ease-in', 'ease-out', 'ease-in-out', 'linear'],
  FLOATER_BG_COLOURS: Colourist.getOrangeBGSwatch(),
  FLOATER_COLOURS: Colourist.getOrangeSwatch(),
  BIRTH_POSITION: {
    x: 0,
    y: 0,
    z: 1,
  },
  //PageManager is the only resize listener now, this is the debounce time
  RESIZE_TIMEOUT: 1000,
};

export default World;
