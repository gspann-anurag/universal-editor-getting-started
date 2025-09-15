export default function decorate(block) {
  const [quoteWrapper] = block.children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();
  blockquote.classList.add('bg-blue-550', 'text-white', 'px-4', 'py-2', 'min-h-[300px]');
  quoteWrapper.replaceChildren(blockquote);
}
