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
    var displayKey = target.getAttribute("data-catalog-display");
    var pageDisplay = displayKey === "weightLossIntake" ? catalog.glp1.pageDisplays?.weightLossIntake : null;
    target.innerHTML = catalog.glp1.options.map(function (item) {
      var display = pageDisplay && pageDisplay[item.value];
      var name = display ? display.name : item.name;
      var price = display ? display.price : item.price;
      var supplyText = display ? display.supply : item.supply;
      var image = item.images.weightLossIntake;
      var supply = supplyText ? '<span class="medication-supply">' + escapeHtml(supplyText) + '</span>' : '';
      var specs = display ? display.specs.map(function (spec) {
        return '<dt>' + escapeHtml(spec.label) + '</dt><dd>' + escapeHtml(spec.value) + '</dd>';
      }).join("") : '<dt>Frequency</dt><dd>' + escapeHtml(item.frequency) + '</dd><dt>Form</dt><dd>' + escapeHtml(item.form) + '</dd>';
      return '<article class="medication-card" data-treatment-id="' + escapeHtml(item.value) + '">' +
        '<div class="medication-card-name"><h3>' + escapeHtml(name) + '</h3></div>' +
        '<div class="medication-media ' + escapeHtml(item.value.replaceAll("_", "-")) + '"><img src="' + escapeHtml(image) + '" alt="' + escapeHtml(item.imageAlt || item.name) + '"' + (lazyImages ? ' loading="lazy" decoding="async"' : '') + '></div>' +
        '<div class="medication-price"><small>Price</small><strong>' + escapeHtml(price) + '</strong>' + supply + '</div>' +
        '<dl class="medication-specs">' + specs + '</dl>' +
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
