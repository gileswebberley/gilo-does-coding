const WelcomeContent = {
  pageId: 'Welcome',
  buttonText: 'Welcome',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 1,
      position: { row: 1, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 25 },
      sizeType: 'auto',
      type: 'title',
      src: `Hi, I'm Giles Webberley`,
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
      offset: { x: 10, y: 10 },
      size: { width: 60, height: 60 },
      sizeType: 'auto',
      clamp: 250,
      type: 'image',
      src: {
        src: '../selfportrait.jpg',
        alt: `self portrait produced with my Timeography project`,
      },
    },
    {
      layoutNumber: 4,
      position: { row: 2, column: 1 },
      offset: { x: -5, y: 20 },
      size: { width: 40, height: 35 },
      sizeType: 'grow',
      clamp: 190,
      type: 'title',
      src: `self portrait <a onpointerdown='window.SiteLinkManager.selectPage("Home")'>'timeograph'</a>`,
    },
    {
      layoutNumber: 5,
      position: { row: 2, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 110 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>What is this nonsense!?</h2>
      <p>I imagine you're wondering what on earth is going on with all these floaty things ambling around the screen, although I hope you like it? Do please resize your browser to see how the layout manager responds if you're on a desktop, and also be aware that the colour scheme is based on your browser preference along with the time of day (I'm a child of the 70s btw so hence my love of orange tones!!).</p>`,
    },

    {
      layoutNumber: 6,
      position: { row: 3, column: 1 },
      offset: { x: 10, y: 0 },
      size: { width: 100, height: 100 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>A chance to give new life to an old idea...</h2>
      <p>It's actually a concept that was originally born back in the early noughties when I was last working as a web developer. For our new business myself and my colleague/friend developed a CMS that fed an advanced actionscript front-end to build pages out of elements that 'lived' within a 2.5d space.</p>
      <p>Having spent a while getting back up to speed with web development through a course in React development I decided that, for my protfolio, I wanted to rediscover some confidence with 'vanilla' HTML,CSS, and Javascript. This was originally reliant on the Flash player but I fell in love with the idea and decided I wanted to recreate it with the, massively matured, tools that are now available.</p><p>Each of these elements is built with a bit of 'personality' via a randomisation of various properties, from their colour scheme, through to how 'keen' they are when moving.</p>`,
    },
  ],
};
export default WelcomeContent;
