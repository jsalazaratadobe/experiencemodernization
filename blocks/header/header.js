import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');
let megaMenuHoverTimeout;

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

  // Toggle mobile overlay backdrop
  let overlay = nav.closest('.nav-wrapper')?.querySelector('.nav-overlay');
  if (!expanded && !isDesktop.matches) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.addEventListener('click', () => toggleMenu(nav, navSections));
      nav.closest('.nav-wrapper').append(overlay);
    }
    overlay.classList.add('visible');
  } else if (overlay) {
    overlay.classList.remove('visible');
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function buildPromoPanel() {
  const panel = document.createElement('div');
  panel.className = 'promo-panel';
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <button class="promo-panel-close" aria-label="Close offers">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="promo-panel-grid">
      <div class="promo-card">
        <h4>Freshen Up Your Setup</h4>
        <p>Up to 30% Off</p>
        <a href="/en-us/shop/deals">SHOP DEALS <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>
      </div>
      <div class="promo-card">
        <h4>20% OFF for Students &amp; Heroes</h4>
        <p>Verify your status to unlock the discount.</p>
        <a href="/en-us/programs/sheer-id">VERIFY STATUS <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>
      </div>
      <div class="promo-card">
        <h4>Save up to $100 when you bundle MX Master 4*</h4>
        <p>Pair with select workspace products.</p>
        <a href="/en-us/campaigns/mx-master-4-product-ecosystem">BUNDLE &amp; SAVE <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>
      </div>
      <div class="promo-card">
        <h4>FREE Tablet Stand with Keys-To-Go 2</h4>
        <p>Limited time offer.</p>
        <a href="/en-us/shop/p/keys-to-go-2">SHOP KEYS-TO-GO 2 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>
      </div>
    </div>
    <div class="promo-panel-shipping">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      <span><strong>Free Standard Shipping</strong> &mdash; On all orders over $29.00</span>
    </div>
  `;
  return panel;
}

function togglePromoPanel(utility) {
  const panel = utility.querySelector('.promo-panel');
  const promo = utility.querySelector('.nav-utility-promo');
  if (!panel) return;
  const isHidden = panel.getAttribute('aria-hidden') !== 'false';
  panel.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
  promo.classList.toggle('open', isHidden);
}

function buildUtilityBar() {
  const utility = document.createElement('div');
  utility.className = 'nav-utility';
  utility.innerHTML = `
    <div class="nav-utility-promo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      <span>Save up to $100 when you bundle MX Master 4*</span>
    </div>
    <div class="nav-utility-links">
      <a href="https://www.logitechg.com/en-us">Logitech G</a>
      <a href="/en-us/business.html">Business</a>
      <a href="/en-us/education.html">Education</a>
      <a href="/en-us/shop/outlet">Outlet</a>
      <a href="https://support.logi.com/hc/en-us">Support</a>
      <span class="nav-locale"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>US,EN</span>
    </div>
  `;

  const promoPanel = buildPromoPanel();
  utility.append(promoPanel);

  // Toggle panel on promo click
  const promoTrigger = utility.querySelector('.nav-utility-promo');
  promoTrigger.addEventListener('click', () => togglePromoPanel(utility));

  // Close button
  promoPanel.querySelector('.promo-panel-close').addEventListener('click', (e) => {
    e.stopPropagation();
    togglePromoPanel(utility);
  });

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

  // Strip button classes from brand and add animated logo
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('.button') || navBrand.querySelector('a');
    if (brandLink) {
      brandLink.className = '';
      const bc = brandLink.closest('.button-container');
      if (bc) bc.className = '';
      const logoSpan = document.createElement('span');
      logoSpan.className = 'nav-brand-logo';
      logoSpan.setAttribute('role', 'img');
      logoSpan.setAttribute('aria-label', 'Logitech');
      brandLink.textContent = '';
      brandLink.append(logoSpan);

      // Trigger sprite animation on page load and on hover
      setTimeout(() => logoSpan.classList.add('play'), 100);
      brandLink.addEventListener('mouseenter', () => {
        logoSpan.classList.remove('play');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            logoSpan.classList.add('play');
          });
        });
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

        // Click to toggle on mobile
        shopBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!isDesktop.matches) {
            toggleMegaMenu(nav);
          }
        });

        // Hover to open on desktop
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
      }
    });
  }

  // Decorate tools with icons
  const navTools = nav.querySelector('.nav-tools');
  decorateTools(navTools);

  // Build utility bar
  const utilityBar = buildUtilityBar();

  // Hamburger for mobile (placed on right side)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.append(hamburger);

  // Add mobile-only footer content to nav-sections
  if (navSections) {
    const mobileFooter = document.createElement('div');
    mobileFooter.className = 'nav-mobile-footer';
    mobileFooter.innerHTML = `
      <div class="nav-mobile-divider"></div>
      <ul class="nav-mobile-links">
        <li><a href="https://www.logitechg.com/en-us">Logitech G</a></li>
        <li><a href="/en-us/business.html">Business</a></li>
        <li><a href="/en-us/education.html">Education</a></li>
        <li><a href="/en-us/shop/outlet">Outlet</a></li>
        <li><a href="https://support.logi.com/hc/en-us">Support</a></li>
      </ul>
      <div class="nav-mobile-bottom">
        <a href="/en-us/change-location" class="nav-mobile-locale">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>US,EN</span>
        </a>
        <a href="#" class="nav-mobile-wishlist">
          ${TOOL_ICONS.Wishlist}
          <span>Wishlist</span>
        </a>
      </div>
    `;
    navSections.append(mobileFooter);
  }

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

    // Keep mega menu open when cursor moves into it
    megaMenu.addEventListener('mouseenter', () => {
      clearTimeout(megaMenuHoverTimeout);
    });
    megaMenu.addEventListener('mouseleave', () => {
      if (isDesktop.matches) {
        megaMenuHoverTimeout = setTimeout(() => closeMegaMenu(nav), 200);
      }
    });
  }

  // Build final structure
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(utilityBar, nav);
  block.append(navWrapper);
}
