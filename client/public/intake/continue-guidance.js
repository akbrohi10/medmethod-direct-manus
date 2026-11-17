window.MmdCreateContinueGuidance = function (React, JSX) {
  var ui = window.MmdIntakeUsability;
  function signingState() {
    var root = document.querySelector(".sign-forms"); if (!root) return {};
    var ids = []; try { ids = JSON.parse(root.getAttribute("data-mmd-missing-documents") || "[]"); } catch (_) {}
    return { name: root.getAttribute("data-mmd-missing-name") === "true", signature: root.getAttribute("data-mmd-missing-signature") === "true", electronic: root.getAttribute("data-mmd-missing-e-sign") === "true", documents: (window.MmdSignFormDocuments || []).filter(function (doc) { return ids.indexOf(doc.id) !== -1; }) };
  }
  function Guidance(props) {
    var state = React.useState({}), signing = state[0], setSigning = state[1];
    React.useEffect(function () {
      if (props.screen.type !== "signForms") return;
      var root = document.querySelector(".sign-forms");
      function update() { var next = signingState(); setSigning(function (old) { return JSON.stringify(old) === JSON.stringify(next) ? old : next; }); }
      update(); if (!root) return;
      var observer = new MutationObserver(update); observer.observe(root, { attributes: true, attributeFilter: ["data-mmd-missing-name", "data-mmd-missing-signature", "data-mmd-missing-e-sign", "data-mmd-missing-documents"] });
      return function () { observer.disconnect(); };
    }, [props.screen.id, props.formsReady]);
    var items = props.attempted ? ui.missing(props.screen, props.answers, { enabled: !props.blocked, submitting: props.submitting, uploadBusy: props.uploadBusy, missingDetails: props.missingDetails, signing: signing, demoMode: props.demoMode }) : [];
    var key = JSON.stringify(items), lastAttempt = React.useRef(0);
    React.useLayoutEffect(function () {
      var records = [];
      items.forEach(function (item, index) {
        if (props.screen.type === "signForms" && document.querySelector(".typed-sign-forms")) return;
        var target = ui.target(item); if (!target) return;
        var box = target.matches("input,select,textarea") ? target.closest(".field,.checkline,.sign-forms-document") || target.parentElement : target;
        var id = "mmd-field-message-" + props.screen.id + "-" + index, text = document.createElement("p"); text.className = "mmd-field-message"; text.id = id; text.setAttribute("data-hj-suppress", "true");
        var icon = document.createElement("span"); icon.setAttribute("aria-hidden", "true"); icon.textContent = "!"; text.appendChild(icon); text.appendChild(document.createTextNode(item.message));
        if (box.matches("button")) box.insertAdjacentElement("afterend", text); else if (["treatmentInterest", "repeatMeds", "allergy"].indexOf(props.screen.type) !== -1) box.insertBefore(text, box.firstChild); else box.appendChild(text);
        var controls = Array.from(box.querySelectorAll("input:not([readonly]),select,textarea,canvas,button.choice"));
        var prior = controls.map(function (control) { var invalid = control.getAttribute("aria-invalid"), description = control.getAttribute("aria-describedby"); control.setAttribute("aria-invalid", "true"); control.setAttribute("aria-describedby", ((description || "") + " " + id).trim()); return { control: control, invalid: invalid, description: description }; });
        var mark = box.getAttribute("data-mmd-missing"); box.setAttribute("data-mmd-missing", "true"); records.push({ box: box, mark: mark, text: text, controls: prior });
      });
      if (items.length && props.attempted !== lastAttempt.current) { ui.focus(items[0], true); ui.events(props.screen, items, props.demoMode); }
      lastAttempt.current = props.attempted;
      return function () { records.forEach(function (record) { record.text.remove(); if (record.mark === null) record.box.removeAttribute("data-mmd-missing"); else record.box.setAttribute("data-mmd-missing", record.mark); record.controls.forEach(function (p) { if (p.invalid === null) p.control.removeAttribute("aria-invalid"); else p.control.setAttribute("aria-invalid", p.invalid); if (p.description === null) p.control.removeAttribute("aria-describedby"); else p.control.setAttribute("aria-describedby", p.description); }); }); };
    }, [props.screen.id, key, props.attempted]);
    if (!items.length) return null;
    var multi = items.length > 1 || !!props.screen.fields || ["identity", "shippingAddress", "measure", "signForms", "glp1Group"].indexOf(props.screen.type) !== -1 || (props.screen.follow_up_fields || []).some(function (f) { return !!f.required; });
    return JSX.jsxs("div", { id: "mmd-continue-guidance", className: "mmd-validation-summary" + (multi ? "" : " mmd-validation-summary-single"), role: "alert", "aria-live": "assertive", "aria-atomic": true, "data-hj-suppress": true, children: [JSX.jsx("p", { children: multi ? "Almost there – please fill in:" : items[0].message }), multi && JSX.jsx("span", { className: "sr-only", children: items.map(function (item) { return item.message; }).join(" ") }), multi && JSX.jsx("ul", { children: items.map(function (item) { return JSX.jsx("li", { children: JSX.jsx("button", { type: "button", onClick: function () { ui.focus(item, false); }, children: item.label }) }, item.key); }) })] });
  }
  Guidance.describe = ui.missing;
  return Guidance;
};
