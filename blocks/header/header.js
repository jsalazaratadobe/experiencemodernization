import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

const CATEGORY_IMAGES = {
  Mice: 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-mice-mx-master-4.png',
  Keyboards: 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-keyboards-230-0.png',
  Combos: 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-combos-230-0.png',
  Webcams: 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-webcams-230-0.png',
  'iPad Keyboard Cases': 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-ipad-pro-keyboard-cases-230-0.png',
  Gaming: 'https://resource.logitech.com/w_115,h_115,ar_1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logi-navigation-gaming.png',
};

const SHOPWAY_IMAGES = {
  'MX Series': 'https://resource.logitech.com/ar_3:1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-mx-category.jpg',
  'Ergo Series': 'https://resource.logitech.com/ar_3:1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-ergo-category.jpg',
  'For Mac': 'https://resource.logitech.com/ar_3:1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-for-mac-category.jpg',
  'For iPad': 'https://resource.logitech.com/ar_3:1,c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/navigation/logi/logi-nav/logitech-navigation-for-ipad-category.jpg',
};

const TOOL_ICONS = {
  Search: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none"><g stroke="currentColor" stroke-linejoin="round" stroke-width="2"><path d="M13.315 12.862a6.876 6.876 0 11-9.723-9.725 6.876 6.876 0 019.723 9.724Z" clip-rule="evenodd"/><path d="m14.078 12.375 5 5"/></g></svg>',
  Wishlist: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none"><path d="M10 17.5l-1.45-1.32C3.4 11.36 0 8.28 0 4.5 0 1.42 2.42 0 5 0c1.74 0 3.41.81 4.5 2.09C10.59.81 12.26 0 14 0c2.58 0 5 1.42 5 4.5 0 3.78-3.4 6.86-8.55 11.54L10 17.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  Account: '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none"><path d="M11.266 4.625a3.125 3.125 0 10-6.25 0 3.125 3.125 0 006.25 0Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><path d="M15.016 17.75c0-3.452-3.079-6.25-6.875-6.25-3.797 0-6.875 2.798-6.875 6.25" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/></svg>',
  Cart: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="19" viewBox="0 0 26 19" fill="none"><path d="M.14 1.171l5.049-.015L9.95 10.97h10.832l4.024-9.806" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/><circle cx="10.916" cy="15.837" r="1.931" stroke="currentColor" stroke-width="1.2" fill="none"/><circle cx="19.705" cy="15.837" r="1.931" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>',
};

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const megaMenu = nav.querySelector('.mega-menu[aria-hidden="false"]');
    if (megaMenu) {
      // eslint-disable-next-line no-use-before-define
      closeMegaMenu(nav);
      return;
    }
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('.nav-hamburger button').focus();
    }
  }
}

function closeMegaMenu(nav) {
  const megaMenu = nav.querySelector('.mega-menu');
  if (megaMenu) megaMenu.setAttribute('aria-hidden', 'true');
  const shopTrigger = nav.querySelector('.nav-shop-trigger');
  if (shopTrigger) shopTrigger.setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
}

function openMegaMenu(nav) {
  const megaMenu = nav.querySelector('.mega-menu');
  if (megaMenu) megaMenu.setAttribute('aria-hidden', 'false');
  const shopTrigger = nav.querySelector('.nav-shop-trigger');
  if (shopTrigger) shopTrigger.setAttribute('aria-expanded', 'true');
}

