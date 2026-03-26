/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-product. Base: hero.
 * Source: https://www.logitech.com/en-us (section-2: Hero Product Banner)
 * Structure: section.hero-product-banner with product image + headings + pricing + CTA
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Extract product image (first picture/img in the section)
  const image = element.querySelector('picture, img');

  // Extract headings - h2 is subtitle, h1 is main heading
  const subtitle = element.querySelector('h2');
  const mainHeading = element.querySelector('h1');

  // Extract pricing text
  const priceContainer = element.querySelector('.flex.md\\:justify-start, .flex.flex-wrap.gap-x-2');
  let priceText = null;
  if (priceContainer) {
    priceText = document.createElement('p');
    priceText.textContent = priceContainer.textContent.trim().replace(/\s+/g, ' ');
  }

  // Extract CTA link
  const cta = element.querySelector('a[href]');

  // Build cells matching Hero block library format:
  // Row 1: Background/product image
  // Row 2: Title + subheading + CTA
  const cells = [];

  // Row 1: Image
  if (image) {
    cells.push([image]);
  }

  // Row 2: Content - all in a single cell (Hero is 1-column block)
  const contentDiv = document.createElement('div');
  if (subtitle) contentDiv.appendChild(subtitle);
  if (mainHeading) contentDiv.appendChild(mainHeading);
  if (priceText) contentDiv.appendChild(priceText);
  if (cta) contentDiv.appendChild(cta);
  if (contentDiv.childNodes.length > 0) {
    cells.push([contentDiv]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-product', cells });
  element.replaceWith(block);
}
