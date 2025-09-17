// blocks/article/article.js
// decorate() implementation — shows title + meta and hides body until user clicks "...more"
export default function decorate(block) {
  // Expect children: [Title, Author, Date, Body]
  const [titleEl, authorEl, dateEl, bodyEl] = block.children;

  // Create container elements
  const article = document.createElement('article');
  article.className = 'block article ue-article-block';

  // Title
  const h2 = document.createElement('h2');
  h2.className = 'ue-article-title';
  h2.textContent = (titleEl && titleEl.textContent) ? titleEl.textContent.trim() : 'Untitled';
  article.appendChild(h2);

  // Meta (Author + Date)
  const meta = document.createElement('div');
  meta.className = 'ue-article-meta';
  const authorText = (authorEl && authorEl.textContent) ? authorEl.textContent.trim() : '';
  const dateText = (dateEl && dateEl.textContent) ? dateEl.textContent.trim() : '';
  meta.textContent = buildMeta(authorText, dateText);
  article.appendChild(meta);

  // Body (hidden by default)
  const body = document.createElement('div');
  body.className = 'ue-article-body';
  // Copy inner HTML so richtext formatting is preserved
  body.innerHTML = (bodyEl && bodyEl.innerHTML) ? bodyEl.innerHTML : '';
  // Ensure initially hidden (CSS will also hide, but set attribute for non-flash)
  body.setAttribute('aria-hidden', 'true');
  article.appendChild(body);

  // If there's body content, add toggle control
  if (body.innerHTML.trim()) {
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'ue-article-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = '...more';

    // Toggle handler
    toggle.addEventListener('click', (e) => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        // collapse
        body.classList.remove('expanded');
        body.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '...more';
        // Move focus back to toggle for accessibility (optional)
        toggle.focus();
      } else {
        // expand
        body.classList.add('expanded');
        body.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = '...less';
        // Optionally scroll body into view
        // body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Put toggle after the meta line
    article.appendChild(toggle);
  }

  // Replace original block children with constructed article
  block.replaceChildren(article);
}

// helper to build meta text
function buildMeta(author, date) {
  if (author && date) return `By ${author} on ${date}`;
  if (author) return `By ${author}`;
  if (date) return `Published on ${date}`;
  return '';
}
