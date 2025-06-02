import Colourist from './Colourist';

const World = {
  DEPTH: 200,
  DURATION: 1000,
  MAX_SPEED: 4,
  MIN_SPEED: 1,
  CONTENT_PADDING: 10,
  POSSIBLE_EASING_STYLES: ['ease-in', 'ease-out', 'ease-in-out', 'linear'],
  FLOATER_BG_COLOURS: Colourist.getOrangeBGSwatch(),
  FLOATER_COLOURS: Colourist.getOrangeSwatch(),
  BIRTH_POSITION: {
    x: 0,
    y: 0,
    z: 1,
  },
  RESIZE_TIMEOUT: 1000,
};

export default World;
