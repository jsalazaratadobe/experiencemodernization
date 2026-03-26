/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsBenefitParser from './parsers/cards-benefit.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsPromoParser from './parsers/cards-promo.js';
import cardsQuicklinksParser from './parsers/cards-quicklinks.js';
import cardsThumbnailParser from './parsers/cards-thumbnail.js';
import heroCampaignParser from './parsers/hero-campaign.js';
import heroProductParser from './parsers/hero-product.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/logitech-cleanup.js';
import sectionsTransformer from './transformers/logitech-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Logitech brand homepage with hero banners, product category showcases, and promotional content',
  urls: [
    'https://www.logitech.com/en-us',
  ],
  blocks: [
    {
      name: 'cards-quicklinks',
      instances: ['section.quick-links .layout'],
    },
    {
      name: 'hero-product',
      instances: ['section.hero-product-banner'],
    },
    {
      name: 'hero-campaign',
      instances: ['section.background-banner'],
    },
    {
      name: 'cards-promo',
      instances: ['div.card-grid .editorial-card'],
    },
    {
      name: 'cards-category',
      instances: [
        "section.standard-cards[aria-label*='popular product categories'] .carousel",
        "section.standard-cards[aria-label*='Shop by interest'] .carousel",
      ],
    },
    {
      name: 'cards-thumbnail',
      instances: ['div.block-spacing .grid-columns'],
    },
    {
      name: 'cards-benefit',
      instances: ['main div.max-width-padding.relative .grid.grid-cols-2'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Quick Links',
      selector: 'section.quick-links',
      style: null,
      blocks: ['cards-quicklinks'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Hero Product Banner',
      selector: 'section.hero-product-banner',
      style: null,
      blocks: ['hero-product'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Wellness Campaign Banner',
      selector: 'section.background-banner',
      style: 'teal-gradient',
      blocks: ['hero-campaign'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Product Cards Grid',
      selector: 'div.card-grid.parallax',
      style: null,
      blocks: ['cards-promo'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Popular Product Categories',
      selector: "section.standard-cards[aria-label*='popular product categories']",
      style: null,
      blocks: ['cards-category'],
      defaultContent: ["section.standard-cards[aria-label*='popular product categories'] h2:first-of-type"],
    },
    {
      id: 'section-6',
      name: 'Sustainability Section',
      selector: 'section.sustainability',
      style: 'dark',
      blocks: ['cards-category'],
      defaultContent: ["h2:contains('Design for sustainability')", "h2:contains('Everything matters')", "p:contains('When it comes to doing better')", "a[href*='everything-matters']"],
    },
    {
      id: 'section-7',
      name: 'Shop by Product Category',
      selector: 'div.max-width-padding.block-spacing:has(h2)',
      style: null,
      blocks: ['cards-thumbnail'],
      defaultContent: ["h2:contains('Shop by product category')"],
    },
    {
      id: 'section-8',
      name: 'Shop by Interest',
      selector: "section.standard-cards[aria-label*='Shop by interest']",
      style: null,
      blocks: ['cards-category'],
      defaultContent: ["section.standard-cards[aria-label*='Shop by interest'] h2:first-of-type"],
    },
    {
      id: 'section-9',
      name: 'Reasons to Buy',
      selector: "div.max-width-padding:has(h2:contains('Reasons to buy'))",
      style: null,
      blocks: ['cards-benefit'],
      defaultContent: ["h2:contains('Reasons to buy')", "p:contains('We are all about making')"],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'cards-benefit': cardsBenefitParser,
  'cards-category': cardsCategoryParser,
  'cards-promo': cardsPromoParser,
  'cards-quicklinks': cardsQuicklinksParser,
  'cards-thumbnail': cardsThumbnailParser,
  'hero-campaign': heroCampaignParser,
  'hero-product': heroProductParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null,
          });
        });
      } catch (e) {
        console.warn(`Block "${blockDef.name}" invalid selector: ${selector}`, e);
      }
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
