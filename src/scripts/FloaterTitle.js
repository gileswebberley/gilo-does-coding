import Floater from './Floater';

class FloaterTitle extends Floater {
  // track the dimensions set by the layout manager when it calls setDimensions so that on reveal we always know what the target size will be for our new text sizing functionality
  #latestTargetWidth = 0;
  #latestTargetHeight = 0;

  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('h1');
    this.contentHolder.classList.add('content-title');
    // as I am writing long strings which include forward slashes we can add in a 'soft word-break' element after them. However, we also have <a> tags inside those strings and we don't want to break them by adding <wbr> eg http:/<wbr>/<wbr> etc
    if (
      typeof this.src === 'string' &&
      (this.src.includes('<a') || this.src.includes('/'))
    ) {
      // 1. Create a safe offscreen fragment container to parse the markup safely
      // The <template> element is a specialized HTML tag specifically engineered to hold raw HTML markup without actually rendering it on the screen. It acts as an offscreen blueprint.
      //To run your link-safe injectWbrToTextNodes loop, you first need to convert that flat this.src text string into live, interactable JavaScript node objects. That is exactly what the template element achieves, a "safe offscreen sandbox tree".
      const template = document.createElement('template');
      template.innerHTML = this.src;
      //When you read template.content, it doesn't return standard HTML. It returns a specialized object called a DocumentFragment. These do not have a parent and so live outside the webpage structure meaning changes to to their children do not trigger a screen paint. Once these fragments are appended they "pour" their pre-formatted child nodes into the container that they are appended and then "vanish" from memory. If you hear about Web Components then you will likely come across these used alongside the ShadowDOM
      const fragment = template.content;

      // 2. Traversal function: Walk exclusively through the raw text nodes
      const injectWbrToTextNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          // If it's a literal text block, it's safe to process slashes
          if (node.nodeValue.includes('/')) {
            const spanWrapper = document.createElement('span');
            // Safely swap the slash with the slash + break-opportunity tag
            spanWrapper.innerHTML = node.nodeValue.replace(/\//g, '/<wbr>');
            node.parentNode.replaceChild(spanWrapper, node);
          }
        } else {
          // If it's an element (like an <a> tag), walk into its children
          // without touching its raw outer attributes (like href="...")
          for (let child of Array.from(node.childNodes)) {
            injectWbrToTextNodes(child);
          }
        }
      };

