/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Logitech sections.
 * Inserts section breaks (<hr>) and section-metadata blocks based on template sections.
 * Selectors from captured DOM of https://www.logitech.com/en-us
 * Runs in afterTransform only, uses payload.template.sections.
 * Handles :contains() pseudo-selectors via text matching fallback.
 * Section selectors verified against live DOM via Playwright.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

/**
 * querySelector wrapper that handles :contains() pseudo-selectors
 * which are not standard CSS but used in page-templates.json.
 * Strips :contains('text') from selector, queries with remaining selector,
 * then filters by text content match.
 */
function querySelectorWithContains(root, selector) {
  // Check for :contains('...') pattern
  const containsMatch = selector.match(/:contains\(['"]([^'"]+)['"]\)/g);
  if (!containsMatch) {
    // No :contains, use standard querySelector
    return root.querySelector(selector);
  }

  // Extract all :contains text values
  const textFilters = containsMatch.map((m) => {
    const inner = m.match(/:contains\(['"]([^'"]+)['"]\)/);
    return inner ? inner[1] : '';
  });

  // Strip :contains() from selector for querySelector
  let cleanSelector = selector;
  containsMatch.forEach((m) => {
    cleanSelector = cleanSelector.replace(m, '');
  });
  // Clean up any trailing/leading whitespace in selector parts
  cleanSelector = cleanSelector.replace(/\s+/g, ' ').trim();

  // If the clean selector is empty or invalid, try broader approach
  if (!cleanSelector || cleanSelector === '') {
    cleanSelector = '*';
  }

  try {
    const candidates = root.querySelectorAll(cleanSelector);
    for (const el of candidates) {
      const text = el.textContent || '';
      if (textFilters.every((filter) => text.includes(filter))) {
        return el;
      }
    }
  } catch (e) {
    // Selector still invalid after cleanup
  }
  return null;
}

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };

    // Process sections in reverse order to avoid offset issues when inserting elements
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Find the first element matching the section selector
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        try {
          sectionEl = querySelectorWithContains(element, sel);
          if (sectionEl) break;
        } catch (e) {
          // Selector may not be valid in this context, try next
        }
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section-metadata after the section element
        if (sectionEl.nextSibling) {
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        } else {
          sectionEl.parentNode.appendChild(sectionMetadata);
        }
      }

      // Insert <hr> before the section element (except for the first section)
      if (section.id !== template.sections[0].id) {
        const hr = document.createElement('hr');
        sectionEl.parentNode.insertBefore(hr, sectionEl);
      }
    });
  }
}
