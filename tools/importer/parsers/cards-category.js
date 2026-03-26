/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category. Base: cards.
 * Source: https://www.logitech.com/en-us (sections 5, 6, 8)
 * Instance selector: .standard-cards .carousel (receives carousel element)
 * Each card: a.standard-card with picture + div.standard-content > h2
 * Used for: Popular Categories, Sustainability cards, Shop by Interest
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Find all standard card items within the carousel
  // Source DOM: a.standard-card elements with picture + h2 heading overlay
  const cards = element.querySelectorAll('a.standard-card, a[class*="standard-card"]');

  // Build cells matching Cards block library format:
  // 2 columns per row: Cell 1 = image, Cell 2 = heading as link
  const cells = [];

  cards.forEach((card) => {
    // Cell 1: Card background image
    const img = card.querySelector('picture, img');

    // Cell 2: Category/interest name as link
    const textCell = document.createElement('div');
    const heading = card.querySelector('h2');
    if (heading) {
      const headingText = heading.textContent.trim();
      if (card.href) {
        const h2 = document.createElement('h2');
        const a = document.createElement('a');
        a.href = card.href;
        a.textContent = headingText;
        h2.appendChild(a);
        textCell.appendChild(h2);
      } else {
        const h2 = document.createElement('h2');
        h2.textContent = headingText;
        textCell.appendChild(h2);
      }
    }

    if (img || textCell.childNodes.length > 0) {
      cells.push([img || document.createElement('span'), textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
