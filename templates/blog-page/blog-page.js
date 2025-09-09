import { buildBlock } from '../../scripts/aem.js';
import { div } from '../../scripts/dom-builder.js';

export default async function buildAutoBlocks() {
  const main = document.querySelector('main');
  const section = main.querySelector('div');
  // eslint-disable-next-line no-console
  console.log('Auto Blocking');
  section.classList.add('mb-8');
  const headerSection = div({ class: 'mb-10' });
  const titleBlock = buildBlock('title-card', { elems: [] });
  headerSection.append(titleBlock);
  main.insertBefore(headerSection, section);

  // ✅ Add blog-card block after the section
  const blogCardBlock = buildBlock('blog-card', { elems: [] });
  main.append(blogCardBlock);
}
