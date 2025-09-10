import {
  div, a, img, p, h2,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
// eslint-disable-next-line no-console
  console.log('Decorating blog-card');

  const rows = [...block.children];
  block.innerHTML = '';

  const container = div({ class: 'grid grid-cols-1 md:grid-cols-3 gap-6' });

  rows.forEach((row) => {
    const cells = [...row.children];

    const image = cells[0]?.querySelector('img')?.src || '';
    const imageAlt = cells[1]?.textContent || '';
    const desc = cells[2]?.textContent || '';
    const title = cells[3]?.textContent || '';
    const link = cells[4]?.querySelector('a')?.href || '#';

    const card = div(
      { class: 'bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300' },
      [
        img({ src: image, alt: imageAlt, class: 'w-full h-48 object-cover' }),
        div({ class: 'p-4' }, [
          h2({ class: 'text-lg font-bold mb-2' }, title),
          p({ class: 'text-gray-600 mb-4' }, desc),
          a({ href: link, class: 'text-blue-600 font-medium hover:underline' }, 'Read More →'),
        ]),
      ],
    );

    container.append(card);
  });

  block.append(container);
}
