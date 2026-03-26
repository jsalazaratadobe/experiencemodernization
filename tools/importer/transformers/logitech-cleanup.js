/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Logitech cleanup.
 * Removes non-authorable content from Logitech pages.
 * Selectors from captured DOM of https://www.logitech.com/en-us
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove navigation overlay that could block content parsing
    // Found in captured DOM: <div class="nav-bg"><div class="nav-bg-overlay"></div></div>
    WebImporter.DOMUtils.remove(element, ['.nav-bg', '.nav-bg-overlay']);

    // Remove skip-to-content link: <a id="skip-link" class="sr-only ...">SKIP TO MAIN CONTENT</a>
    WebImporter.DOMUtils.remove(element, ['#skip-link']);

    // Remove toaster promotional messages: <div class="toaster-msg ...">
    WebImporter.DOMUtils.remove(element, ['.toaster-msg']);
  }

  if (hookName === H.after) {
    // Remove site header: <header class="top-header bg-white mode-light ...">
    WebImporter.DOMUtils.remove(element, ['header.top-header', 'header']);

    // Remove sticky header wrapper: <div class="sticky z-30 ...">
    WebImporter.DOMUtils.remove(element, ['.sticky.z-30']);

    // Remove desktop navigation: <div id="desktop-navigation" ...>
    WebImporter.DOMUtils.remove(element, ['#desktop-navigation']);

    // Remove footer
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove non-content elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link', 'iframe']);

    // Clean up tracking/analytics attributes from all elements
    element.querySelectorAll('[data-analytics-section]').forEach((el) => {
      el.removeAttribute('data-analytics-section');
    });
    element.querySelectorAll('[data-sveltekit-preload-data]').forEach((el) => {
      el.removeAttribute('data-sveltekit-preload-data');
    });
  }
}
