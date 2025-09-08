// templates/blog-page/blog-page.js
export default function decorate(block) {
  // Expecting author to add content in a table-like structure via UE:
  // Row 1: Image
  // Row 2: Title (link optional)
  // Row 3: Date
  // Row 4: Category
  // Row 5: Excerpt
  // Row 6: Read More link

  const rows = [...block.children];
  block.classList.add('blog-page', 'p-4', 'rounded-lg', 'shadow-sm', 'bg-white');

  // Extract content from rows (Universal Editor outputs rows as <div>)
  const imageRow = rows[0]?.querySelector('img');
  const titleRow = rows[1]?.textContent?.trim();
  const dateRow = rows[2]?.textContent?.trim();
  const categoryRow = rows[3]?.textContent?.trim();
  const excerptRow = rows[4]?.textContent?.trim();
  const linkRow = rows[5]?.querySelector('a');

  // Clear existing content
  block.innerHTML = '';
  // Build new structure
  if (imageRow) {
    imageRow.classList.add('w-full', 'h-40', 'object-cover', 'rounded');
    block.append(imageRow);
  }

  const content = document.createElement('div');
  content.className = 'mt-3';

  if (titleRow) {
    const h3 = document.createElement('h3');
    h3.className = 'text-lg font-semibold leading-snug';
    if (linkRow) {
      linkRow.textContent = titleRow;
      linkRow.className = 'hover:underline';
      h3.append(linkRow);
    } else {
      h3.textContent = titleRow;
    }
    content.append(h3);
  }

  if (dateRow || categoryRow) {
    const meta = document.createElement('div');
    meta.className = 'text-sm text-gray-500 mt-1';
    meta.textContent = `${dateRow || ''}${dateRow && categoryRow ? ' • ' : ''}${categoryRow || ''}`;
    content.append(meta);
  }

  if (excerptRow) {
    const p = document.createElement('p');
    p.className = 'mt-2 text-base';
    p.textContent = excerptRow;
    content.append(p);
  }

  if (linkRow) {
    const more = document.createElement('a');
    more.href = linkRow.href;
    more.textContent = 'Read more →';
    more.className = 'inline-block mt-3 text-sm text-blue-600 hover:underline';
    content.append(more);
  }
  // eslint-disable-next-line no-console
  console.log('debugging...');

  block.append(content);
}
