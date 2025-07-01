const SpectrumContent = {
  pageId: 'Spectrum',
  buttonText: 'Project - Music Visualiser',
  aspectRatio: '16:9',
  content: [
    {
      layoutNumber: 1,
      position: { row: 1, column: 1 },
      offset: { x: 0, y: 0 },
      size: { width: 150, height: 25 },
      sizeType: 'auto',
      type: 'title',
      src: `Spectrum Sampler - C++/OpenFrameworks/FFT`,
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
      offset: { x: 10, y: 20 },
      size: { width: 85, height: 85 },
      sizeType: 'auto',
      clamp: 320,
      type: 'image',
      src: {
        src: '../Bad-Guy_screengrab.jpg',
        alt: `Screen grab of Bad Guy visualisation`,
      },
    },
    {
      layoutNumber: 7,
      position: { row: 2, column: 2 },
      offset: { x: 5, y: 0 },
      size: { width: 90, height: 145 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Learning C++ to be creative with OpenFrameworks</h2>
      <p>This was my first project coding with c++ and using openFrameworks. I had read up about writing C so that I could produce a few simple projects with an Arduino kit, and that led me to OpenFrameworks as a way to create reactive projects. I have a deep passion for listening to music and back in the 90s I thoroughly enjoyed the early music visualisations. I wanted to understand how they worked, as I found they didn't seem to hear the music the way I did, and it also gave me a reason to look into signal processing. Check out the videos on this page, but be aware they are very compressed so it's best if you grab the project and try it yourself if possible.</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: 5 },
      size: { width: 100, height: 145 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>Getting to grips with FFTs and how my program listens</h2>
      <p>When I discovered the FFT capabilities in OF I researched how they worked and what the data signified (understanding the basics of "buckets"). To practice with the idea of Vertex Buffer Objects (VBOs), and getting close to the GPU as a processor, I created an extension of a tutorial project in the OF Book and made the mesh react to music. I spent many happy hours listening to some of my favourite music and tweaking the reactions until it could listen to all sorts of tunes and visualise it in a way that I felt expressed the various moods. There is a very simple beat detection system that influences the movement of the 'critters' whilst the scale, movement of points, colour, and overall feel are driven by rms values of the various tone ranges.</p>`,
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
        src: '../Bad Guy SS2.mp4',
        alt: `../Bad-Guy_screengrab.jpg`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 4, column: 1 },
      offset: { x: 5, y: 0 },
      size: { width: 90, height: 90 },
      sizeType: 'auto',
      clamp: 320,
      type: 'video',
      src: {
        src: '../Aldous-Harding.mp4',
        // alt: `The particle cloud dancing to the motion it sees`,
      },
    },
    {
      layoutNumber: 8,
      position: { row: 4, column: 2 },
      offset: { x: 3, y: 0 },
      size: { width: 95, height: 165 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>Please do have a play with it or use it as a starting point for your own solution</h2>
      <p> If you would like to play with it there are Visual Studio Solution files available in the GitHub repo. Any music files that you add to the data folder will automagically appear as tracks that can be played and visualised. There is a kind of Jukebox system within the project which allows you skip tracks (with the Enter button) and it's also capable of playing random tracks or specific tracks, or indeed play multiple tracks in the style of a sampler (check out my <a onclick='window.SiteLinkManager.selectPage("VtS")'>Vision-to-Sound</a> project for how I used that!). There are a few examples of me trying to create re-useable modules but my OOP was still poor when I tried to put the theory into practice. I very much looked forward to improving it, adding the ability to react to live music for starters, if I had got to work with people who could mentor me; however it's a lovely project I could go back to as I find my own confidence too.</p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 4, column: 1 },
      offset: { x: 20, y: 20 },
      size: { width: 80, height: 15 },
      sizeType: 'grow',
      type: 'title',
      src: `check out the <a aria-label="Visit the GitHub repo for this project" href="https://github.com/gileswebberley/SpectrumSampler" target="_blank">source code</a> on GitHub`,
    },
    //     {
    //       layoutNumber: 13,
    //       position: { row: 5, column: 2 },
    //       offset: { x: 0, y: 0 },
    //       size: { width: 100, height: 100 },
    //       sizeType: 'grow',
    //       type: 'html',
    //       src: `<h2>The exhibition blurb</h2>
    //       <p>50000 pixels that make up a digital image of a hand-painted yellow bird are given life.
    // Through simple vision and an equally simple personality, made up of randomly generated variations, these pixels are created to perform for the limited world which they see. Given energy through your movements they are each influenced to express themselves individually, though become a beautiful display when playing their part in the collective. Behaving like a swarm represented by coloured droplets these pixels produce a constantly unique performance in response to you, but confined by the screen in which they exist.</p><p>
    // Born with only a memory of where they belong, each pixel when at rest has a desire to return to their place in the bigger picture, that of our yellow bird flying free. Distracted by their surroundings, and given the challenges and doubts within their chaotic personalities, this collective idyll is though extraordinary unlikely.</p><p>
    // The yellow bird can be thought of as a symbol of the peace and humility that is within an individual when given a break from torment and self doubts. The name being inspired by a phrase that Conor Oberst of Bright Eyes uses for, I believe, this ideal. For many of us it is caged by fear and a “black dog” as a constant companion, only escaping occasionally when we are able to reflect on, and embrace, our fallibilty and transcience. Similar to the pixels; we are distracted from our own wellness by the need to perform in response to the limited world which we are predisposed to see. Our strive toward the individualistic sense of self constantly obscuring the benefits that are available through an empathy for the “other” and selfless collaboration.</p>`,
    //     },
  ],
};
export default SpectrumContent;