function toggleMegaMenu(nav) {
  const megaMenu = nav.querySelector('.mega-menu');
  if (!megaMenu) return;
  const isHidden = megaMenu.getAttribute('aria-hidden') !== 'false';
  if (isHidden) openMegaMenu(nav);
  else closeMegaMenu(nav);
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

const PROMO_OFFERS = [
  {
    title: 'FREE Tablet Stand with Keys-To-Go 2',
    description: 'Get a free tablet stand when you purchase a Keys-To-Go 2 wireless keyboard.',
    fine: '*While supplies last. Limit one per customer.',
    cta: 'Shop Now',
    href: '/en-us/shop/p/keys-to-go-2',
  },
  {
    title: 'Save up to $100 when you bundle MX Master 4*',
    description: 'Save up to $100 when you bundle the MX Master 4 with select workspace products.',
    fine: '*Offer is automatically applied in cart.',
    cta: 'Shop Now',
    href: '/en-us/campaigns/mx-master-4-product-ecosystem',
  },
  {
    title: '20% OFF for Students & Heroes',
    description: 'Students and Heroes can benefit from a 20% discount on Logitech products.',
    fine: '',
    cta: 'Get Verified',
    href: '/en-us/programs/sheer-id',
  },
  {
    title: 'Buy now, pay later with Klarna',
    description: 'Pay at your own pace with Klarna payment plans. Get what you love, choose how you pay.',
    fine: '',
    cta: 'Learn More',
    href: '/en-us/promo/klarna',
  },
];

const OUTLET_TAG_SVG = '<svg class="outlet-tag-icon" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m.295 4.79 4.5-4.5c.18-.18.43-.29.705-.29H9c.55 0 1 .45 1 1v3.5c0 .275-.11.525-.295.71l-4.5 4.5a.994.994 0 01-1.41-.005l-3.5-3.5A.978.978 0 010 5.5c0-.275.115-.53.295-.71ZM8.25 2.5a.749.749 0 100-1.5.749.749 0 100 1.5Z"/></svg>';

const CHEVRON_SVG = '<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildUtilityBar() {
  const utility = document.createElement('div');
  utility.className = 'nav-utility';

  // Promo toggle area
  const promoToggle = document.createElement('button');
  promoToggle.className = 'nav-utility-promo-toggle';
  promoToggle.setAttribute('aria-expanded', 'false');

  const chevron = document.createElement('span');
  chevron.className = 'nav-utility-chevron';
  chevron.innerHTML = CHEVRON_SVG;

  const promoText = document.createElement('span');
  promoText.className = 'nav-utility-promo-text';
  promoText.textContent = PROMO_OFFERS[0].title;

  promoToggle.append(chevron, promoText);

  // Rotate promo text
  let promoIndex = 0;
  setInterval(() => {
    const expanded = promoToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) return;
    promoIndex = (promoIndex + 1) % PROMO_OFFERS.length;
    promoText.textContent = PROMO_OFFERS[promoIndex].title;
  }, 4000);

  // Utility links
  const utilityLinks = document.createElement('div');
  utilityLinks.className = 'nav-utility-links';
  utilityLinks.innerHTML = `
    <a href="https://www.logitechg.com/en-us">Logitech G</a>
    <a href="/en-us/business.html">Business</a>
    <a href="/en-us/education.html">Education</a>
    <span class="nav-outlet-link">${OUTLET_TAG_SVG}<a href="/en-us/shop/outlet">Outlet</a></span>
    <a href="https://support.logi.com/hc/en-us">Support</a>
    <span class="nav-locale"><img src="/icons/globe.svg" alt="" width="13" height="13">US,EN</span>
  `;

  // Offers panel
  const offersPanel = document.createElement('div');
  offersPanel.className = 'nav-offers-panel';
  offersPanel.setAttribute('aria-hidden', 'true');

  const offersInner = document.createElement('div');
  offersInner.className = 'nav-offers-inner';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'nav-offers-close';
  closeBtn.setAttribute('aria-label', 'Close offers');
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const offersGrid = document.createElement('div');
  offersGrid.className = 'nav-offers-grid';

  const arrowSvg = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  PROMO_OFFERS.forEach((offer) => {
    const card = document.createElement('a');
    card.href = offer.href;
    card.className = 'nav-offer-card';
    card.innerHTML = `
      <div class="nav-offer-card-body">
        <h6 class="nav-offer-card-title">${offer.title}</h6>
        <p class="nav-offer-card-desc">${offer.description}</p>
        ${offer.fine ? `<p class="nav-offer-card-fine">${offer.fine}</p>` : ''}
      </div>
      <span class="nav-offer-card-cta">${offer.cta} ${arrowSvg}</span>
    `;
    offersGrid.append(card);
  });

  const truckSvg = '<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1H1v10h12V1Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 5h3l3 3v3h-6V5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="4.5" cy="13.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><circle cx="15.5" cy="13.5" r="1.5" stroke="currentColor" stroke-width="1.5"/></svg>';

  const shippingBanner = document.createElement('div');
  shippingBanner.className = 'nav-offers-shipping';
  shippingBanner.innerHTML = `${truckSvg}<span>Free Standard Shipping on Orders Over $29</span>`;

  offersInner.append(closeBtn, offersGrid, shippingBanner);
  offersPanel.append(offersInner);

  // Toggle logic
  function toggleOffers() {
    const expanded = promoToggle.getAttribute('aria-expanded') === 'true';
    promoToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    offersPanel.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    if (expanded) {
      promoText.textContent = PROMO_OFFERS[promoIndex].title;
    } else {
      promoText.textContent = 'Close Offers';
    }
  }

  promoToggle.addEventListener('click', toggleOffers);
  closeBtn.addEventListener('click', toggleOffers);

  utility.append(promoToggle, utilityLinks, offersPanel);
  return utility;
}

