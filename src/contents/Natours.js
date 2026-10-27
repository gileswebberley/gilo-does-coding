const NatoursContent = {
  pageId: 'Natours',
  buttonText: 'Project - Natours',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 1,
      position: { row: 1, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 35 },
      sizeType: 'auto',
      type: 'title',
      src: `Natours - Node/Express/MongoDB/Mongoose/Stripe/RESTful API/SSR`,
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
      size: { width: 85, height: 95 },
      sizeType: 'auto',
      // clamp: 320,
      type: 'image',
      src: {
        src: '../natours_desktop_allTours.jpg',
        alt: `Overview Page of the Natours Front-End`,
      },
    },

    {
      layoutNumber: 4,
      position: { row: 2, column: 1 },
      offset: { x: 14, y: 0 },
      size: { width: 80, height: 15 },
      sizeType: 'auto',
      clamp: 170,
      type: 'title',
      src: `<a href="https://natours-wfs1.onrender.com/" target="_blank">visit the live website</a>`,
    },
    {
      layoutNumber: 15,
      position: { row: 2, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 10 },
      sizeType: 'fixed',
      type: 'blank',
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 0, y: 10 },
      size: { width: 100, height: 160 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Not just following along with a course</h2>
      <p>The course this is based on was created in 2019 and although it's sold as updated I found it was far from so. Essentially I have updated the contents as I have followed along to work with Mongoose 9, Express 5, and ES Modules. I have used AI and my intuition from many years of tinkering with development to question the examples given whenever a new concept or package was introduced, and also used it to help with reviewing the significant changes that I made. On top of this I have made changes to the styling to make the front-end responsive allowing it to be viewed on all screen sizes down to the smallest of modern smartphones. I also integrated Leaflet to replace the use of MapBox and added Cloudinary storage pipeline for image uploads. I have used it as a jumping-off point to research and challenge myself to understand back-end development, at least to an entry-level grade.</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 130 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>The development process was full of discoveries</h2>
      <p>Possibly the most challenging, and therefore most rewarding, part of building Snotify was learning how to create a pkce authorisation workflow that would be secure and compliant with Spotify's requirements. This involved understanding how to generate a code challenge and verifier, and how to use them in the authorisation flow. I used AI as an artificial colleague to help me understand any bugs that arose during development, of which there were several, especially when I integrated TanStack Query which was racing to use my api and causing issues with refreshing tokens. You can read about my solution in <a aria-label="check out my article about my pkce workflow solution" href="https://dev.to/giles_webberley_2c4cc9f84/getting-to-grips-with-pkce-spotify-authentication-in-a-react-js-app-5g8n" target="_blank">this article</a> that I published on DEV.to</p>`,
    },
    {
      layoutNumber: 6,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 80, height: 120 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../soty25Header.gif',
        alt: `Desktop view of a playlist with it's intelligent header colour scheme that imitates the Spotify playlist header`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 4, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../scrolledListing.gif',
        alt: `desktop view of a scrolled playlist showing the sticky header and the way the listing items are highlighted when they are hovered over`,
      },
    },
    {
      layoutNumber: 8,
      position: { row: 4, column: 2 },
      offset: { x: 6, y: 0 },
      size: { width: 95, height: 175 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Making it feel familiar and work intuitively</h2>
      <p>A lot of the work involved was to get the styling to feel like Spotify's own UI and make it seamlessly responsive across different screen sizes. I also made sure to use the same colour palette and typography that Spotify uses to make the app feel like a native Spotify experience. A lot of tweaking was required especially to get the playlist header colour a reflection of the dominant colour in the album art. The Spotify algorithm for this is more involved than I could replicate but I was delighted with the results.</p>
      <p>When I started to use it for the annual Song of the Year competition that my friends and I enjoy for New Years Eve I decided to add a feature that allows users to add a note to whatever they are currently playing on Spotify itself. That way you can add a note before you've added it to a playlist and it will be connected to that track wherever you save it.</p>`,
    },
    {
      layoutNumber: 11,
      position: { row: 5, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 95, height: 190 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Other stuff involved and an apology</h2>
      <p>So, first off the apology - Unfortunately because of the limitations Spotify places on third-party apps in development mode I am unable to invite you to check it out live and use it. If you are really keen to give it a go then you could pop me an email with your Spotify username (email address that's registered) and I could add you to one of the 5 users it's allowed to have, so long as my friends aren't using it at the time.</p>
      <p>In terms of other stuff I learnt and implemented, probably the big thing was to create a PWA so that it feels like a native app on mobile devices especially. Through a long 'discussion' with my artificial colleague I was able to utilise the VitePWA plugin that takes care of most of the details and has proved to be a really nice touch to the final product. Another biggie was using the infinite query feature in TanStack Query with a loading trigger list item that allows for a seamless loading experience when scrolling through large lists of items, along with the great caching capabilities that this package offers.</p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 5, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 45, height: 100 },
      sizeType: 'auto',
      clamp: 150,
      type: 'image',
      src: {
        src: '../NTWICM-Mobile.gif',
        alt: `mobile view showing another playlist with it's header colour scheme`,
      },
    },
    {
      layoutNumber: 13,
      position: { row: 5, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 45, height: 100 },
      sizeType: 'auto',
      clamp: 150,
      type: 'image',
      src: {
        src: '../viewNoteMobile.gif',
        alt: `mobile view of a playlist with a track's note being viewed`,
      },
    },
    {
      layoutNumber: 14,
      position: { row: 6, column: 1 },
      offset: { x: 20, y: 20 },
      size: { width: 80, height: 25 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a aria-label="Visit the GitHub repo for this project" href="https://github.com/gileswebberley/spotify-notes" target="_blank">source code</a> on GitHub`,
    },
  ],
};
export default NatoursContent;
