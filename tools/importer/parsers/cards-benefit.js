/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-benefit. Base: cards.
 * Source: https://www.logitech.com/en-us (section-9: Reasons to Buy)
 * Instance selector: main div.max-width-padding.relative .grid.grid-cols-2 (receives grid element)
 * Each card: div with icon img, h3 heading, rich-text paragraph, optional CTA link
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Find all benefit card items within the grid
  // Source DOM: direct child divs of the grid, each with img + h3 + p + optional a
  const cards = element.querySelectorAll(':scope > div');

  // Build cells matching Cards block library format:
  // 2 columns per row: Cell 1 = icon image, Cell 2 = heading + description + optional CTA
  const cells = [];

  cards.forEach((card) => {
    const img = card.querySelector('img');
    const heading = card.querySelector('h3');
    const desc = card.querySelector('.rich-text p, .rich-text, p:not(:first-child)');
    const cta = card.querySelector('a[href]');

    // Skip cards that have no meaningful content
    if (!img && !heading) return;

    // Cell 1: Benefit icon image
    const imageCell = img || document.createElement('span');

    // Cell 2: Text content (heading + description + optional CTA)
    const textCell = document.createElement('div');
    if (heading) textCell.appendChild(heading);
    if (desc) {
      const p = desc.tagName === 'P' ? desc : desc.querySelector('p') || desc;
      textCell.appendChild(p);
    }
    if (cta) textCell.appendChild(cta);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-benefit', cells });
  element.replaceWith(block);
}
