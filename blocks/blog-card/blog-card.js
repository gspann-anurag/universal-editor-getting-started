import {
  div, a, img, p, h2,
} from '../../scripts/dom-builder.js';

export default function decorate(block) {
// eslint-disable-next-line no-console
  console.log('Decorating blog-card');
  const blogs = [
    {
      title: 'Understanding Chromatography Basics',
      desc: 'A beginner’s guide to chromatography techniques, applications, and advancements.',
      link: '#',
      img: 'https://phxsitecoreprod10-420120-cm.azurewebsites.net/-/media/phxjss/data/media/images/blogs/industry-blogs/pfas/wordpress-header-45.webp',
    },
    {
      title: 'The Future of Lab Automation',
      desc: 'Exploring how AI and robotics are transforming modern laboratories.',
      link: '#',
      img: 'https://phxsitecoreprod10-420120-cm.azurewebsites.net/-/media/phxjss/data/media/images/blogs/industry-blogs/pfas/wordpress-header-45.webp',
    },
    {
      title: 'Tips for Better Sample Preparation',
      desc: 'Best practices and expert recommendations for efficient sample prep.',
      link: '#',
      img: 'https://phxsitecoreprod10-420120-cm.azurewebsites.net/-/media/phxjss/data/media/images/blogs/industry-blogs/pfas/wordpress-header-45.webp',
    },
  ];

  block.innerHTML = '';
  const container = div({ class: 'grid grid-cols-1 md:grid-cols-3 gap-6' });

  blogs.forEach((blog) => {
    const card = div({ class: 'bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300' }, [
      img({ src: blog.img, alt: blog.title, class: 'w-full h-48 object-cover' }),
      div({ class: 'p-4' }, [
        h2({ class: 'text-lg font-bold mb-2' }, blog.title),
        p({ class: 'text-gray-600 mb-4' }, blog.desc),
        a({ href: blog.link, class: 'text-blue-600 font-medium hover:underline' }, 'Read More →'),
      ]),
    ]);
    container.append(card);
  });

  block.append(container);
}