function buildMegaMenu(shopItem) {
  const megaMenu = document.createElement('div');
  megaMenu.className = 'mega-menu';
  megaMenu.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'mega-menu-inner';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mega-menu-close';
  closeBtn.setAttribute('aria-label', 'Close menu');
  closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  const groups = {};
  const nestedUl = shopItem.querySelector('ul');
  if (nestedUl) {
    [...nestedUl.children].forEach((li) => {
      const strong = li.querySelector('strong');
      if (strong) {
        const groupName = strong.textContent.trim();
        const groupUl = li.querySelector('ul');
        if (groupUl) {
          groups[groupName] = [...groupUl.children].map((linkLi) => {
            const a = linkLi.querySelector('a');
            return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
          }).filter(Boolean);
        }
      }
    });
  }

  // Build Shop by category tiles
  const catSection = document.createElement('div');
  catSection.className = 'mega-menu-categories';
  catSection.innerHTML = '<h5>Shop by category</h5>';
  const catGrid = document.createElement('div');
  catGrid.className = 'mega-menu-cat-grid';
  (groups['Shop by category'] || []).forEach(({ text, href }) => {
    const tile = document.createElement('a');
    tile.href = href;
    tile.className = 'mega-menu-tile';
    const imgSrc = CATEGORY_IMAGES[text] || '';
    tile.innerHTML = `${imgSrc ? `<img src="${imgSrc}" alt="${text}" loading="lazy" width="115" height="115">` : ''}<span>${text}</span>`;
    catGrid.append(tile);
  });
  catSection.append(catGrid);

  // Build text links column
  const textLinks = document.createElement('div');
  textLinks.className = 'mega-menu-links';
  const textUl = document.createElement('ul');
  (groups['More categories'] || []).forEach(({ text, href }) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${href}">${text}</a>`;
    textUl.append(li);
  });
  textLinks.append(textUl);

  // Build Shop your way cards
  const waySection = document.createElement('div');
  waySection.className = 'mega-menu-shopway';
  waySection.innerHTML = '<h5>Shop your way</h5>';
  const wayGrid = document.createElement('div');
  wayGrid.className = 'mega-menu-way-grid';
  (groups['Shop your way'] || []).forEach(({ text, href }) => {
    const card = document.createElement('a');
    card.href = href;
    card.className = 'mega-menu-way-card';
    const imgSrc = SHOPWAY_IMAGES[text] || '';
    card.innerHTML = `${imgSrc ? `<img src="${imgSrc}" alt="${text}" loading="lazy">` : ''}<span>${text}</span>`;
    wayGrid.append(card);
  });
  waySection.append(wayGrid);

  // Build explore more text links
  const moreLinks = document.createElement('div');
  moreLinks.className = 'mega-menu-more-links';
  const moreUl = document.createElement('ul');
  (groups['Explore more'] || []).forEach(({ text, href }) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${href}">${text}</a>`;
    moreUl.append(li);
  });
  moreLinks.append(moreUl);

  inner.append(closeBtn, catSection, textLinks, waySection, moreLinks);
  megaMenu.append(inner);

  return megaMenu;
}

