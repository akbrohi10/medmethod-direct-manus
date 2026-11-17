/* Intake-only typed signatures. Images remain in memory; no storage or provider calls. */
window.MmdTypedSignature = (function () {
  var styles = [
    { id: "dancing_script", family: "Mmd Dancing Script", label: "Style 1", weight: 500 },
    { id: "great_vibes", family: "Mmd Great Vibes", label: "Style 2", weight: 400 },
    { id: "homemade_apple", family: "Mmd Homemade Apple", label: "Style 3", weight: 400 }
  ];
  var fontPromise;
  function name(value) { return String(value || "").trim().replace(/\s+/g, " "); }
  function valid(value) { var parts = name(value).split(" "); return name(value).length <= 160 && parts.length >= 2 && parts.every(function (part) { return /\p{L}/u.test(part); }); }
  function event(reason, demo) {
    var query = new URLSearchParams(window.location.search);
    if (demo || ["prefill", "preview", "test", "is_test", "admin"].some(function (key) { return query.has(key); }) || window.self !== window.top || typeof window.hj !== "function" || ["name_incomplete", "no_style", "font_load_failed", "render_failed"].indexOf(reason) < 0) return;
    window.hj("event", "sign_error_" + reason);
  }
  function load(force) {
    if (force) fontPromise = null;
    if (!fontPromise) fontPromise = Promise.all(styles.map(function (style) {
      if (!document.fonts || typeof document.fonts.load !== "function") return Promise.resolve(false);
      return Promise.race([document.fonts.load(style.weight + ' 32px "' + style.family + '"').then(function (faces) { return faces.length > 0 && document.fonts.check(style.weight + ' 32px "' + style.family + '"'); }), new Promise(function (resolve) { window.setTimeout(function () { resolve(false); }, 8000); })]).catch(function () { return false; });
    }));
    return fontPromise;
  }
  function render(value, styleId, available) {
    var typedName = name(value), style = styles.find(function (item) { return item.id === styleId; });
    if (!valid(typedName) || !style || !available || available[styles.indexOf(style)] !== true) throw new Error("Signature is not ready");
    var canvas = document.createElement("canvas"); canvas.width = 1800; canvas.height = 420;
    var context = canvas.getContext("2d"); if (!context) throw new Error("Signature renderer unavailable");
    context.font = style.weight + ' 180px "' + style.family + '"';
    var width = context.measureText(typedName).width, size = Math.min(180, 180 * 1680 / Math.max(width, 1));
    context.font = style.weight + ' ' + size + 'px "' + style.family + '"';
    context.fillStyle = "#113E3A"; context.textAlign = "center"; context.textBaseline = "alphabetic";
    var metrics = context.measureText(typedName), ascent = metrics.actualBoundingBoxAscent || size, descent = metrics.actualBoundingBoxDescent || size * 0.3;
    if (ascent + descent > 360) { size *= 360 / (ascent + descent); context.font = style.weight + ' ' + size + 'px "' + style.family + '"'; metrics = context.measureText(typedName); ascent = metrics.actualBoundingBoxAscent || size; descent = metrics.actualBoundingBoxDescent || size * 0.3; }
    context.fillText(typedName, 900, (420 + ascent - descent) / 2);
    var pixels = context.getImageData(0, 0, canvas.width, canvas.height).data, ink = false;
    for (var i = 3; i < pixels.length; i += 4) { if (pixels[i] > 0) { ink = true; break; } }
    if (!ink) throw new Error("Signature is empty");
    return { name: typedName, style: styleId, png: canvas.toDataURL("image/png") };
  }
  return { styles: styles, name: name, valid: valid, load: load, render: render, event: event };
})();
