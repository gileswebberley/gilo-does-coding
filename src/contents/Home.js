const HomeContent = {
  pageId: 'Home',
  buttonText: 'This is me',
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
      size: { width: 100, height: 170 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>How does one compress a whole life into a few paragraphs?</h2>
      <p>It could be that blurb that I'm sure you've read thousands of times - "I'm passionate about this and great at that"? Well let me go about it slightly differently as I consider honesty, empathy, and kindness the most vital traits of a decent person.</p><p>I have always been considered a great team-mate and even in my leadership positions I created an environment where each person was made to feel vital and supported. I've spent my life being creative, dealing with high stress situations, and solving problems that arise; however it would be remiss of me to pretend that I have not faced challenges as I have grown up without a 'typical brain' and with the restrictions that come with the damage I caused to my spine as a kid.</p><p>Have I peaked enough of an interest for you to read on? I've got my fingers crossed that the answer is yes!</p>`,
    },

    {
      layoutNumber: 5,
      position: { row: 3, column: 1 },
      offset: { x: 0, y: -15 },
      size: { width: 100, height: 155 },
      sizeType: 'grow',
      type: 'html',
      src: `<h2>The very brief history of Giles</h2>
      <img src="../sweet-love-walking-new-brighton.jpg" alt="timeograph of my wife in New Brighton" style="width: 30%; height: auto; float:left; margin-right: 5%;" />
      <p>I want you to feel like you can know me a bit so I'll give you some significant bits n bobs that led me here if that's ok with you? If you'd rather just check out my CV then you can download that here instead.</p>
      <p>In a nutshell I have been a lighting cameraman for broadcast work, then I was a web designer/developer. When that ended I went back to lens based media with a career in photography (mainly weddings). I then went through some big life changes and found myself managing bars and becoming a mixologist (not just a naff name for a cocktail bartender btw, I was designing inovative cocktail menus so this is the only word for it I think). Since having to stop that work I have been trying to switch career back to the only office job I ever loved, which was being creative with code.</p>

      `,
    },
    {
      layoutNumber: 8,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: -40 },
      size: { width: 20, height: 35 },
      sizeType: 'auto',
      clamp: 180,
      type: 'image',
      src: {
        src: '../SpideyTitle.jpg',
        alt: `Spiderman television series title sequence still frame`,
      },
    },
    {
      layoutNumber: 10,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: -40 },
      size: { width: 30, height: 35 },
      sizeType: 'auto',
      clamp: 180,
      type: 'image',
      src: {
        src: '../recipe book 2.jpg',
        alt: `My cocktail recipe book`,
      },
    },
    {
      layoutNumber: 11,
      position: { row: 3, column: 2 },
      offset: { x: 0, y: -40 },
      size: { width: 30, height: 35 },
      sizeType: 'auto',
      clamp: 180,
      type: 'image',
      src: {
        src: '../dunvegan dusk 3.jpg',
        alt: `One of my landscape photographs`,
      },
    },
    {
      layoutNumber: 6,
      position: { row: 4, column: 2 },
      offset: { x: 3, y: -15 },
      size: { width: 95, height: 210 },
      sizeType: 'grow',
      type: 'html',
      src: `
      <h2>The much less brief history of me</h2>
      <details><summary>A long time ago in a...well, small town quite close to Heathrow</summary>I was a little bit different as a kid, but I was enthusiastic and wanted to be a stuntman when I grew up. This led to a few nasty falls, off a house (whilst "being Spiderman") and out of a tree, which years later I discovered had badly damaged my spine. It didn't stop me enjoying running fast, throwing myself around, and even being part of my state schools' rugby team that took on the local private schools though (we lost badly btw). It's actually this that has finally caught up with me and led me to be in the situation where I am asking you to consider me.</details>

      <details><summary>Out of school and straight to Glatonbury festival before starting art college</summary>It felt like I could start again and find my place in a 'tribe' when I got accepted onto a Btec course that served as a foundation to access the various fields of 'the arts'. I had a wild journey of self discovery and also discovered that my childhood passions for photography and music might be best utilised by getting into film-making.</details>

      <details><summary>A summer of surgery that set me up to start my degree in film</summary>That whole back thing had caught up with me by this point and to continue on my path I had to spend several weeks in hospital to get it repaired. With a cast plastic brace adorning me I excitedly began my BA where I met some wonderful people, learnt how teams work (namely how a team is more than the sum of it's parts), and produced varied narrative and documentary work. I majored in cinematography but did editing and a lot of sound work en route. My last student project was for our college's entry into the BAFTA/Fujifilm student awards and the team and I won gold for our camerawork. My practical work was very good, however my thesis wasn't so great sadly, probably due to the fact that I had skipped A-Levels and all the practice of formal writing.</details>

      <details><summary>Time to see if I could make a go of being a cameraman professionally</summary>I would take on occasional wedding photography jobs, which helped with my confidence and kept the key skills fresh, whilst working crazy hours in pubs and restaurants. I was also getting myself out there with film agencies looking for the opportunity to gain experience which led to several bits of unpaid work over the subsequent years, giving me an insight into the thought processes and techniques of those professionals I was working with. These invaluable lessons allowed me to produce good results when I finally managed to get the opportunity to work as a documentary cameraman on a BBC education film. The following years were an extremely exciting time which led me to meet people from all walks of life, from a Prime Minister to a Chocolate Factory Packer. Possibly the most rewarding part was seeing the world through so many others' experience although I had found myself in a position where I would hear a lot of 'off the record' politics. Making trips to Europe and around the country with a tiny team was amazing, constanly problem solving and developing aesthetics quickly. When I recieved the gutting news that almost all of my contracts were being forced to use in-house crew I felt it was time to look for my next creative opportunity.</details>

      <details><summary>I'll use my background training in graphic design and teach myself how the web works</summary>I got myself up to speed with the basics of web development and was lucky enough to find a job with very knowledgable developers who took me under their wing and mentored me in the programming side of the job. I became fascinated by the ECMAscripts, Actionscript and Javascript, as they offered a level of dynamism and design that allowed me to make the user interactions more natural and eye-catching through movement and reactive feedback. It was the days of the browser wars and to make development more efficient we built a library of cross browser design tools which allowed us to build once and let the scripts do the browser specific alterations. My colleague looked after the back-end side of things although I picked up some basic skills for myself as it was a very collaborative environment. I became extremely proficient in my front-end design and programming and really enjoyed the constant learning that was involved. Unfortunately there was another unhappy ending, the business was getting into trouble and after a few months of struggling to get paid we were faced with the situation of being out of work through the insolvency of the company.</details>

      <details><summary>It's ok, let's just take our skills and try to go out on our own</summary>My colleague, and friend, went on to form a partnership so that we could see through what we had started and offer our CMS+Flash system to small businesses for a low fixed cost. Both of us found short freelancing contracts to subsidise our work and produced several innovative websites including a Flash one for a film production company, who encouraged creativity, that resulted in the site that inspired this one. We also produced a great site for a publisher, creating the unique CMS for their requirements, which we did at a low cost so that we could build the framework and offer it to small publishers who were priced out of the market at the time. Eventually our lack of natural self promotion and business accumen led my partner to find a full time role coding and myself to feel like I should go back to lens based work where I felt more confident, but mainly as a photographer this time.</details>

      <details><summary>It was a lot of fun but I was more confident in my lens-based media skills still</summary>
Film photography had been a constant thread through life since I first started using a camera as a child so I had the skills to pick up the new fangled digital photography. I was an early convert as I had been using broadcast quality digital cine-cameras which had given me knowledge of the technologies involved, and I had also now gained the experience of dealing with digital imagery in Photoshop - finally I could have a 'darkroom' at home. There was a burgeoning market for a 'reportage' approach to wedding photography for which my documentary skills, and the people skills that came with it, were ideal. I got a portfolio together by offering my services at a very low price whilst I gained experience and learnt the craft. Taking my lighting skills from the film world I was reluctant to adopt the camera mounted flash technique that was most common in the field and so utilised a wireless multi flash system along with modifiers to produce high-end looking images. When I came to build a website for myself I found my skills had become very rusty. It was deeply frustrating but I took the opportunity to learn about jQuery which was like an ultimate version of the libraries we had been tinkering with and developing. This is when I realised that I had actually reached a fairly high standard with my coding and I had pangs of regret for simply leaving it in the past.</details>

      <details><summary>Still got the bug - the OU years and how life can bite</summary>
I had the desire to use programming again but this time I was going to start from the basics rather than just hack my way to solutions and so I got the 2 books that make up a maths A-level and worked through them in my spare time. This kick started my 'Big Life Plan'. I found that I could transfer points from my previous degree to go towards a more relevant degree via the OU. I studied mathematics for modelling, and software development with Java, up to 2nd year degree level achieving good results throughout. It included modules on physics along with OOP, database design, and concurrent programming. When the time was approaching for me to conclude my degree with two 3rd year modules, including an introduction to artificial intelligence, I contacted my old university to get a copy of my "academic transcript" which was required for the points transfer. They had destroyed it during their merger with another university and the Open University had no other way for me to achieve the neccesary points transfer. It was quite a blow which was only exacerbated by the breakdown of a long term relationship which left me homeless for a few months. The following year I lost my dog, who was my best friend and constant companion, which finally caused a catastrophic degredation of my mental health. I had been living in a small countryside village and decided that if I stood a chance of getting a foot in the door of the tech industry I would have to move back to city life.</details>

      <details><summary>Can I get you another drink mate?</summary>
Bristol had been a favourite city for me since visiting a friend there back in the late 90s and it had a growing 'New Media' sector. I attended networking events and workshops when I first arrived but had to find work sharpish and, without the degree I had been working towards, I fell back into bar work. I found an independant craft beer pub that offered me a full time role and there I met some lovely people who taught me all about brewing and cellar work. My general passion for learning led me to train my pallette for beer tasting sessions along with learning the various terminology and techniques related to providing beer in perfect condition. I worked my way up to management roles and loved being part of a mad 'nightime economy'. I had always enjoyed cooking and experimenting with flavours and now that I had confidence that my pallette was very well tuned I started to dream up cocktails which used various infusions. The world of molecular gastronomy had started to overlap with what was known as Mixology and I discovered there was a whole world of science behind capturing flavours and producing new cocktails; I was hooked. I continued to dream about flavour combinations and learn various innovative techniques which led me to take a step back down from management so that I could work with cocktails and develop my skills.</details>

<details><summary>The end leads to the beginning - how lockdown led to playing with code again</summary>Throughout this period I had not found the time or opportunity to practise the skills which I had aquired through my OU experience and so, as with anything, it faded into the mists of memory. I found some great friends and took enormous pleasure from working with teams of interesting and hard working people but exhausting split shifts, ridiculously anti-social rotas, and dealing with abusive drunks was challenging. Then, out of the blue, a pandemic hit the planet. I decided I would try to concentrate some of my time on finding a way to produce installation art with computers. I ordered an Arduino development kit and set about understanding basic electronics and the C-derived language with which you could program the board. A lot of the structures and logic were still ingrained in my head but this language was so different to anything I had used before, it felt very low-level. Needing something to process the data from my prototypes and create a response I looked into using Processing first, with which I enjoyed tinkering, but I wanted to carry on learning the C family of languages as I had always been a bit afraid. That's when I discovered OpenFrameworks. I bought some books and followed various online learning resources to get my head around the basics of C++ and then went on to create a few projects which you can find on here. I really enjoyed it but imposter syndrome put pay to me pursuing it further. I returned to bar work as the country 'reopened' and was back to having very little free time to concentrate on much other than working to pay the bills. Instead I put my energies into helping to build, open, and run a small cocktail bar which offered the creative freedom I longed for, including developing a liquid Christmas Dinner menu. I was into my late 40s by this point and unfortunately I was physically and emotionally struggling, I had hit the 'Burnout' that is spoken of in hospitality circles, it was time for a drastic change.</details>

<details><summary>My career transition journey that led me 'up North'</summary>With my savings that I had managed to build from tips over the previous years I moved up to the Wirral to be with my long term friend and now wife. I embarked on treatment for the physical and mental challenges that have led me to this point and I applied for a few Skills for Life bootcamps as I was now unemployed. I was fortunately accepted onto one of these, developing with C# in Unity, so I threw myself into it. I immediately embarked on completing the learning pathways that Unity offers and found that I really enjoyed the visual feedback that it offers when coding (check out my <a onclick='window.SiteLinkManager.selectPage("Unity")'>Meteor Storm</a> project). Each time I came across a new concept or language construct I would try to implement it within my project, and at the same time refactor it so that I could make OOP concepts stick in my brain. I dedicated myself to excelling and went on to receive a gold accredication for my efforts. It was a real pleasure to be an active part of this community of people who, for various reasons, had found themselves in a similar position to myself. I also very much enjoyed attending a game jam that was organised for us during which, due mainly to me being the only one with a working knowledge of using GitHub, I played a team leader role alongside the coding. I went on to achieve the Unity Associate Programmer Certification but I realised being a non-gamer, and a bit older, was a hurdle to entry and it didn't lead anywhere sadly.</details>

<details><summary>Some cause for more self-reflection and renewed efforts</summary>As I mentioned at the top of this page, as winter came to a close in 2024 the illness that had dragged on through Christmas finally beat me. I was in a bad way and so attended A&E which led to me being hospitalised for treatment and investigations. In the small hours of the third day I was visited by a consultant who told me they were fairly sure that I had advanced lung cancer. I was knocked for six but was pleasantly suprised by the resolve I discovered within me, I wasn't ready to give up just yet. Thankfully after weeks of investigations it was found that my lung had actually just suffered extensive damage from a long bout of pneumonia, I could breath a sigh of relief (well, a couple of months later I could breath anyway :D). I had to find a way to make this experience a positive and so my wonderful partner and I decided to get married. It also led to some honest conversations with myself and I accepted that I was not the type of person to be involved in games development, but what can I do? I decided to get my film-making skills back up to speed (originally to document my journey through cancer treatment) and maybe I could teach and encourage young people who were just discovering the passion I had as a teenager. I taught myself non-linear editing, as I love to be learning, and ended up making a mockumentary for some friends (which turned out very nicely if I do say so myself). The other past skill and passion that I considered as a route to employment was to get back into web development...</details>
<p>...and so here I am, ready to dive back into web development as an older and wiser person than last time.</p>`,
    },
    {
      layoutNumber: 12,
      position: { row: 4, column: 1 },
      offset: { x: 20, y: 10 },
      size: { width: 80, height: 35 },
      sizeType: 'grow',
      type: 'title',
      src: `if you think I could be a good addition to your team then please do gimme a shout, I'm living on the Wirral and looking for my forever 'home' :D`,
    },
  ],
};
export default HomeContent;
