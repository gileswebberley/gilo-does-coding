const Page_Test = {
  title: 'Test',
  description: 'Test page',
  content: [
    {
      // let's do the row and column thing here {row, column}
      position: { row: 1, column: 1 },
      width: 'auto',
      height: 'auto',
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
      position: 2,
      type: 'image',
      src: 'https://example.com/image.jpg',
      alt: 'Example Image',
    },
    {
      position: 3,
      type: 'video',
      src: 'https://example.com/video.mp4',
      alt: 'Example Video',
    },
  ],
};

export default Page_Test;
