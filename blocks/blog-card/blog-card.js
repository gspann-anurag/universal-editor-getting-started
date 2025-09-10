import {
  div, a, img, p, h2,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
  // eslint-disable-next-line no-console
  console.log('Decorating blog-card');

  const blogs = [...block.children].map((row) => {
    const cells = [...row.children];
    return {
      img: cells[0]?.querySelector('img')?.src || '',
      imageAlt: cells[0]?.querySelector('img')?.alt || '',
      title: cells[1]?.textContent.trim() || '',
      desc: cells[2]?.textContent.trim() || '',
      link: cells[3]?.querySelector('a')?.href || '#',
    };
  });

  block.innerHTML = '';
  const container = div(
    { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
    ...blogs.map((blog) => div(
      { class: 'bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300' },
      img({ src: blog.img, alt: blog.imageAlt, class: 'w-full h-48 object-cover' }),
      div(
        { class: 'p-4' },
        h2({ class: 'text-lg font-bold mb-2' }, blog.title),
        p({ class: 'text-gray-600 mb-4' }, blog.desc),
        a({ href: blog.link, class: 'text-blue-600 font-medium hover:underline' }, 'Read More →'),
      ),
    )),
  );

  block.append(container);
}
