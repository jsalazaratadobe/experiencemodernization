import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Restructures the sustainability section's default-content-wrapper
 * so the 3 sub-cards (heading + image pairs) become image cards
 * with overlaid titles in a horizontal grid.
 * @param {Element} main The container element
 */
function decorateSustainabilitySection(main) {
  const section = main.querySelector('.section.dark .default-content-wrapper');
  if (!section) return;

  const sustainH2 = section.querySelector('#everything-matters');
  if (!sustainH2) return;

  // Collect the 3 sub-card pairs: each is an h2 (with link) followed by a p (with picture)
  const cardIds = ['labels-matters', 'doing-better-matters', 'working-together-matters'];
  const cards = [];
  cardIds.forEach((id) => {
    const heading = section.querySelector(`#${id}`);
    if (!heading) return;
    const imgP = heading.nextElementSibling;
    cards.push({ heading, imgP });
  });

  if (cards.length === 0) return;

  // Wrap the top content (before first card heading) in a header div
  const header = document.createElement('div');
  header.className = 'sustainability-header';
  const topH2 = section.querySelector('#design-for-sustainability');

  // Save reference to the sibling chain before moving elements
  const cardIdSet = new Set(cardIds);
  let next = sustainH2.nextElementSibling;

  if (topH2) header.append(topH2);
  header.append(sustainH2);

  // Grab description and CTA that follow "Everything matters"
  while (next && !cardIdSet.has(next.id)) {
    const toMove = next;
    next = next.nextElementSibling;
    header.append(toMove);
  }

  // Build cards grid
  const grid = document.createElement('div');
  grid.className = 'sustainability-cards';

  cards.forEach(({ heading, imgP }) => {
    const card = document.createElement('a');
    const link = heading.querySelector('a');
    card.href = link ? link.href : '/';
    card.className = 'sustainability-card';
    card.setAttribute('aria-label', heading.textContent.trim());

    // Move the image into the card (may be <picture> or bare <img>)
    const pic = imgP ? (imgP.querySelector('picture') || imgP.querySelector('img')) : null;
    if (pic) card.append(pic);

    // Create overlay title
    const title = document.createElement('div');
    title.className = 'sustainability-card-title';
    title.textContent = heading.textContent.trim();
    card.append(title);

    grid.append(card);

    // Remove originals from DOM
    heading.remove();
    if (imgP) imgP.remove();
  });

  // Replace default-content-wrapper contents
  section.textContent = '';
  section.append(header, grid);

  // Add "Shop by product category" heading before the cards-thumbnail block
  const darkSection = section.closest('.section.dark');
  const thumbWrapper = darkSection ? darkSection.querySelector('.cards-thumbnail-wrapper') : null;
  if (thumbWrapper) {
    const heading = document.createElement('h2');
    heading.className = 'product-category-heading';
    heading.textContent = 'Shop by product category';
    thumbWrapper.before(heading);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Moves instrumentation data attributes from one element to another.
 * @param {Element} source The source element
 * @param {Element} target The target element
 */
export function moveInstrumentation(source, target) {
  [...source.attributes]
    .filter((attr) => attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-'))
    .forEach((attr) => {
      target.setAttribute(attr.name, attr.value);
      source.removeAttribute(attr.name);
    });
}

/**
 * Removes tracking pixels and "Chat with us" junk content that creates
 * empty space before the footer.
 * @param {Element} main The container element
 */
function removeTrackingJunk(main) {
  main.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    const imgs = wrapper.querySelectorAll('img');
    const isJunk = [...imgs].some((img) => {
      const src = img.getAttribute('src') || '';
      return src.includes('bizible.com')
        || src.includes('bizibly.com')
        || src.includes('zoominfo.com')
        || src.includes('yellowmessenger.com');
    });
    if (isJunk) wrapper.remove();
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateSustainabilitySection(main);
  removeTrackingJunk(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
