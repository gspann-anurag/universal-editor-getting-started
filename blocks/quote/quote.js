// blocks/quote/quote.js
export default function decorate(block) {
  // assume first child contains the authored text
  const quoteWrapper = block.children[0];
  if (!quoteWrapper) return;

  // create blockquote element and transfer trimmed text content
  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent ? quoteWrapper.textContent.trim() : '';

  // replace children of wrapper with the blockquote element
  quoteWrapper.replaceChildren(blockquote);
}
