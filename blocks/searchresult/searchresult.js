const ATOMIC_CSS_URL = 'https://static.cloud.coveo.com/atomic/v2/themes/coveo.css';
const ATOMIC_JS_URL = 'https://static.cloud.coveo.com/atomic/v2/atomic.esm.js';

/**
 * Load Atomic CSS and JS only once, and run callback after JS is ready
 */
function loadAtomicResources(callback) {
  // Load CSS
  if (!document.querySelector(`link[href="${ATOMIC_CSS_URL}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = ATOMIC_CSS_URL;
    document.head.appendChild(link);
  }

  // Load JS
  const existingScript = document.querySelector(`script[src="${ATOMIC_JS_URL}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = ATOMIC_JS_URL;
    script.onload = () => callback();
    script.onerror = () => {
      console.error('Failed to load Atomic JS library.');
      callback(false); // Let the caller handle fallback
    };
    document.head.appendChild(script);
  } else if (customElements.get('atomic-search-interface')) {
    callback(); // Already loaded
  } else {
    existingScript.addEventListener('load', () => callback());
  }
}

/**
 * Builds the Coveo Atomic Search UI
 */
function buildAtomicSearchUI() {
  const searchInterface = document.createElement('atomic-search-interface');
  searchInterface.id = 'search-interface';

  const layout = document.createElement('atomic-search-layout');

  // Search box section
  const searchBoxSection = document.createElement('atomic-layout-section');
  searchBoxSection.setAttribute('section', 'search');
  const searchBox = document.createElement('atomic-search-box');
  searchBoxSection.appendChild(searchBox);

  // Facets section
  const facetsSection = document.createElement('atomic-layout-section');
  facetsSection.setAttribute('section', 'facets');
  const facetManager = document.createElement('atomic-facet-manager');

  const facet1 = document.createElement('atomic-facet');
  facet1.setAttribute('field', 'source');
  facet1.setAttribute('label', 'Source');

  const facet2 = document.createElement('atomic-facet');
  facet2.setAttribute('field', 'language');
  facet2.setAttribute('label', 'Language');

  facetManager.append(facet1, facet2);
  facetsSection.appendChild(facetManager);

  // Results section
  const resultsSection = document.createElement('atomic-layout-section');
  resultsSection.setAttribute('section', 'results');
  const resultList = document.createElement('atomic-result-list');
  resultsSection.appendChild(resultList);

  layout.append(searchBoxSection, facetsSection, resultsSection);
  searchInterface.appendChild(layout);

  return searchInterface;
}

/**
 * Initializes the Atomic Search Interface with required credentials
 */
async function initializeAtomicSearch() {
  try {
    await customElements.whenDefined('atomic-search-interface');
    const searchInterface = document.querySelector('#search-interface');

    if (!searchInterface) {
      console.error('Atomic search interface not found in DOM.');
      return;
    }

    await searchInterface.initialize({
      accessToken: 'xxca9398dc-2af2-4d92-aaa6-62b8f55efc57', // ✅ Replace with actual Coveo access token
      organizationId: 'danahernonproduction1892f3fhz', // ✅ Replace with your Coveo org ID
      platformUrl: 'https://platform.cloud.coveo.com',
    });

    searchInterface.executeFirstSearch();
  } catch (error) {
    console.error('Failed to initialize Atomic search:', error);
  }
}

/**
 * Main block decorator
 */
export default async function decorate(block) {
  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'mt-[20px] mb-[30px]';

  loadAtomicResources((loaded = true) => {
    if (!loaded) {
      block.textContent = 'Search interface failed to load.';
      return;
    }

    customElements.whenDefined('atomic-search-interface').then(() => {
      const searchUI = buildAtomicSearchUI();
      wrapper.appendChild(searchUI);
      block.appendChild(wrapper);
      initializeAtomicSearch();
    }).catch((err) => {
      console.error('Atomic component failed to define:', err);
      block.textContent = 'Search interface failed to initialize.';
    });
  });
}
