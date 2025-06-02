const Page_Test = {
  pageId: 'Test',
  buttonText: 'Test page',
  content: [
    {
      //This is to reference when getting info from the LayoutManger - MUST BE UNIQUE
      layoutNumber: 1,
      // let's do the row and column thing here {row, column}
      position: { row: 1, column: 1 },
      // amount to shift layout in pixels
      offset: { x: 0, y: 0 },
      // percentage of available size? no let's work out a way where you can set either a percentage or a max size in pixels (auto or fixed)
      size: { width: 100, height: 300 },
      sizeType: { width: 'auto', height: 'fixed' },
      type: 'html',
      src: `<button
        onclick="alert('Hello, world!')"
        >Gilo Does Coding</button
      >
      <h2>Welcome to the Test Page</h2>
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
    {
      layoutNumber: 2,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 200 },
      sizeType: { width: 'auto', height: 'fixed' },
      type: 'image',
      src: { src: '../c_faye2.jpg', alt: 'Example Image' },
    },
    {
      layoutNumber: 3,
      position: { row: 1, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 50, height: 200 },
      sizeType: { width: 'auto', height: 'fixed' },
      type: 'iframe',
      src: '../TestPage.html',
    },
  ],
};

export default Page_Test;
