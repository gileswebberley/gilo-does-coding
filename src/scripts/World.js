const World = {
  DEPTH: 100,
  DURATION: 1000,
  MAX_SPEED: 4,
  MIN_SPEED: 1,
  POSSIBLE_EASING_STYLES: ['ease-in', 'ease-out', 'ease-in-out', 'linear'],
  BIRTH_POSITION: {
    x: 0,
    y: 0,
    z: 1,
  },
};

window.addEventListener('resize', () => {
  setTimeout(() => {
    const elements = document.querySelectorAll('.floater');
    elements.forEach((element) => {
      const layoutNumber = element.getAttribute('data-layout-number');
    });
  }, 1000); // Delay to allow for resizing
});

export default World;
