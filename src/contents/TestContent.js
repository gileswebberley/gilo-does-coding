//using copilot to document the structure of this type of object which is what you pass to SiteManager.buildPage()
/**
 * @typedef {Object} PageLayout
 * @property {string} pageId - A unique page identifier
 * @property {string} buttonText - The label for the button within the navigation system
 * @property {string} aspectRation - The base aspect ratio for layout containers (ie the ratio to work out rowHeight based on columnWidth) in the format 'widthUnits:heightUnits'
 * @property {Array<ContentElement>} content - The individual elements that form the page
 *
 * @typedef {Object} ContentElement
 * @property {number} layoutNumber - A unique identifier for the layout element.
 * @property {Object} position - The position of the layout element in the grid.
 * @property {number} position.row - The row position of the layout element.
 * @property {number} position.column - The column position of the layout element.
 * @property {Object} offset - The pixel offset for the layout element.
 * @property {number} offset.x - The horizontal offset as a percentage of width.
 * @property {number} offset.y - The vertical offset as a percentage of height.
 * @property {Object} size - The size of the layout element.
 * @property {number} size.width - The width of the layout element as a percentage of the column width.
 * @property {number} size.height - The height of the layout element if sizeType is:
 * 'fixed' it is as pixels
 * 'auto' it is percentage of the height according to aspectRatio (ie based on columnWidth)
 * 'grow' it is clamped to auto when columnWidth is full otherwise it proportionally bigger than auto based on how much smaller columnWidth is (hard to explain but essentially makes it taller than it would be if the width gets smaller than hoped).
 * @property {string} sizeType - controls the height calculations as described in size.height.
 * @property {number} clamp - The minimum width (in pixels) that this element can be, it will be wrapped if it cannot fit on it's own row. This was developed so images and video in particular can't get too small (sizeType must be 'auto' for this to work, cos it kinda works with the aspect ratio of the w:h).
 * @property {string} type - The type of content (e.g., 'image', 'html', 'iframe', 'blank').
 * @property {Object|string} src - The source of the content. Can be an object for images or a string for HTML/iframe content.
 * @property {string} [src.src] - The source path for an image (if type is 'image').
 * @property {string} [src.alt] - The alt text for an image (if type is 'image') or a url for the poster image if it is of type 'video'.
 */
const Page_Test = {
  pageId: 'Home',
  buttonText: 'Home Button Testing',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 2,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 70 },
      size: { width: 50, height: 50 },
      sizeType: 'auto',
      clamp: 250,
      type: 'image',
      src: { src: '../c_faye2.jpg', alt: 'Example Image' },
    },
    {
      //This is to reference when getting info from the LayoutManger - MUST BE UNIQUE
      layoutNumber: 1,
      // let's do the row and column thing here {row, column}
      position: { row: 2, column: 2 },
      // amount to shift layout in pixels
      offset: { x: 0, y: 0 },
      // percentage of available size? no let's work out a way where you can set either a percentage or a max size in pixels (auto or fixed)
      size: { width: 100, height: 80 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <button id="link-to-welcome"
        onclick="SiteLinkManager.selectPage('Welcome')"
        >Gilo Does Coding</button
      >
      <h2>R:2 Col:2</h2>
      <p>This is a simple HTML page with an external CSS file.</p>
      <details>
        <summary>This page is designed to test and showcase basic HTML and CSS
        integration.</summary> It serves as a sandbox environment where you can experiment
        with various web development techniques, including layout design,
        styling, and interactivity. Whether you're a beginner learning the ropes
        or an experienced developer trying out new ideas, this page provides a
        flexible and straightforward platform to explore and refine your skills.
        Feel free to explore and modify the content as needed!
      </details>`,
    },
    {
      layoutNumber: 3,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 30 },
      size: { width: 50, height: 50 },
      sizeType: 'auto',
      clamp: 250,
      type: 'iframe',
      src: '../TestPage.html',
    },

    //for testing...If you want to use a blank then make sure you put it before the element that you wish to effect
    {
      layoutNumber: 4,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 25, height: 10 },
      sizeType: 'fixed',
      type: 'blank',
    },
    {
      layoutNumber: 7,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 100 },
      sizeType: 'auto',
      type: 'video',
      src: { src: '../Bad Guy SS2.mp4' },
    },
    {
      //This is to reference when getting info from the LayoutManger - MUST BE UNIQUE
      layoutNumber: 5,
      // let's do the row and column thing here {row, column}
      position: { row: 1, column: 1 },
      // amount to shift layout in pixels - update - now set as a percentage of width and height
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 20 },
      // percentage of available size? no let's work out a way where you can set either a percentage or a max size in pixels (auto or fixed) - NO width must be a percentage and height percentage (clamp for grow behaviour or auto for aspect ratio behaviour or 'fixed' for pixel size) ----- This can now be simply a string cos it is only relevant to height
      sizeType: 'grow',
      type: 'title',
      src: `Welcome to the Test Page, let's just check how it works when longer`,
    },
    {
      layoutNumber: 6,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 100 },
      sizeType: 'grow',
      type: 'iframe',
      src: '../TestPage.html',
    },
  ],
};

export default Page_Test;
