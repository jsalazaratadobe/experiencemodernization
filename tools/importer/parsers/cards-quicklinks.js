/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-quicklinks. Base: cards.
 * Source: https://www.logitech.com/en-us (section-1: Quick Links)
 * Structure: section.quick-links with circular image links + figcaptions
 * Each link: <a> with <figure> containing <img> + <figcaption>
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Find all category link items
  // Source DOM: a elements with figure > img + figcaption inside .layout or .carousel
  const links = element.querySelectorAll('a[href]');

  // Build cells matching Cards block library format:
  // 2 columns per row: Cell 1 = image, Cell 2 = text content (link)
  const cells = [];

  links.forEach((link) => {
    const img = link.querySelector('img');
    const caption = link.querySelector('figcaption');
    if (!img && !caption) return;

    // Cell 1: Category image
    const imageCell = img || document.createElement('span');

    // Cell 2: Category name as link
    const textCell = document.createElement('div');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = caption ? caption.textContent.trim() : link.textContent.trim();
    textCell.appendChild(a);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklinks', cells });
  element.replaceWith(block);
}