      // 3. Process the nodes and append them safely
      injectWbrToTextNodes(fragment);
      this.contentHolder.appendChild(fragment);
    } else {
      // Fallback for clean unformatted entries
      this.contentHolder.innerHTML = this.src;
    }
    this.appendChildToElement(this.contentHolder);
  }

  // Override setDimensions to capture when the box layout mutates
  setDimensions(width, height) {
    super.setDimensions(width, height);
    //track the sizes that have been assigned by this function for use in the reveal logic
    this.#latestTargetWidth = parseFloat(width);
    this.#latestTargetHeight = parseFloat(height);

    // Wait until the layout manager releases its temporary 100% height
    requestAnimationFrame(() => {
      // we're running into sync issues so let's wait two frames and see how that works
      requestAnimationFrame(() => {
        this.#fitTextToContainer(
          this.#latestTargetWidth,
          this.#latestTargetHeight,
        );
      });
    });
  }

  // Override reveal to ensure text size updates when transitioning out of floating state
  reveal() {
    super.reveal();
    if (this.#latestTargetWidth && this.#latestTargetHeight) {
      this.#fitTextToContainer(
        this.#latestTargetWidth,
        this.#latestTargetHeight,
      );
    }
  }

  //with a lot of help from gemini this function creates an offscreen canvas that works out the largest font possible for the length of the string vs the size of the container. By means of noting our learnings here's the final sign-off paragraph from Gemini
  //The Canvas-driven approach is a fantastic tool to keep in your back pocket. Whenever you find yourself battling a browser layout engine that is aggressively caching values, dropping frame updates, or thrashing the CPU mid-transition, shifting those checks into a completely off-screen, data-driven vector space like Canvas will save you every single time. It treats text like raw coordinates rather than a messy, slow DOM tree.
  #fitTextToContainer(targetWidth, targetHeight) {
    if (!this.contentHolder || !targetWidth || !targetHeight) return;

    const minFont = 10; // 1rem minimum safety gate
    const maxFont = 44; // 4.4rem maximum limit
    const visualPadding = 12; // Internal padding safety clearance

    const maxAllowedWidth = targetWidth - visualPadding * 2;
    const maxAllowedHeight = targetHeight - visualPadding * 2;

    // Extract raw characters, stripping active link markup tags safely by using textContent rather than the HTML string itself
    const rawTextString = this.contentHolder.textContent || '';

    // Fetch typography parameters from your stylesheet
    const computedStyle = getComputedStyle(this.contentHolder);
    // I don't like the line-height being hard-coded as 1.2 so let's get that information here too
    const rawLineHeight = computedStyle.lineHeight; //can be "normal", a pixel value, a raw value (like 1.2), or a percentage. Interesting to discover though, percentages and values like rem etc are calculated into explicit pixel values by the browser so no need to worry about those cases in here
    // set a line-height multiplier for use in the while loop
    const currentFontSize = parseFloat(computedStyle.fontSize);
    let unitlessHeightMultiplier = 1.2; //same as setting line-height to "normal"
    if (rawLineHeight.includes('px')) {
      // If the browser hands you "24px", turn it into a fluid ratio (e.g., 24 / 16 = 1.5)
      unitlessHeightMultiplier = parseFloat(rawLineHeight) / currentFontSize;
    } else if (!isNaN(parseFloat(rawLineHeight))) {
      // If it's already a raw unitless multiplier (e.g., 1.2), use it directly
      unitlessHeightMultiplier = parseFloat(rawLineHeight);
    }

    const fontFamily = computedStyle.fontFamily || 'sans-serif';
    const fontWeight = computedStyle.fontWeight || '400';

    // Setup offscreen canvas utility
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // If the box is short and wide, it can only support 1 or 2 lines of text.
    // If the box is tall or square, it can support up to 3 lines cleanly.
    let maxLinesAllowed = 2;
    if (targetHeight / targetWidth > 1.2) {
      maxLinesAllowed = 3; // Tall boxes get extra lines
    } else if (targetHeight < 60) {
      maxLinesAllowed = 1; // Ultra-short banners are locked to a single line
    }

    //RUN DETERMINISTIC STEP-DOWN LOOP
    let optimalFontSize = maxFont;

    while (optimalFontSize > minFont) {
      // to use the measureText function you must define the style first
      ctx.font = `${fontWeight} ${optimalFontSize}px ${fontFamily}`;

      // Calculate single continuous text width metrics
      //Unlike DOM properties like offsetWidth or scrollWidth (which tell you the size of the HTML element wrapper box), measureText() asks the operating system's underlying font rendering engine to calculate the exact vector physics of the text characters themselves, right down to the sub-pixel level.
      // It executes instantly in memory, completely bypassing the browser’s slow rendering and painting queue.
      const textMetrics = ctx.measureText(rawTextString);
      // the original typographical metrics available from measureText, although you can now access the height as well by adding together actualBoundingBoxAscent and actualBoundingBoxDescent (the top of an H and bottom of a j for example)
      const totalSingleLineWidth = textMetrics.width;

      // Determine how many lines this font size forces the string to wrap into
      const linesNeeded = Math.ceil(totalSingleLineWidth / maxAllowedWidth);

      // Compute vertical box accumulation matching line-height: 1.2
      // const totalBlockHeight = linesNeeded * (optimalFontSize * 1.2);
      //dynamic line height based on the multiplier worked out outside the loop
      const totalBlockHeight =
        linesNeeded * (optimalFontSize * unitlessHeightMultiplier);

      // Does it stay under the width OR wrap comfortably under the line cap limit?
      if (totalSingleLineWidth <= maxAllowedWidth) {
        // Fits beautifully on 1 line
        break;
      } else if (
        linesNeeded <= maxLinesAllowed &&
        totalBlockHeight <= maxAllowedHeight
      ) {
        // Wraps cleanly, and doesn't break your line cap or push fit-content bounds
        break;
      }

      // If it breaks constraints, step down 1px and evaluate again
      optimalFontSize--;
    }

    // Write the perfect size onto the element in a single step
    this.contentHolder.style.fontSize = `${optimalFontSize}px`;
  }
}

export default FloaterTitle;
