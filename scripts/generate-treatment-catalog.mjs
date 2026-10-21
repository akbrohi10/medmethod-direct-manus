import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const catalog = JSON.parse(readFileSync(new URL("../shared/treatmentCatalog.json", import.meta.url), "utf8"));
const output = new URL("../client/public/treatment-catalog.js", import.meta.url);

const source = `/* Generated from shared/treatmentCatalog.json. Do not hand-edit product names, prices, or supply terms here. */
(function (global) {
  "use strict";
  var catalog = ${JSON.stringify(catalog)};
  global.MMD_TREATMENT_CATALOG = catalog;

  function escapeHtml(value) {
    return String(value).replace(/[&<>'\"]/g, function (character) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\\\"": "&quot;" })[character];
    });
  }

  function renderWeightLossIntakeCatalog() {
    var target = document.querySelector("[data-shared-glp1-catalog]");
    if (!target) return;
    var lazyImages = target.getAttribute("data-catalog-image-loading") === "lazy";
    target.innerHTML = catalog.glp1.options.map(function (item) {
      var image = item.images.weightLossIntake;
      var supply = item.supply ? '<span class="medication-supply">' + escapeHtml(item.supply) + '</span>' : '';
      return '<article class="medication-card" data-treatment-id="' + escapeHtml(item.value) + '">' +
        '<div class="medication-card-name"><h3>' + escapeHtml(item.name) + '</h3></div>' +
        '<div class="medication-media ' + escapeHtml(item.value.replaceAll("_", "-")) + '"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.imageAlt || item.name) + '"' + (lazyImages ? ' loading="lazy" decoding="async"' : '') + '></div>' +
        '<div class="medication-price"><small>Price</small><strong>' + escapeHtml(item.price) + '</strong>' + supply + '</div>' +
        '<dl class="medication-specs"><dt>Frequency</dt><dd>' + escapeHtml(item.frequency) + '</dd><dt>Form</dt><dd>' + escapeHtml(item.form) + '</dd></dl>' +
        '<p class="medication-note">' + escapeHtml(item.note) + '</p>' +
      '</article>';
    }).join("");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderWeightLossIntakeCatalog, { once: true });
  else renderWeightLossIntakeCatalog();
})(window);
`;

writeFileSync(output, source, "utf8");
console.log(`Generated ${fileURLToPath(output)} from shared/treatmentCatalog.json`);
