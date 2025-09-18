// blocks/article/article.js
// decorate() for single Article card — title + meta, body hidden with a ...more toggle.

// Helper: build the "By Author on DATE" meta string.
// Declared before usage so lint/no-use-before-define won't complain.
function buildMeta(author, date) {
  author = (author && String(author).trim()) || '';
  date = (date && String(date).trim()) || '';
  if (author && date) return `By ${author} on ${date}`;
  if (author) return `By ${author}`;
  if (date) return `Published on ${date}`;
  return '';
}

export default function decorate(block) {
  // Mark the container so container-level code can identify this element
  block.classList.add('article-card');

  // Defensive: read children safely
  const [titleEl, authorEl, dateEl, bodyEl] = Array.from(block.children);

  // Title
  const h2 = document.createElement('h2');
  h2.className = 'article-title';
  h2.textContent = titleEl?.textContent?.trim() || 'Untitled';

  // Meta line (author + date)
  const meta = document.createElement('div');
  meta.className = 'article-meta';
  meta.textContent = buildMeta(authorEl?.textContent, dateEl?.textContent);

  // Body (preserve HTML), hidden by default
  const body = document.createElement('div');
  body.className = 'article-body';
  body.innerHTML = bodyEl?.innerHTML || '';
  body.setAttribute('aria-hidden', 'true');

  // Toggle button (only if body has content)
  let toggle;
  if (body.innerHTML.trim()) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'article-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '...more';

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
  }

  // Replace original children with our structured markup
  // Keep order: title, meta, body, toggle
  block.replaceChildren(h2, meta, body);
  if (toggle) block.appendChild(toggle);
}
