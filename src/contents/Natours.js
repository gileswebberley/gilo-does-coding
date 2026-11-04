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
      offset: { x: 10, y: 10 },
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
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 185 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Not just following along with a course</h2>
      <p>The course this is based on was created in 2019 and I quickly realised that simply following legacy code wouldn't cut it for modern web standards. Essentially I used the curriculum as a launching pad to independently re-engineer the system. I modernised the core architecture to run on Node.js (v22+), Express 5, and ES Modules. I used AI, along with my intuition from many years of tinkering with development, to question the examples given whenever a new concept or package was introduced, and also used it to peer-review my structural architectural choices.</p><p> Beyond the backend I overhauled the styling too to create a fully responsive fluid UI across all devices. I also integrated Leaflet to replace the now pay-walled MapBox and added a cloud asset pipeline using Cloudinary and the Sharp image compiler to handle dynamic user image uploads. I have used it as a jumping-off point to research and challenge myself to understand back-end development, at least to an entry-level grade. If you visit the live website please be aware that it takes a while for Render to spool-up.</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 165 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Building my first backend</h2>
      <p>I decided to use this course and project to get an understanding of MVC architecture and modern backend development (the M, E, and N of MERN having already got upto speed via another course with the R to produce a final project called '<a onclick='window.SiteLinkManager.selectPage("Wild")'>Wild-Oasis'</a>.</p><p> I had, many moons ago, studied database design with the Open University and so some of the data modelling concepts were familiar, however developing a live RESTful API was all completely new to me. It has given me familiarity with essential industry diagnostics like Postman and MongoDB Compass and also introduced quite advanced techniques such as building multi-stage MongoDB aggregation pipelines with Mongoose 9, dealing with Geospatial Data, implementing and utilising model-level pre/post hooks and static/instance methods, and building routes which pass through authentication and role authorisation middleware.</p>`,
    },
    {
      layoutNumber: 6,
      position: { row: 3, column: 2 },
      offset: { x: 10, y: 0 },
      size: { width: 80, height: 120 },
      sizeType: 'auto',
      // clamp: 320,
      type: 'image',
      src: {
        src: '../natours_desktop_bookings_detail.jpg',
        alt: `Sample of my bookings showing the edit review option for bookings that have already taken place`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 4, column: 1 },
      offset: { x: 0, y: 30 },
      size: { width: 100, height: 150 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../postman_endpoints.jpg',
        alt: `Postman in action with a selection of endpoints and the data returned by querying Get Distances From Point endpoint`,
      },
    },
    {
      layoutNumber: 8,
      position: { row: 4, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 275 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Managing scale: 30+ endpoints and Server-Side Rendering</h2>
<p>
  As the application grew, it became a massive lesson in route management and 
  architectural structure. The backend scales up to over 30 unique API endpoints 
  handling everything from deep tour querying, reviews, and bookings, to complex 
  user accounts. Managing this amount of possible routes required a clean separation 
  of concerns across independent router files.
</p>
<p>
  To serve the frontend, I opted for a hybrid architecture: Server-Side Rendering 
  (SSR) via Pug templates backed by client-side asynchronous hydration. I built a 
  dedicated <code>viewController</code> that does far more than just map static routes. 
  It handles complex real-time data stitching. For example, when rendering a user's 
  booked tours, the controller uses <code>structuredClone</code> to safely inject dynamic 
  Stripe references, custom attendee counts, and historical date configurations into 
  cloned database objects. I even embedded MongoDB aggregation pipelines directly into 
  the tour view engine to cross-reference total bookings against maximum group capacities, 
  letting the server calculate accurate "spaces left" counts and sold-out states in real time.
</p>
<p>
  To link this to the browser smoothly, I appended lightweight vanilla JavaScript 
  modules and <strong>Axios</strong> to the head of specific templates. This allowed 
  the server to deliver secure initial HTML components (such as passing cryptographic 
  tokens into hidden layout fields), while client-side scripts intercepted form actions 
  to communicate asynchronously with my API—providing slick alert configurations and instant 
  success notifications without forcing disruptive full-page refreshes.
</p>`,
    },
    {
      layoutNumber: 11,
      position: { row: 5, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 95, height: 235 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>When things don't feel secure even to a non-hacker</h2>
      <p>Crucially, I didn't want to just leave the app with the basic, vulnerable security setup you often get in tutorials. Instead, I challenged myself to research and fix real-world edge cases. For instance, I noticed a massive loophole where a hacker could hijack an account simply by changing the email address without even knowing the password. To stop this, I built a two-way email change system that requires verification from the new address while giving the old address an instant 'revert' link to claw back the account if it was malicious. I even added a bit of clever code that forces the system to log out any active hacker sessions the second the account is reclaimed and cool-off periods between vital changes.</p><p>I also dug into more advanced protections, like adding artificial delays to failed logins to throw off automated bots trying to guess valid emails. On top of that, because Express 5 handles data parameters much more strictly than older versions, some popular sanitisation packages broke completely. I had to write a custom object-property override using <code>Object.defineProperty</code> just to keep the data safe from NoSQL injections, and manually configured a strict Content Security Policy in Helmet so my front-end maps could load safely without opening the door to cross-site scripting.</p>`,
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
        src: '../natours_phone_settings_menu_open.jpg',
        alt: `mobile view showing account settings with hamburger menu open`,
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
        src: '../natours_phone_reviews.jpg',
        alt: `mobile view of a tour review being edited`,
      },
    },
    {
      layoutNumber: 14,
      position: { row: 6, column: 1 },
      offset: { x: 20, y: 20 },
      size: { width: 80, height: 25 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a aria-label="Visit the GitHub repo for this project" href="https://github.com/gileswebberley/natours" target="_blank">source code</a> on GitHub`,
    },
  ],
};
export default NatoursContent;
