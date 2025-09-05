import { span } from '../../scripts/dom-builder.js';
import { decorateIcons } from '../../scripts/aem.js';

export default async function decorate(block) {
  const blockDiv = document.createElement('div');
  blockDiv.classList.add('button-wrapper');

  const pList = [...block.querySelectorAll('div > div > p')];
  const [, label, primaryTextP, , targetValueP, secondaryTextP, , targetValueS] = pList;

  const primaryButtonText = primaryTextP?.textContent.trim() || 'Download PDF';
  const secondaryButtonText = secondaryTextP?.textContent.trim();
  const targetValue = targetValueP?.textContent.trim() || '_blank';
  const targetValueSecondary = targetValueS?.textContent.trim() || '_blank';

  const anchors = [...block.querySelectorAll('a')];
  block.textContent = '';

  // Helper to build buttons wrapped in anchors
  const createButtonAnchor = (text, href, title, target, icon, className) => {
    const button = document.createElement('button');
    button.classList.add(className);
    button.appendChild(document.createTextNode(text));
    button.appendChild(span({ class: `icon icon-${icon}` }));

    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.title = title;
    anchor.target = target;
    anchor.rel = 'noopener noreferrer';
    anchor.classList.add('button-link');
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
      label.classList.add('button-label');
      blockDiv.appendChild(label);
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const primaryBtnAnchor = createButtonAnchor(
      primaryButtonText,
      anchors[0].href,
      anchors[0].title,
      targetValue,
      'arrow',
      'custom-button',
    );
    buttonContainer.appendChild(primaryBtnAnchor);

    // Secondary button (conditionally rendered)
    if (secondaryButtonText && secondaryButtonText.trim().length > 0 && anchors[1]) {
      const secondaryBtnAnchor = createButtonAnchor(
        secondaryButtonText.trim(),
        anchors[1].href,
        anchors[1].title,
        targetValueSecondary,
        'white-arrow',
        'secondary-custom-button',
      );
      buttonContainer.appendChild(secondaryBtnAnchor);
    }

    blockDiv.appendChild(buttonContainer);
  }

  block.append(blockDiv);
}
