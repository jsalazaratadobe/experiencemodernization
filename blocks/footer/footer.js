import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const FOOTER_LINKS = [
  {
    heading: 'Logitech',
    links: [
      { text: 'Our Story', href: '/en-us/about' },
      { text: 'Careers', href: '/en-us/careers' },
      { text: 'Investors', href: 'https://ir.logitech.com/' },
      { text: 'Learning Center', href: '/en-us/discover/learning-center' },
      { text: 'Blog', href: 'https://blog.logitech.com/' },
      { text: 'Press', href: 'https://news.logitech.com/' },
      { text: 'Sustainability', href: '/en-us/sustainability' },
      { text: 'Recycling', href: '/en-us/sustainability/recycling' },
      { text: 'Accessibility', href: '/en-us/accessibility' },
    ],
  },
  {
    heading: 'Shop products',
    links: [
      { text: 'Mice', href: '/en-us/shop/c/mice' },
      { text: 'Keyboards', href: '/en-us/shop/c/keyboards' },
      { text: 'Headsets & Earbuds', href: '/en-us/shop/c/headsets' },
      { text: 'Webcams', href: '/en-us/shop/c/webcams' },
      { text: 'Speakers', href: '/en-us/shop/c/speakers' },
      { text: 'iPad Keyboard Cases', href: '/en-us/shop/c/ipad-keyboards' },
      { text: 'Gaming Mice', href: '/en-us/shop/c/gaming-mice' },
      { text: 'Gaming Keyboards', href: '/en-us/shop/c/gaming-keyboards' },
      { text: 'Gaming Headsets', href: '/en-us/shop/c/gaming-audio' },
      { text: 'Microphones', href: '/en-us/shop/c/microphones' },
    ],
  },
  {
    heading: 'For Productivity',
    links: [
      { text: 'Master Series', href: '/en-us/mx/master-series' },
      { text: 'Ergo Series', href: '/en-us/ergo/ergo-series' },
    ],
  },
  {
    heading: 'For Gaming and Streaming',
    links: [
      { text: 'Astro Gaming', href: 'https://www.logitechg.com/en-us/collections/astro-series.html' },
      { text: 'Pro Gaming', href: 'https://www.logitechg.com/en-us/products/pro.html' },
      { text: 'SIM Racing', href: 'https://www.logitechg.com/en-us/pro-racing.html' },
      { text: 'Streaming Gear', href: 'https://www.logitechg.com/en-us/collections/streaming-gear-software.html' },
    ],
  },
  {
    heading: 'For Business',
    links: [
      { text: 'Shop Spaces', href: '/en-us/business' },
      { text: 'Shop Business Products', href: '/en-us/business/products' },
      { text: 'Software & Services', href: '/en-us/video-collaboration/services-and-software' },
      { text: 'Partners', href: '/en-us/business/partner-program' },
      { text: 'Alliance Partners', href: '/en-us/business/partners' },
      { text: 'Business Resources', href: '/en-us/business/resource-center' },
    ],
  },
  {
    heading: 'For Education',
    links: [
      { text: 'Shop Education Products', href: '/en-us/products/education' },
      { text: 'K-12 Solutions', href: '/en-us/education/k12' },
      { text: 'Education Resources', href: '/en-us/education/education-center' },
      { text: 'Student Discount', href: '/en-us/programs/sheer-id' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { text: 'Individual Support', href: 'https://support.logitech.com/support' },
      { text: 'Gaming Support', href: 'https://support.logi.com/hc/en-us/categories/360001764393-Gaming' },
      { text: 'Business & Education Support', href: 'https://prosupport.logi.com/hc/' },
      { text: 'Contact us', href: 'http://support.logitech.com/contact' },
      { text: 'Spare Parts', href: '/en-us/shop/spare-parts-store' },
    ],
  },
  {
    heading: 'Software',
    links: [
      { text: 'GHub for Gaming & Streaming', href: 'https://www.logitechg.com/en-us/innovation/g-hub.html' },
      { text: 'Options+ for Performance', href: '/en-us/software/logi-options-plus' },
    ],
  },
];

function buildTrademarkSection() {
  const section = document.createElement('div');
  section.className = 'footer-trademark';
  section.innerHTML = `
    <h5>LEGAL TRADEMARK STATEMENT</h5>
    <p>Logitech, Logi, their logos, and all other Logitech trademarks are trademarks or registered trademarks of Logitech Europe S.A. and/or its affiliates in the U.S. and other countries. All other third party trademarks are the property of their respective owners. <a href="/en-us/tos/trademark-guidelines.html">See all trademarks</a></p>
  `;
  return section;
}

function buildLogoColumn() {
  const col = document.createElement('div');
  col.className = 'footer-logo-col';

  // Logo
  const logo = document.createElement('a');
  logo.href = '/en-us';
  logo.className = 'footer-logo';
  logo.setAttribute('aria-label', 'Logitech');
  logo.innerHTML = `<svg viewBox="0 0 50 18" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="14">
    <path d="M5.54 17.14H0V0H5.54V17.14ZM15.29 17.44C10.88 17.44 7.72 14.18 7.72 9.87V9.82C7.72 5.51 10.93 2.2 15.34 2.2C19.75 2.2 22.91 5.46 22.91 9.77V9.82C22.91 14.13 19.7 17.44 15.29 17.44ZM17.52 9.82C17.52 8.1 16.62 6.72 15.29 6.72C13.96 6.72 13.11 8.05 13.11 9.77V9.82C13.11 11.54 14.01 12.92 15.34 12.92C16.67 12.92 17.52 11.59 17.52 9.87V9.82ZM32.29 17.44C27.66 17.44 24.28 14.13 24.28 9.87V9.82C24.28 5.56 27.59 2.2 32.14 2.2C34.52 2.2 36.1 2.85 37.58 4.02L34.67 7.33C33.82 6.67 33.02 6.32 32.04 6.32C30.46 6.32 29.38 7.75 29.38 9.52V9.57C29.38 11.49 30.46 12.77 32.14 12.77C33.27 12.77 34.02 12.37 34.82 11.64L37.73 14.58C36.1 16.35 34.42 17.44 32.29 17.44ZM38.34 2.5H43.88V17.14H38.34V2.5ZM38.34 0H43.88V1.62H38.34V0Z" fill="currentColor"/>
  </svg>`;

  // Locale
  const locale = document.createElement('div');
  locale.className = 'footer-locale';
  locale.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
    <span>US,EN</span>
  `;

  // Social icons
  const social = document.createElement('div');
  social.className = 'footer-social';
  social.innerHTML = `
    <a href="http://instagram.com/logitech" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    </a>
    <a href="http://www.twitter.com/Logitech" aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
    <a href="http://www.facebook.com/Logitech" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
  `;

  col.append(logo, locale, social);
  return col;
}

function buildNavColumns() {
  const nav = document.createElement('div');
  nav.className = 'footer-nav';

  FOOTER_LINKS.forEach((group) => {
    const col = document.createElement('div');
    col.className = 'footer-nav-group';

    const heading = document.createElement('h6');
    heading.textContent = group.heading;
    col.append(heading);

    const list = document.createElement('ul');
    group.links.forEach((link) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      li.append(a);
      list.append(li);
    });
    col.append(list);
    nav.append(col);
  });

  return nav;
}

function buildNewsletter() {
  const section = document.createElement('div');
  section.className = 'footer-newsletter';
  section.innerHTML = `
    <p class="footer-newsletter-desc">Sign up now to unlock a welcome offer, plus access to subscriber exclusives.</p>
    <form class="footer-newsletter-form" name="email-subscription">
      <div class="footer-newsletter-input-wrap">
        <input type="email" placeholder="Sign up for email newsletter" aria-label="Sign up for email newsletter" required>
        <button type="submit" aria-label="Subscribe">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
      <label class="footer-newsletter-consent">
        <input type="checkbox">
        <span>I want personalized marketing from Logitech. You can unsubscribe anytime. See our <a href="/en-us/legal/privacy-policy">Privacy Policy.</a></span>
      </label>
    </form>
  `;
  return section;
}

function buildLegalBar() {
  const section = document.createElement('div');
  section.className = 'footer-legal';
  section.innerHTML = `
    <span class="footer-copyright">&copy;2026 Logitech. All rights reserved</span>
    <nav class="footer-legal-links" aria-label="Legal">
      <a href="/en-us/tos/terms">Terms of Use</a>
      <a href="/en-us/legal/privacy-policy">Privacy Policy</a>
      <a href="/en-us/legal/cookie-policy">Cookie Settings</a>
      <a href="/en-us/sitemap">Sitemap</a>
    </nav>
  `;
  return section;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Build Logitech footer structure
  const logiFooter = document.createElement('div');
  logiFooter.className = 'footer-logitech';

  logiFooter.append(buildTrademarkSection());

  const mainContent = document.createElement('div');
  mainContent.className = 'footer-main';
  mainContent.append(buildLogoColumn());
  mainContent.append(buildNavColumns());
  logiFooter.append(mainContent);

  logiFooter.append(buildNewsletter());
  logiFooter.append(buildLegalBar());

  block.textContent = '';
  block.append(logiFooter);
}
