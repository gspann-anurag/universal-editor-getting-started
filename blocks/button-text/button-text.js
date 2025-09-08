import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  blockDiv.className = 'mt-[20px] mb-[30px]';

  const pList = [...block.querySelectorAll('div > div > p')];
  const [, label, primaryTextP, , targetValueP, secondaryTextP, , targetValueS] = pList;

  const primaryButtonText = primaryTextP?.textContent.trim() || 'Download PDF';
  const secondaryButtonText = secondaryTextP?.textContent.trim();
  const targetValue = targetValueP?.textContent.trim() || '_blank';
  const targetValueSecondary = targetValueS?.textContent.trim() || '_blank';

  const anchors = [...block.querySelectorAll('a')];
  block.textContent = '';

  // Helper to build buttons wrapped in anchors
  const createButtonAnchor = (text, href, title, target, icon, isPrimary = true) => {
    const button = document.createElement('button');

    const baseClasses = [
      'text-[16px]',
      'px-[24px]',
      'py-[12px]',
      'rounded-[5px]',
      'cursor-pointer',
      'flex',
      'items-center',
      'transition-all',
      'duration-200',
    ];

    if (isPrimary) {
      button.className = [
        'bg-[#0068FA]',
        'text-white',
        'hover:bg-[#0056b3]',
        'font-light',
        ...baseClasses,
      ].join(' ');
    } else {
      button.className = [
        'bg-white',
        'text-black',
        'border',
        'border-[#0068FA]',
        'hover:bg-white',
        'hover:no-underline',
        'font-[350]',
        ...baseClasses,
      ].join(' ');
    }

    button.appendChild(document.createTextNode(text));

    const iconSpan = span({
      class: 'pl-[15px] transition-transform duration-200',
    });

    const iconInner = span({
      class: `icon icon-${icon} ${isPrimary ? 'group-hover:translate-x-[5px]' : ''}`,
    });

    iconSpan.appendChild(iconInner);
    button.appendChild(iconSpan);

    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.title = title;
    anchor.target = target;
    anchor.rel = 'noopener noreferrer';
    anchor.className = 'no-underline group';
    anchor.appendChild(button);

    button.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(href, target);
    });

    decorateIcons(anchor);
    return anchor;
  };

  if (anchors.length >= 1) {
    if (label) {
      label.className = 'text-4xl font-bold text-blue-500';
      blockDiv.appendChild(label);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex gap-[12px]';

    const primaryBtnAnchor = createButtonAnchor(
      primaryButtonText,
      anchors[0].href,
      anchors[0].title,
      targetValue,
      'arrow',
      true,
    );
    buttonContainer.appendChild(primaryBtnAnchor);

    if (secondaryButtonText && secondaryButtonText.trim().length > 0 && anchors[1]) {
      const secondaryBtnAnchor = createButtonAnchor(
        secondaryButtonText.trim(),
        anchors[1].href,
        anchors[1].title,
        targetValueSecondary,
        'white-arrow',
        false,
      );
      buttonContainer.appendChild(secondaryBtnAnchor);
    }

    blockDiv.appendChild(buttonContainer);
  }

  block.append(blockDiv);
}
