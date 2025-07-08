const HomeContent = {
  pageId: 'Home',
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
      src: `Let me introduce myself, I'm Giles`,
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
      offset: { x: 0, y: 20 },
      size: { width: 40, height: 35 },
      sizeType: 'auto',
      clamp: 170,
      type: 'title',
      src: `self portrait '<a onclick='window.SiteLinkManager.selectPage("Timeography")'>timeograph</a>'`,
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 130 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>How does one compress a whole life into a few paragraphs?</h2>
      <p>It could be that blurb that I'm sure you've read thousands of - "I'm passionate about this and great at that"? Well let me go about it slightly differently as I consider honesty, empathy, and kindness the most vital traits of a decent person.</p><p>I have always been considered a great team-mate and even in my leadership positions I created an environment where each person was made to feel vital and supported. I've spent my life being creative, dealing with high stress situations, and solving problems that arise; however it would be remiss of me to pretend that I have not faced challenges as I have grown up without a 'typical brain' and with the restrictions that come with the damage I caused to my spine as a kid.</p><p>Have I peaked enough of an interest for you to read on? I've got my fingers crossed that the answer is yes!</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: -15 },
      size: { width: 100, height: 85 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>A (very) brief history of Giles</h2>
      <p>I want you to feel like you can know me a bit so I'll give you some significant bits n bobs that led me here if that's ok with you? If you'd rather just check out my CV then you can download that here instead.</p>
      <details><summary>A long time ago in a...well, small town quite close to Heathrow</summary>I was a little bit different as a kid, but I was enthusiastic and actually wanted to be a stuntman when I grew up. This led to a few nasty falls, off a house and out of a tree, which years later I discovered had badly damaged my spine. It didn't stop me enjoying running fast, throwing myself around, and even being part of my state schools' rugby team that took on the local private schools though (we lost badly btw). It's actually this that has finally caught up with me and led me to be in the situation where I am asking you to consider me.</details>
      <details><summary>Out of school and straight to Glatonbury festival before starting art college</summary>It felt like I could start again and find my place in a 'tribe' when I got accepted onto a Btec course that served as a foundation to access the various fields of 'the arts'. I had a wild journey of self discovery and also discovered that my childhood passions for photography and music might be best utilised by getting into film-making.</details>
      <details><summary>A summer of surgery that set me up to start my degree in film</summary>That whole back thing had caught up with me by this point and to continue on my path I had to spend several weeks in hospital to get it repaired. With a cast plastic brace adorning me I excitedly began my BA where I met some wonderful people, learnt how teams work (namely how a team is more than the sum of it's parts), and produced varied narrative and documentary work. I majored in cinematography but did editing and a lot of sound work en route. My last student project was for our college's entry into the BAFTA/Fujifilm student awards and the team and I won gold for our camerawork. My practical work was very good, however my thesis wasn't so great sadly, probably due to the fact that I had skipped A-Levels and all the practice of formal writing.</details>
      `,
    },
    {
      layoutNumber: 8,
      position: { row: 3, column: 2 },
      offset: { x: 50, y: -40 },
      size: { width: 20, height: 35 },
      sizeType: 'auto',
      clamp: 85,
      type: 'image',
      src: {
        src: '../JS.png',
        alt: `Javascript is one of my skills`,
      },
    },
    // {
    //   layoutNumber: 9,
    //   position: { row: 3, column: 2 },
    //   offset: { x: 50, y: -40 },
    //   size: { width: 20, height: 35 },
    //   sizeType: 'auto',
    //   clamp: 85,
    //   type: 'image',
    //   src: {
    //     src: '../React.png',
    //     alt: `React is one of my skills`,
    //   },
    // },
    {
      layoutNumber: 10,
      position: { row: 3, column: 2 },
      offset: { x: 50, y: -40 },
      size: { width: 20, height: 35 },
      sizeType: 'auto',
      clamp: 85,
      type: 'image',
      src: {
        src: '../CSS3.png',
        alt: `CSS is one of my skills`,
      },
    },
    {
      layoutNumber: 11,
      position: { row: 3, column: 2 },
      offset: { x: 50, y: -40 },
      size: { width: 20, height: 35 },
      sizeType: 'auto',
      clamp: 85,
      type: 'image',
      src: {
        src: '../HTML5.png',
        alt: `HTML is one of my skills`,
      },
    },
    {
      layoutNumber: 6,
      position: { row: 4, column: 2 },
      offset: { x: 3, y: -15 },
      size: { width: 95, height: 125 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Life is for living, and learning</h2>
      <p>Having spent a while getting back up to speed with web development mainly through a course in React I decided that, for my portfolio, I wanted to rediscover some confidence with 'vanilla' HTML,CSS, and Javascript. This was originally reliant on the Flash player but I fell in love with the idea and decided I wanted to recreate it with the, massively matured, tools that are now available.</p><p>Each of these elements is built with a bit of 'personality' via a randomisation of various properties which is a method I enjoy using, I define some boundaries and then let my creations do their thing.</p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 4, column: 1 },
      offset: { x: 20, y: 200 },
      size: { width: 80, height: 15 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a href="https://github.com/gileswebberley/gilo-does-coding" target="_blank">source code</a> on GitHub`,
    },
  ],
};
export default HomeContent;
