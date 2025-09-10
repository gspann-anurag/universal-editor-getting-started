import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Cards block with meta tag support (Option A: hidden meta card, Option B: data-* attributes)
 *
 * Authoring:
 *  - Option A: add a Card whose text contains key: value lines inside a hidden <pre class="meta-source"> or plain text at top.
 *    Example inside a card:
 *      <pre class="meta-source" style="display:none">
 *      author: Anurag
 *      category: Product
 *      publishDate: 2025-09-10
 *      tags: launch,product
 *      description: Short summary for the page.
 *      </pre>
 *
 *  - Option B: set data attributes on the block container in UE:
 *      <div class="cards" data-author="Anurag" data-category="Product" data-tags="launch,product">...</div>
 *
 * The decorator will:
 *  - parse meta from meta-source or data-* attrs
 *  - inject/update <meta> tags in head (author, category, publishDate, tags, description)
 *  - keep original cards behavior intact
 */

function parseKeyValues(text) {
  return (text || '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .reduce((acc, line) => {
      const m = line.match(/^([^:=]+)\s*[:=]\s*(.*)$/);
      if (m) {
        acc[m[1].trim()] = m[2].trim();
      }
      return acc;
    }, {});
}

function ensureMeta(name, content) {
  if (!content && content !== 0) return;
  const sel = `head > meta[name="${CSS.escape(name)}"]`;
  let m = document.head.querySelector(sel);
  if (!m) {
    m = document.createElement('meta');
    m.setAttribute('name', name);
    document.head.appendChild(m);
  }
  m.setAttribute('content', String(content));
}

function ensureLinkCanonical(href) {
  if (!href) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

export default function decorate(block) {
  /* --- META extraction + injection --- */
  // 1) data-* attributes (highest priority)
  const dataMeta = {};
  Array.from(block.attributes || []).forEach((attr) => {
    if (attr.name && attr.name.startsWith('data-')) {
      const k = attr.name.slice(5); // remove data-
      dataMeta[k] = attr.value;
    }
  });

  // 2) hidden meta-source inside a card (scan first elements for a .meta-source pre)
  let metaText = '';
  const metaPre = block.querySelector('.meta-source');
  if (metaPre) metaText = metaPre.textContent || metaPre.innerText || '';

  // 3) fallback: if first child text looks like key:value lines, use that
  if (!metaText) {
    const firstText = block.textContent ? block.textContent.trim().split('\n').slice(0, 10).join('\n') : '';
    const looksLikeKV = /^([^:=]+)\s*[:=]\s*.+/m.test(firstText);
    if (looksLikeKV) metaText = firstText;
  }

  const metaFromText = parseKeyValues(metaText);
  // merge: data attrs override text
  const meta = Object.assign({}, metaFromText, dataMeta);

  // normalize keys (simple)
  const normalize = (k) => k.replace(/\s+/g, '').replace(/[-_]/g, '').toLowerCase();

  const normMeta = {};
  Object.keys(meta).forEach((k) => {
    normMeta[normalize(k)] = meta[k];
  });

  // inject meta tags
  ensureMeta('description', normMeta.description || normMeta.summary || normMeta.desc);
  ensureMeta('author', normMeta.author);
  ensureMeta('category', normMeta.category);
  ensureMeta('publishDate', normMeta.publishdate || normMeta['publish-date']);
  ensureMeta('readingTime', normMeta.readingtime);
  if (normMeta.tags) {
    ensureMeta('cq-tags', normMeta.tags);
    ensureMeta('tags', normMeta.tags);
  }
  if (normMeta.canonical) ensureLinkCanonical(normMeta.canonical);
  else {
    // ensure canonical exists - set to current URL if none present
    if (!document.head.querySelector('link[rel="canonical"]')) {
      ensureLinkCanonical(window.location.href);
    }
  }

  /* --- ORIGINAL CARDS BEHAVIOR (keeps your existing logic) --- */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Hide meta-source node from visual output (optional)
  if (metaPre) metaPre.style.display = 'none';
}