function decorateTools(navTools) {
  if (!navTools) return;
  const links = navTools.querySelectorAll('a');
  links.forEach((link) => {
    const text = link.textContent.trim();
    link.className = '';
    const container = link.closest('.button-container');
    if (container) container.className = '';
    if (text === 'Search') {
      link.innerHTML = TOOL_ICONS.Search;
      link.className = 'nav-tool-icon nav-search';
      link.setAttribute('aria-label', 'Search');
    } else if (text === 'Account') {
      link.innerHTML = TOOL_ICONS.Account;
      link.className = 'nav-tool-icon nav-account';
      link.setAttribute('aria-label', 'My Account');
    } else if (text === 'Cart') {
      link.innerHTML = TOOL_ICONS.Cart;
      link.className = 'nav-tool-icon nav-cart';
      link.setAttribute('aria-label', 'View Cart');
    }
  });

  // Add wishlist icon between search and account
  const accountIcon = navTools.querySelector('.nav-account');
  if (accountIcon) {
    const wishlist = document.createElement('a');
    wishlist.href = '#';
    wishlist.className = 'nav-tool-icon nav-wishlist';
    wishlist.setAttribute('aria-label', 'Wishlist');
    wishlist.innerHTML = TOOL_ICONS.Wishlist;
    accountIcon.parentElement.insertBefore(wishlist, accountIcon);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Strip button classes from brand and add animated sprite logo
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button') || navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = 'nav-brand-logo';
      brandLink.setAttribute('aria-label', 'Logitech');
      const bc = brandLink.closest('.button-container');
      if (bc) bc.className = '';
      brandLink.textContent = '';

      // Sprite animation: play on load, replay on hover
      brandLink.classList.add('play');
      brandLink.addEventListener('animationend', () => {
        brandLink.classList.remove('play');
        brandLink.classList.add('stopped');
      });
      brandLink.addEventListener('mouseenter', () => {
        brandLink.classList.remove('stopped');
        // Force reflow to restart animation
        brandLink.offsetWidth; // eslint-disable-line no-unused-expressions
        brandLink.classList.add('play');
      });
    }
  }

  // Strip button classes from nav-sections links
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('.button').forEach((btn) => {
      btn.className = '';
      const bc = btn.closest('.button-container');
      if (bc) bc.className = '';
    });
  }

  // Build mega-menu from Shop dropdown
  let megaMenu = null;
  if (navSections) {
    const topItems = navSections.querySelectorAll(':scope .default-content-wrapper > ul > li');
    topItems.forEach((item) => {
      const nestedUl = item.querySelector('ul');
      if (nestedUl) {
        megaMenu = buildMegaMenu(item);

        // Replace the dropdown content with a simple Shop button
        const shopText = item.querySelector('strong, p > strong');
        const label = shopText ? shopText.textContent.trim() : 'Shop';
        item.textContent = '';
        item.classList.add('nav-shop-trigger');

        const shopBtn = document.createElement('button');
        shopBtn.textContent = label;
        shopBtn.setAttribute('aria-expanded', 'false');
        shopBtn.setAttribute('aria-haspopup', 'true');
        item.append(shopBtn);

        shopBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!isDesktop.matches) {
            toggleMegaMenu(nav);
          }
        });

        // Hover to open on desktop
        let megaMenuHoverTimeout;
        item.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            clearTimeout(megaMenuHoverTimeout);
            openMegaMenu(nav);
          }
        });
        item.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            megaMenuHoverTimeout = setTimeout(() => closeMegaMenu(nav), 200);
          }
        });

        // Keep mega menu open while hovering over it
        nav.addEventListener('mouseenter', () => {
          const mm = nav.querySelector('.mega-menu[aria-hidden="false"]');
          if (mm && isDesktop.matches) clearTimeout(megaMenuHoverTimeout);
        });
        nav.addEventListener('mouseleave', () => {
          if (isDesktop.matches) {
            megaMenuHoverTimeout = setTimeout(() => closeMegaMenu(nav), 200);
          }
        });
      }
    });
  }

  // Decorate tools with icons
  const navTools = nav.querySelector('.nav-tools');
  decorateTools(navTools);

  // Build utility bar
  const utilityBar = buildUtilityBar();

  // Hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    closeMegaMenu(nav);
  });

  // Append mega-menu to nav
  if (megaMenu) {
    nav.append(megaMenu);
    megaMenu.querySelector('.mega-menu-close').addEventListener('click', () => closeMegaMenu(nav));
  }

  // Build final structure
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(utilityBar, nav);
  block.append(navWrapper);
}
