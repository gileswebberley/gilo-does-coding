//using copilot to document the structure of this type of object which is what you pass to SiteManager.buildPage()
/**
 * @typedef {Object} PageLayout
 * @property {number} layoutNumber - A unique identifier for the layout element.
 * @property {Object} position - The position of the layout element in the grid.
 * @property {number} position.row - The row position of the layout element.
 * @property {number} position.column - The column position of the layout element.
 * @property {Object} offset - The pixel offset for the layout element.
 * @property {number} offset.x - The horizontal offset in pixels.
 * @property {number} offset.y - The vertical offset in pixels.
 * @property {Object} size - The size of the layout element.
 * @property {number} size.width - The width of the layout element.
 * @property {number} size.height - The height of the layout element.
 * @property {Object} sizeType - The type of size for the layout element.
 * @property {string} sizeType.width - The width type, either 'auto' or 'fixed'.
 * @property {string} sizeType.height - The height type, either 'auto' or 'fixed'.
 * @property {string} type - The type of content (e.g., 'image', 'html', 'iframe', 'blank').
 * @property {Object|string} src - The source of the content. Can be an object for images or a string for HTML/iframe content.
 * @property {string} [src.src] - The source path for an image (if type is 'image').
 * @property {string} [src.alt] - The alt text for an image (if type is 'image').
 */
const Page_Test4 = {
  pageId: 'About',
  buttonText: 'About',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 2,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 70 },
      size: { width: 50, height: 50 },
      sizeType: 'auto',
      type: 'image',
      src: { src: '../c_faye2.jpg', alt: 'Example Image' },
    },

    {
      //This is to reference when getting info from the LayoutManger - MUST BE UNIQUE
      layoutNumber: 5,
      // let's do the row and column thing here {row, column}
      position: { row: 1, column: 1 },
      // amount to shift layout in pixels - update - now set as a percentage of width and height
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      // percentage of available size? no let's work out a way where you can set either a percentage or a max size in pixels (auto or fixed) - NO width must be a percentage and height percentage (clamp for grow behaviour or auto for aspect ratio behaviour or 'fixed' for pixel size) ----- This can now be simply a string cos it is only relevant to height
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>R:1 col:1</h2>
      <p>This is a simple HTML page with an external CSS file.</p>
      <p>
        This page is designed to test and showcase basic HTML and CSS
        integration. It serves as a sandbox environment where you can experiment
        with various web development techniques, including layout design,
        styling, and interactivity. Whether you're a beginner learning the ropes
        or an experienced developer trying out new ideas, this page provides a
        flexible and straightforward platform to explore and refine your skills.
        Feel free to explore and modify the content as needed!
      </p>`,
    },
  ],
};

export default Page_Test4;
