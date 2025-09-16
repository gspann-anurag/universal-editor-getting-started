// blocks/article/article.js
export default function decorate(block) {
  // Expect children: [Title, Author, Date, Body]
  const [titleEl, authorEl, dateEl, bodyEl] = block.children;

  // Create an <article> element to hold the content
  const article = document.createElement('article');

  // Title (as <h2>)
  const h2 = document.createElement('h2');
  h2.textContent = titleEl.textContent.trim();
  article.appendChild(h2);

  // Author and Date (as a single meta paragraph)
  const meta = document.createElement('p');
  meta.textContent = `By ${authorEl.textContent.trim()} on ${dateEl.textContent.trim()}`;
  article.appendChild(meta);

  // Body (inner HTML preserved, e.g. paragraphs)
  const body = document.createElement('div');
  // Copy the edited body HTML into our new container
  body.innerHTML = bodyEl.innerHTML;
  article.appendChild(body);

  // Replace the original block children with our constructed article
  block.replaceChildren(article);
}
