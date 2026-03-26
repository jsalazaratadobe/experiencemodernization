/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-thumbnail. Base: cards.
 * Source: https://www.logitech.com/en-us (section-7: Shop by Product Category)
 * Instance selector: div.block-spacing .grid-columns (receives grid element)
 * Each card: a with div.category-card-media containing img + p label
 * Generated: 2026-03-24
 */
export default function parse(element, { document }) {
  // Find all category thumbnail links within the grid
  // Source DOM: a elements with div containing img + p text label
  const links = element.querySelectorAll('a[href]');

  // Build cells matching Cards block library format:
  // 2 columns per row: Cell 1 = thumbnail image, Cell 2 = category name
  const cells = [];

  links.forEach((link) => {
    const img = link.querySelector('img');
    const label = link.querySelector('p, .text-body-16, figcaption');
    if (!img && !label) return;

    // Cell 1: Thumbnail image
    const imageCell = img || document.createElement('span');

    // Cell 2: Category name as link
    const textCell = document.createElement('div');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = label ? label.textContent.trim() : link.textContent.trim();
    textCell.appendChild(a);

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-thumbnail', cells });
  element.replaceWith(block);
}
