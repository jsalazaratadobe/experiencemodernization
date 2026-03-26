/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.logitech.com/en-us (section-4: Product Cards Grid)
 * Instance selector: div.card-grid .editorial-card (receives individual card elements)
 * Each card: div.editorial-card with picture, h2, paragraph, CTA link
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // The element IS the individual editorial-card (matched by instance selector)
  // Build cells matching Cards block library format:
  // 2 columns: Cell 1 = image, Cell 2 = heading + description + CTA
  const cells = [];

  // Cell 1: Card image
  const img = element.querySelector('picture, img');

  // Cell 2: Text content (heading + description + CTA)
  const textCell = document.createElement('div');

  const heading = element.querySelector('h2, h3');
  if (heading) textCell.appendChild(heading);

  const desc = element.querySelector('.rich-text p, .rich-text');
  if (desc) {
    const p = desc.tagName === 'P' ? desc : desc.querySelector('p');
    if (p) textCell.appendChild(p);
  }

  const cta = element.querySelector('a.cta-link, a[href]:not(.contents):not(.group)');
  if (cta) textCell.appendChild(cta);

  if (img || textCell.childNodes.length > 0) {
    cells.push([img || document.createElement('span'), textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
