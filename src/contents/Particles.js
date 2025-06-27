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
      src: `My Yellow Bird - C++/OpenFrameworks/GLSL`,
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
      size: { width: 85, height: 85 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../yellow-bird-in-use.jpg',
        alt: `Screen grab of the particle cloud dancing`,
      },
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 5, y: 0 },
      size: { width: 90, height: 132 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>My first interactive installation piece of 'art'</h2>
      <p>Starting with a tutorial on ping-pong buffers and programming shaders (glsl) I extended it to become an interactive experience, which I fortunately got to install at an art exhibition. Using a webcam and OpenCV to track movement (whos output is the little rectangle at the top-left for demo/set-up purposes) it allowed me to make the cloud of particles react to what the computer 'sees'. The result was an absorbing, and really rather medative, experience which makes the user feel like they are directly manipulating the 'cloud'.</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 5 },
      size: { width: 100, height: 115 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Playing with a little bit of chaos, again</h2>
      <p>Each of these particles has a randomly generated "personality" which affects their responsiveness and so the piece is slightly different every time it is run. The initial state is a sample of a picture, in this case a yellow bird painted by my now wife, which makes each particle take on the colour and position of the corresponding image pixel. When in a resting (ie not tracking) state the particles will stop following and try to return to their initial state. The video is simply a screen capture and so is fairly compressed and a little jittery, but it gives you an idea of what I'm trying to describe.</p>`,
    },
    {
      layoutNumber: 6,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      sizeType: 'auto',
      clamp: 320,
      type: 'video',
      src: {
        src: '../particle-tracker.mp4',
        alt: `../yellow-bird-start.jpg`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 4, column: 2 },
      offset: { x: 20, y: 0 },
      size: { width: 60, height: 60 },
      sizeType: 'auto',
      clamp: 260,
      type: 'image',
      src: {
        src: '../yellow-bird-3.jpg',
        alt: `The particle cloud dancing to the motion it sees`,
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
      position: { row: 4, column: 1 },
      offset: { x: 3, y: 0 },
      size: { width: 95, height: 110 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>What a fabulous experience</h2>
      <p>Getting the opportunity to show it at an art exhibition that supported a mental health charity was a beautiful experience, especially when I saw the therapeutic effect it had on the visitors. I originally tried to use haar cascades for people tracking but it was too unstable, and so I created a difference tracking system instead using the power of OpenCV. It was a wonderful learning experience and also extremely hypnotic to interact with during development. I improved my C++ as well as dipping a toe into shaders. </p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 4, column: 2 },
      offset: { x: 20, y: 20 },
      size: { width: 80, height: 15 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a aria-label="Visit the GitHub repo for this project" href="https://github.com/gileswebberley/ParticleTracker" target="_blank">source code</a> on GitHub`,
    },
    {
      layoutNumber: 13,
      position: { row: 5, column: 2 },
      offset: { x: 0, y: 0 },
      size: { width: 100, height: 100 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>The exhibition blurb</h2>
      <p>50000 pixels that make up a digital image of a hand-painted yellow bird are given life.
Through simple vision and an equally simple personality, made up of randomly generated variations, these pixels are created to perform for the limited world which they see. Given energy through your movements they are each influenced to express themselves individually, though become a beautiful display when playing their part in the collective. Behaving like a swarm represented by coloured droplets these pixels produce a constantly unique performance in response to you, but confined by the screen in which they exist.</p><p>
Born with only a memory of where they belong, each pixel when at rest has a desire to return to their place in the bigger picture, that of our yellow bird flying free. Distracted by their surroundings, and given the challenges and doubts within their chaotic personalities, this collective idyll is though extraordinary unlikely.</p><p>
The yellow bird can be thought of as a symbol of the peace and humility that is within an individual when given a break from torment and self doubts. The name being inspired by a phrase that Conor Oberst of Bright Eyes uses for, I believe, this ideal. For many of us it is caged by fear and a “black dog” as a constant companion, only escaping occasionally when we are able to reflect on, and embrace, our fallibilty and transcience. Similar to the pixels; we are distracted from our own wellness by the need to perform in response to the limited world which we are predisposed to see. Our strive toward the individualistic sense of self constantly obscuring the benefits that are available through an empathy for the “other” and selfless collaboration.</p>`,
    },
  ],
};
export default ParticlesContent;
