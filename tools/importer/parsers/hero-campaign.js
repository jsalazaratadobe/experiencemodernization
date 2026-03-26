/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-campaign. Base: hero.
 * Source: https://www.logitech.com/en-us (section-3: Wellness Campaign Banner)
 * Structure: section.background-banner with CSS background image, heading, description, CTA
 * The background image is set via CSS (not an img/picture element), so we extract it
 * from computed styles on div.background.bg-image.
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Extract background image from CSS background-image property
  // The banner uses div.background.bg-image with a CSS background-image
  let bgImg = null;
  const bgEl = element.querySelector('.background.bg-image, .bg-image');
  if (bgEl) {
    const bgStyle = window.getComputedStyle(bgEl).backgroundImage;
    if (bgStyle && bgStyle !== 'none') {
      const urlMatch = bgStyle.match(/url\(["']?(.*?)["']?\)/);
      if (urlMatch && urlMatch[1]) {
        bgImg = document.createElement('img');
        bgImg.src = urlMatch[1];
        bgImg.alt = '';
      }
    }
  }
  // Fallback: check for any picture/img element
  if (!bgImg) {
    bgImg = element.querySelector('picture, img');
  }

  // Extract content from the desktop version
  // Desktop content area: div.content with heading, paragraph, CTA
  const contentArea = element.querySelector('.content.grid, [data-layout]');

  // Extract heading - h2.heading2 "Ritual Rescue"
  const heading = (contentArea || element).querySelector('h2, h1');

  // Extract description paragraph
  const descDiv = (contentArea || element).querySelector('.body-text, .rich-text');
  const description = descDiv ? descDiv.querySelector('p') || descDiv : null;

  // Extract CTA link
  const cta = (contentArea || element).querySelector('a[href]');

  // Build cells matching Hero block library format:
  // Row 1: Background image
  // Row 2: Title + description + CTA (single cell)
  const cells = [];

  // Row 1: Background image
  if (bgImg) {
    cells.push([bgImg]);
  }

  // Row 2: Content - all in single cell (Hero is 1-column)
  const contentDiv = document.createElement('div');
  if (heading) contentDiv.appendChild(heading);
  if (description) contentDiv.appendChild(description);
  if (cta) contentDiv.appendChild(cta);
  if (contentDiv.childNodes.length > 0) {
    cells.push([contentDiv]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-campaign', cells });
  element.replaceWith(block);
}
