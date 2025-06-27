const ParticlesContent = {
  pageId: 'Particles',
  buttonText: 'Project - Yellow Bird',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 1,
      position: { row: 1, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 25 },
      sizeType: 'auto',
      type: 'title',
      src: `Yellow Bird - C++/OpenFrameworks/GLSL`,
    },
    {
      layoutNumber: 2,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
      sizeType: 'fixed',
      type: 'blank',
    },
    {
      layoutNumber: 3,
      position: { row: 2, column: 1 },
      offset: { x: 10, y: 0 },
      size: { width: 85, height: 85 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../tm-dinner_at_manons.jpg',
        alt: `Dinner at manons timeograph example`,
      },
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 105 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Finally bringing an old idea to life with coding</h2>
      <p>This is a project that I used to help learn openFrameworks, it is based on an idea I had many years ago. The primary intention is to create a new type of long exposure with creative coding and video processing rather than pure photography. Having been a photographer for a significant proportion of my life I know that if an area is bright at any point during the exposure then it will no longer capture information in that part of the image.</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 90 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Introduction to the cogs and wheels...</h2>
      <p>This essentially produces a multiple exposure image from a video source with two distinct processes that utilise OpenCV and a buffered texture. There is one process that builds the individual 'exposures' and then those exposures are layered upon one another with an algorithm that allows areas to be influenced by each exposure frame.</p>`,
    },
    {
      layoutNumber: 6,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 80, height: 80 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../tm-birds-test.jpg',
        alt: `Example of using Timeography engine for Ornithography`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 4, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      sizeType: 'auto',
      clamp: 260,
      type: 'image',
      src: {
        src: '../sweet-love-walking-new-brighton.jpg',
        alt: `Timeograph of my now wife walking along new brighton prom`,
      },
    },
    {
      layoutNumber: 11,
      position: { row: 4, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      sizeType: 'auto',
      clamp: 300,
      type: 'video',
      src: {
        src: '../dinner_at_manons_sample.mp4',
        alt: `../tm-dinner_at_manons.jpg`,
      },
    },
    {
      layoutNumber: 8,
      position: { row: 4, column: 2 },
      offset: { x: 6, y: -15 },
      size: { width: 95, height: 115 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Inspiration to automate Ornithography</h2>
      <p>I also realised that I could create images similar to www.xavibou.com who has created a beautiful series of images that capture the flight of birds. It employs an OpenCV frame difference algorithm to track the motion. There are several example and development images that are included in the bin/data folder on GitHub, and please check out the video on this page as it was the source used to create the example at the top of the page.</p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 4, column: 1 },
      offset: { x: 20, y: 20 },
      size: { width: 80, height: 15 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a href="https://github.com/gileswebberley/Timeography" target="_blank">source code</a> on GitHub`,
    },
  ],
};
export default ParticlesContent;
