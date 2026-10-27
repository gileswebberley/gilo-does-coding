import Floater from './Floater';

class FloaterTitle extends Floater {
  constructor(src, ...rest) {
    super(...rest);
    this.src = src;
    //Add an element to hold the content so it can have it's visibilty toggled in float() and reveal()
    this.contentHolder = document.createElement('h1');
    this.contentHolder.classList.add('content-title');
    if (
      typeof this.src === 'string' &&
      (this.src.includes('<a') || this.src.includes('/'))
    ) {
      // 1. Create a safe offscreen fragment container to parse the markup safely
      const template = document.createElement('template');
      template.innerHTML = this.src;
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
    //Run the text fitting immediately using the raw pixel metrics passed in
    // this.#fitTextToContainer(parseFloat(width), parseFloat(height));
    // Wait until the layout manager releases its temporary 100% height
    // lock and the browser paint queue reads the real element dimensions.
    requestAnimationFrame(() => {
      // we're running into sync issues so let's wait two frames and see how that works
      requestAnimationFrame(() => {
        this.#fitTextToContainer(parseFloat(width), parseFloat(height));
      });
      // const parent = this.contentHolder?.parentElement;
      // if (parent) {
      //   this.#fitTextToContainer(parent.offsetWidth, parent.offsetHeight);
      // }
    });
  }

  // Override reveal to ensure text size updates when transitioning out of floating state
  reveal() {
    super.reveal();
    requestAnimationFrame(() => {
      const parent = this.contentHolder?.parentElement;
      if (parent) {
        this.#fitTextToContainer(parent.offsetWidth, parent.offsetHeight);
      }
    });
  }

  // // Private text fitting layout algorithm
  #fitTextToContainer(targetWidth, targetHeight) {
    if (!this.contentHolder || !targetWidth || !targetHeight) return;

    let minFont = 10;
    let maxFont = 44;
    let perfectFont = minFont;

    const visualPadding = 5;
    const maxAllowedWidth = targetWidth - visualPadding * 2;
    const maxAllowedHeight = targetHeight - visualPadding * 2;

    // --- FIX STEP 1: Lock the container dimensions strictly to the target box size ---
    // This forces the balanced text wrapping engine to break lines using the exact
    // boundaries of the current screen frame, preventing large screen leaks.
    this.contentHolder.style.width = `${maxAllowedWidth}px`;
    this.contentHolder.style.maxWidth = `${maxAllowedWidth}px`;

    // Fast binary calculation loop
    while (minFont <= maxFont) {
      let mid = Math.floor((minFont + maxFont) / 2);
      this.contentHolder.style.fontSize = `${mid}px`;

      // --- FIX STEP 2: Use offsetWidth/Height to fetch clean, local layout metrics ---
      // This forces the engine to bypass the cached scroll tree state.
      const textWidth = this.contentHolder.offsetWidth;
      const textHeight = this.contentHolder.offsetHeight;

      if (textWidth <= maxAllowedWidth && textHeight <= maxAllowedHeight) {
        perfectFont = mid;
        minFont = mid + 1;
      } else {
        maxFont = mid - 1;
      }
    }

    // --- FIX STEP 3: Clean up and restore fluid layouts ---
    // Revert styling parameters so your CSS can maintain natural page flow rules
    this.contentHolder.style.width = '100%';
    this.contentHolder.style.maxWidth = 'none';

    // Apply the verified layout font size target
    this.contentHolder.style.fontSize = `${perfectFont}px`;
  }
  // fix for resize mistakes --
  // #fitTextToContainer(targetWidth, targetHeight) {
  //   if (!this.contentHolder || !targetWidth || !targetHeight) return;

  //   let minFont = 10; // Equivalent to 1rem
  //   let maxFont = 44; // Equivalent to 4.4rem
  //   let perfectFont = minFont;

  //   const visualPadding = 5;
  //   const maxAllowedWidth = targetWidth - visualPadding * 2;
  //   const maxAllowedHeight = targetHeight - visualPadding * 2;

  //   // --- FIX: Create an isolated measurement clone outside the DOM layout tree ---
  //   // This completely prevents floaters from breaking each other's measurements during loops
  //   const sandboxNode = this.contentHolder.cloneNode(true);
  //   sandboxNode.style.position = 'absolute';
  //   sandboxNode.style.visibility = 'hidden';
  //   sandboxNode.style.top = '-9999px';
  //   sandboxNode.style.left = '-9999px';
  //   sandboxNode.style.width = `${maxAllowedWidth}px`;
  //   sandboxNode.style.maxWidth = `${maxAllowedWidth}px`;

  //   // Copy computed styling attributes to ensure text-wrapping matches perfectly
  //   sandboxNode.style.fontFamily = getComputedStyle(
  //     this.contentHolder,
  //   ).fontFamily;
  //   sandboxNode.style.fontWeight = getComputedStyle(
  //     this.contentHolder,
  //   ).fontWeight;
  //   sandboxNode.style.lineHeight = getComputedStyle(
  //     this.contentHolder,
  //   ).lineHeight;
  //   sandboxNode.style.textAlign = getComputedStyle(
  //     this.contentHolder,
  //   ).textAlign;

  //   document.body.appendChild(sandboxNode);

  //   // Fast binary calculation loop against the clean sandbox node
  //   while (minFont <= maxFont) {
  //     let mid = Math.floor((minFont + maxFont) / 2);
  //     sandboxNode.style.fontSize = `${mid}px`;

  //     // Measure the text's local bounds completely un-impacted by other floaters or parent transitions
  //     const textWidth = sandboxNode.offsetWidth;
  //     const textHeight = sandboxNode.offsetHeight;

  //     if (textWidth <= maxAllowedWidth && textHeight <= maxAllowedHeight) {
  //       perfectFont = mid;
  //       minFont = mid + 1; // It fits! Try to scale it up larger
  //     } else {
  //       maxFont = mid - 1; // Overflowing the padded space! Shrink the boundary
  //     }
  //   }

  //   // Clean up the DOM sandbox node instantly
  //   document.body.removeChild(sandboxNode);

  //   // Lock in the absolute largest possible safe font size choice on the real element
  //   this.contentHolder.style.fontSize = `${perfectFont}px`;
  // }
}

export default FloaterTitle;
