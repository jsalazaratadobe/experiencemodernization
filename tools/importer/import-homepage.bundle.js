var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/cards-benefit.js
  function parse(element, { document }) {
    const cards = element.querySelectorAll(":scope > div");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img");
      const heading = card.querySelector("h3");
      const desc = card.querySelector(".rich-text p, .rich-text, p:not(:first-child)");
      const cta = card.querySelector("a[href]");
      if (!img && !heading) return;
      const imageCell = img || document.createElement("span");
      const textCell = document.createElement("div");
      if (heading) textCell.appendChild(heading);
      if (desc) {
        const p = desc.tagName === "P" ? desc : desc.querySelector("p") || desc;
        textCell.appendChild(p);
      }
      if (cta) textCell.appendChild(cta);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-benefit", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll('a.standard-card, a[class*="standard-card"]');
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("picture, img");
      const textCell = document.createElement("div");
      const heading = card.querySelector("h2");
      if (heading) {
        const headingText = heading.textContent.trim();
        if (card.href) {
          const h2 = document.createElement("h2");
          const a = document.createElement("a");
          a.href = card.href;
          a.textContent = headingText;
          h2.appendChild(a);
          textCell.appendChild(h2);
        } else {
          const h2 = document.createElement("h2");
          h2.textContent = headingText;
          textCell.appendChild(h2);
        }
      }
      if (img || textCell.childNodes.length > 0) {
        cells.push([img || document.createElement("span"), textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse3(element, { document }) {
    const cells = [];
    const img = element.querySelector("picture, img");
    const textCell = document.createElement("div");
    const heading = element.querySelector("h2, h3");
    if (heading) textCell.appendChild(heading);
    const desc = element.querySelector(".rich-text p, .rich-text");
    if (desc) {
      const p = desc.tagName === "P" ? desc : desc.querySelector("p");
      if (p) textCell.appendChild(p);
    }
    const cta = element.querySelector("a.cta-link, a[href]:not(.contents):not(.group)");
    if (cta) textCell.appendChild(cta);
    if (img || textCell.childNodes.length > 0) {
      cells.push([img || document.createElement("span"), textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklinks.js
  function parse4(element, { document }) {
    const links = element.querySelectorAll("a[href]");
    const cells = [];
    links.forEach((link) => {
      const img = link.querySelector("img");
      const caption = link.querySelector("figcaption");
      if (!img && !caption) return;
      const imageCell = img || document.createElement("span");
      const textCell = document.createElement("div");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = caption ? caption.textContent.trim() : link.textContent.trim();
      textCell.appendChild(a);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-quicklinks", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-thumbnail.js
  function parse5(element, { document }) {
    const links = element.querySelectorAll("a[href]");
    const cells = [];
    links.forEach((link) => {
      const img = link.querySelector("img");
      const label = link.querySelector("p, .text-body-16, figcaption");
      if (!img && !label) return;
      const imageCell = img || document.createElement("span");
      const textCell = document.createElement("div");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = label ? label.textContent.trim() : link.textContent.trim();
      textCell.appendChild(a);
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-thumbnail", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-campaign.js
  function parse6(element, { document }) {
    let bgImg = null;
    const bgEl = element.querySelector(".background.bg-image, .bg-image");
    if (bgEl) {
      const bgStyle = window.getComputedStyle(bgEl).backgroundImage;
      if (bgStyle && bgStyle !== "none") {
        const urlMatch = bgStyle.match(/url\(["']?(.*?)["']?\)/);
        if (urlMatch && urlMatch[1]) {
          bgImg = document.createElement("img");
          bgImg.src = urlMatch[1];
          bgImg.alt = "";
        }
      }
    }
    if (!bgImg) {
      bgImg = element.querySelector("picture, img");
    }
    const contentArea = element.querySelector(".content.grid, [data-layout]");
    const heading = (contentArea || element).querySelector("h2, h1");
    const descDiv = (contentArea || element).querySelector(".body-text, .rich-text");
    const description = descDiv ? descDiv.querySelector("p") || descDiv : null;
    const cta = (contentArea || element).querySelector("a[href]");
    const cells = [];
    if (bgImg) {
      cells.push([bgImg]);
    }
    const contentDiv = document.createElement("div");
    if (heading) contentDiv.appendChild(heading);
    if (description) contentDiv.appendChild(description);
    if (cta) contentDiv.appendChild(cta);
    if (contentDiv.childNodes.length > 0) {
      cells.push([contentDiv]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-campaign", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-product.js
  function parse7(element, { document }) {
    const image = element.querySelector("picture, img");
    const subtitle = element.querySelector("h2");
    const mainHeading = element.querySelector("h1");
    const priceContainer = element.querySelector(".flex.md\\:justify-start, .flex.flex-wrap.gap-x-2");
    let priceText = null;
    if (priceContainer) {
      priceText = document.createElement("p");
      priceText.textContent = priceContainer.textContent.trim().replace(/\s+/g, " ");
    }
    const cta = element.querySelector("a[href]");
    const cells = [];
    if (image) {
      cells.push([image]);
    }
    const contentDiv = document.createElement("div");
    if (subtitle) contentDiv.appendChild(subtitle);
    if (mainHeading) contentDiv.appendChild(mainHeading);
    if (priceText) contentDiv.appendChild(priceText);
    if (cta) contentDiv.appendChild(cta);
    if (contentDiv.childNodes.length > 0) {
      cells.push([contentDiv]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/logitech-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".nav-bg", ".nav-bg-overlay"]);
      WebImporter.DOMUtils.remove(element, ["#skip-link"]);
      WebImporter.DOMUtils.remove(element, [".toaster-msg"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, ["header.top-header", "header"]);
      WebImporter.DOMUtils.remove(element, [".sticky.z-30"]);
      WebImporter.DOMUtils.remove(element, ["#desktop-navigation"]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, ["noscript", "link", "iframe"]);
      element.querySelectorAll("[data-analytics-section]").forEach((el) => {
        el.removeAttribute("data-analytics-section");
      });
      element.querySelectorAll("[data-sveltekit-preload-data]").forEach((el) => {
        el.removeAttribute("data-sveltekit-preload-data");
      });
    }
  }

  // tools/importer/transformers/logitech-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function querySelectorWithContains(root, selector) {
    const containsMatch = selector.match(/:contains\(['"]([^'"]+)['"]\)/g);
    if (!containsMatch) {
      return root.querySelector(selector);
    }
    const textFilters = containsMatch.map((m) => {
      const inner = m.match(/:contains\(['"]([^'"]+)['"]\)/);
      return inner ? inner[1] : "";
    });
    let cleanSelector = selector;
    containsMatch.forEach((m) => {
      cleanSelector = cleanSelector.replace(m, "");
    });
    cleanSelector = cleanSelector.replace(/\s+/g, " ").trim();
    if (!cleanSelector || cleanSelector === "") {
      cleanSelector = "*";
    }
    try {
      const candidates = root.querySelectorAll(cleanSelector);
      for (const el of candidates) {
        const text = el.textContent || "";
        if (textFilters.every((filter) => text.includes(filter))) {
          return el;
        }
      }
    } catch (e) {
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          try {
            sectionEl = querySelectorWithContains(element, sel);
            if (sectionEl) break;
          } catch (e) {
          }
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Logitech brand homepage with hero banners, product category showcases, and promotional content",
    urls: [
      "https://www.logitech.com/en-us"
    ],
    blocks: [
      {
        name: "cards-quicklinks",
        instances: ["section.quick-links .layout"]
      },
      {
        name: "hero-product",
        instances: ["section.hero-product-banner"]
      },
      {
        name: "hero-campaign",
        instances: ["section.background-banner"]
      },
      {
        name: "cards-promo",
        instances: ["div.card-grid .editorial-card"]
      },
      {
        name: "cards-category",
        instances: [
          "section.standard-cards[aria-label*='popular product categories'] .carousel",
          "section.standard-cards[aria-label*='Shop by interest'] .carousel"
        ]
      },
      {
        name: "cards-thumbnail",
        instances: ["div.block-spacing .grid-columns"]
      },
      {
        name: "cards-benefit",
        instances: ["main div.max-width-padding.relative .grid.grid-cols-2"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Quick Links",
        selector: "section.quick-links",
        style: null,
        blocks: ["cards-quicklinks"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Hero Product Banner",
        selector: "section.hero-product-banner",
        style: null,
        blocks: ["hero-product"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Wellness Campaign Banner",
        selector: "section.background-banner",
        style: "teal-gradient",
        blocks: ["hero-campaign"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Product Cards Grid",
        selector: "div.card-grid.parallax",
        style: null,
        blocks: ["cards-promo"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Popular Product Categories",
        selector: "section.standard-cards[aria-label*='popular product categories']",
        style: null,
        blocks: ["cards-category"],
        defaultContent: ["section.standard-cards[aria-label*='popular product categories'] h2:first-of-type"]
      },
      {
        id: "section-6",
        name: "Sustainability Section",
        selector: "section.sustainability",
        style: "dark",
        blocks: ["cards-category"],
        defaultContent: ["h2:contains('Design for sustainability')", "h2:contains('Everything matters')", "p:contains('When it comes to doing better')", "a[href*='everything-matters']"]
      },
      {
        id: "section-7",
        name: "Shop by Product Category",
        selector: "div.max-width-padding.block-spacing:has(h2)",
        style: null,
        blocks: ["cards-thumbnail"],
        defaultContent: ["h2:contains('Shop by product category')"]
      },
      {
        id: "section-8",
        name: "Shop by Interest",
        selector: "section.standard-cards[aria-label*='Shop by interest']",
        style: null,
        blocks: ["cards-category"],
        defaultContent: ["section.standard-cards[aria-label*='Shop by interest'] h2:first-of-type"]
      },
      {
        id: "section-9",
        name: "Reasons to Buy",
        selector: "div.max-width-padding:has(h2:contains('Reasons to buy'))",
        style: null,
        blocks: ["cards-benefit"],
        defaultContent: ["h2:contains('Reasons to buy')", "p:contains('We are all about making')"]
      }
    ]
  };
  var parsers = {
    "cards-benefit": parse,
    "cards-category": parse2,
    "cards-promo": parse3,
    "cards-quicklinks": parse4,
    "cards-thumbnail": parse5,
    "hero-campaign": parse6,
    "hero-product": parse7
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
              section: blockDef.section || null
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
