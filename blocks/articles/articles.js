// blocks/articles/articles.js
export default function decorate(block) {
  // Add a wrapper class for styling
  block.classList.add('articles-container');

  // Each direct child <div> inside the block is an article card
  const articleEls = [...block.children];

  articleEls.forEach((el) => {
    el.classList.add('article-card');

    // Grab fields (assuming child divs: title, author/date, body)
    const [titleEl, authorEl, dateEl, bodyEl] = el.children;

    // Title
    const h2 = document.createElement('h2');
    h2.className = 'article-title';
    h2.textContent = titleEl?.textContent?.trim() || 'Untitled';

    // Meta
    const meta = document.createElement('div');
    meta.className = 'article-meta';
    meta.textContent = buildMeta(authorEl?.textContent, dateEl?.textContent);

    // Body
    const body = document.createElement('div');
    body.className = 'article-body';
    body.innerHTML = bodyEl?.innerHTML || '';
    body.setAttribute('aria-hidden', 'true');

    // Toggle
    if (body.innerHTML.trim()) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'article-toggle';
      toggle.textContent = '...more';
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (expanded) {
          body.classList.remove('expanded');
          body.setAttribute('aria-hidden', 'true');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.textContent = '...more';
        } else {
          body.classList.add('expanded');
          body.setAttribute('aria-hidden', 'false');
          toggle.setAttribute('aria-expanded', 'true');
          toggle.textContent = '...less';
        }
      });

      el.replaceChildren(h2, meta, body, toggle);
    } else {
      el.replaceChildren(h2, meta);
    }
  });
}

function buildMeta(author, date) {
  author = author?.trim() || '';
  date = date?.trim() || '';
  if (author && date) return `By ${author} on ${date}`;
  if (author) return `By ${author}`;
  if (date) return `Published on ${date}`;
  return '';
}
