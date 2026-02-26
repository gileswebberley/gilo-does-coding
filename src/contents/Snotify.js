const SnotifyContent = {
  pageId: 'Snotify',
  buttonText: 'Project - Snotify',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 1,
      position: { row: 1, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 35 },
      sizeType: 'auto',
      type: 'title',
      src: `Snotify - React/CSS/TanStack Query/Dexie/Spotify WebAPI/PWA`,
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
      clamp: 320,
      type: 'image',
      src: {
        src: '../login.gif',
        alt: `Login process of the Snotify app`,
      },
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 110 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>I wanted to add notes to my Spotify tracks</h2>
      <p>I love discovering music but when I discover it via Spotify I have often wanted to be able to add notes to the tracks as I add them to my playlists. Because this ability does not exist (even though I made a 'developer suggestion' on Spotify's developer forum) I decided to build my own app that would allow me to do this. With this desire in mind I created Snotify, a Progressive Web App that communicates with the Spotify Web API and stores my notes in a local database using Dexie.js.</p>`,
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
    // {
    //   layoutNumber: 11,
    //   position: { row: 4, column: 1 },
    //   offset: { x: 0, y: 0 },
    //   size: { width: 50, height: 50 },
    //   sizeType: 'auto',
    //   clamp: 300,
    //   type: 'video',
    //   src: {
    //     src: '../dinner_at_manons_sample.mp4',
    //     alt: `../tm-dinner_at_manons.jpg`,
    //   },
    // },
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
      size: { width: 80, height: 15 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a aria-label="Visit the GitHub repo for this project" href="https://github.com/gileswebberley/spotify-notes" target="_blank">source code</a> on GitHub`,
    },
  ],
};
export default SnotifyContent;
