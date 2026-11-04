window.MmdCreateContinueGuidance = function (React, JSX, validators) {
  var E = validators.E, D = validators.D, C = validators.C, T = validators.T;
  var fieldLabels = { w05a: "Pancreatitis history", w05b: "Pancreatitis details", w05j: "Current severe symptoms", w05e: "MTC history", w05f: "MEN2 history", w05g: "Type 1 diabetes", w05h: "Insulin or sulfonylurea use", w05i: "Diabetic retinopathy", w06d: "Smoking or vaping", w05BpControl: "Blood pressure control", w05OtherDetails: "Other condition details", w06: "Current reproductive health", w28Other: "Other exercise details" };
  function item(label, selector, fieldLabel) { return { label: label, selector: selector || "", fieldLabel: fieldLabel || "" }; }
  function field(label, display) { return item(display || label, "", label); }
  function describe(screen, answers, options) {
    options = options || {};
    if (!screen || options.enabled) return [];
    if (options.submitting) return [item("Submitting your intake. Please wait.")];
    if (options.uploadBusy) return [item("Uploading your file. Please wait.")];
    var missing = [];
    if (screen.type === "identity") {
      var targets = { "First name": field("First name"), "Last name": field("Last name"), "Date of birth": item("Date of birth", ".dob-field"), "State": field("Your state", "State"), "Email address": field("Email address"), "Mobile number": field("Mobile number"), "Mobile number verification": item("Mobile number verification", 'section[aria-labelledby="mmd-phone-verification-title"]'), "Terms of Service and Privacy Policy acceptance": item("Terms of Service and Privacy Policy acceptance", "#w-terms"), "Clinical review confirmation": item("Clinical review confirmation", "#mmd-free-intake-ack"), "Signed forms": item("Signed forms") };
      return (options.missingDetails || []).map(function (label) { return targets[label] || item(label); });
    }
    if (screen.type === "signForms") {
      var signing = options.signing || {};
      (signing.documents || []).forEach(function (document) { missing.push(item(document.title, "#mmd-sign-forms-" + document.id)); });
      if (signing.name) missing.push(item("Full name", ".sign-forms-field-name"));
      if (signing.electronic) missing.push(item("Electronic signature agreement", ".sign-forms-electronic-agreement"));
      if (signing.signature) missing.push(item("Your signature", ".sign-forms-signature-pad"));
      return missing.length ? missing : [item("Please complete your signature and required consent to continue.", ".sign-forms")];
    }
    if (screen.type === "measure") {
      if (!D(answers.ft, 3, 8)) missing.push(field("Feet", "Height (feet)"));
      if (!D(answers.inch, 0, 11)) missing.push(field("Inches", "Height (inches)"));
      if (!D(answers.lb, 50, 1000)) missing.push(field("Weight (lb)"));
    } else if (screen.type === "shippingAddress") {
      if (!E(answers.wAddressLine1)) missing.push(item("Street address", "#wAddressLine1"));
      if (!E(answers.wAddressCity)) missing.push(item("City", "#wAddressCity"));
      if (!E(answers.state) || !validators.ae(answers.state)) missing.push(item("State", "#wAddressState"));
      if (!/^\d{5}$/.test(String(answers.wAddressZip || ""))) missing.push(item("5-digit ZIP code", "#wAddressZip"));
    } else if (screen.type === "treatmentInterest" || screen.type === "drugs") {
      missing.push(item("Please choose a treatment option to continue.", ".treatment-interest"));
    } else if (screen.type === "choice") {
      var chosen = answers[screen.id], hasAnswer = C(screen) ? Array.isArray(chosen) && chosen.length > 0 : E(chosen);
      var validOptions = (screen.options || []).map(function (option) { return option.value; });
      if (["w05", "w28", "w14"].indexOf(screen.id) !== -1 && hasAnswer) {
        var values = Array.isArray(chosen) ? chosen : [chosen];
        hasAnswer = values.every(function (value) { return typeof value === "string" && validOptions.indexOf(value) !== -1; }) && !(values.indexOf("none") !== -1 && values.length > 1);
      }
      if (screen.id === "w14" && typeof chosen !== "string") hasAnswer = false;
      if (!hasAnswer) missing.push(item(C(screen) ? "Please choose at least one answer to continue." : "Please choose an answer to continue.", "main.stage > .choices"));
      if (screen.id === "w14" && hasAnswer && chosen !== "male") {
        var follow = (screen.follow_up_fields || []).filter(function (f) { return f.id === "w06"; })[0];
        var values = Array.isArray(answers.w06) ? answers.w06 : [], allowed = (follow && follow.options || []).map(function (o) { return o.value; });
        if (!values.length || !values.every(function (v) { return typeof v === "string" && allowed.indexOf(v) !== -1; }) || (values.indexOf("none") !== -1 && values.length > 1)) missing.push(item(fieldLabels.w06, '[data-mmd-field="w06"]'));
      }
      if (screen.id === "w28" && hasAnswer && Array.isArray(chosen) && chosen.indexOf("other") !== -1 && !E(answers.w28Other)) missing.push(item(fieldLabels.w28Other, '[data-mmd-field="w28Other"]'));
    } else if (["safetyGI", "safetyEndocrine", "safetyDiabetes", "pregnancyGroup", "healthBasics", "conditionDetails"].indexOf(screen.type) !== -1) {
      (screen.fields || []).forEach(function (f) {
        if (!T(f, answers) || f.required === false || f.required === undefined) return;
        var value = answers[f.id], valid = C(f) ? Array.isArray(value) && value.length > 0 : E(value);
        if (!valid) missing.push(item(fieldLabels[f.id] || f.question || "Required answer", '[data-mmd-field="' + f.id + '"]'));
      });
    } else if (screen.type === "repeatMeds" || screen.type === "allergy") {
      var rows = Array.isArray(answers[screen.id]) ? answers[screen.id] : [{ name: "", detail: "" }];
      var allergy = screen.type === "allergy";
      if (!rows.length) missing.push(item(allergy ? "Please add your allergy and reaction." : "Please add your medication name and dosage.", ".repeat"));
      rows.forEach(function (row, index) {
        row = row && typeof row === "object" ? row : {};
        var prefix = rows.length > 1 ? (allergy ? "Allergy " : "Medication ") + (index + 1) + ": " : "";
        if (!String(row.name || "").trim()) missing.push(item(prefix + (allergy ? "Allergy or reaction" : "Medication name"), ".repeat-item:nth-child(" + (index + 1) + ") .field:nth-child(1)"));
        if (!String(row.detail || "").trim()) missing.push(item(prefix + (allergy ? "Reaction type" : "Dosage"), ".repeat-item:nth-child(" + (index + 1) + ") .field:nth-child(2)"));
      });
    } else if (["number", "text", "short", "month", "date"].indexOf(screen.type) !== -1) {
      missing.push(field(screen.question_text, screen.type === "number" ? "Please enter a valid weight (50–1,000 lb)." : "Please fill in the highlighted field to continue."));
    }
    return missing.length ? missing : [item("Please complete the highlighted answer to continue.", "main.stage > .choices, main.stage > .field")];
  }
  function signingState() {
    var root = document.querySelector(".sign-forms");
    if (!root) return {};
    var ids = [];
    try { ids = JSON.parse(root.getAttribute("data-mmd-missing-documents") || "[]"); } catch (_) {}
    return { name: root.getAttribute("data-mmd-missing-name") === "true", signature: root.getAttribute("data-mmd-missing-signature") === "true", electronic: root.getAttribute("data-mmd-missing-e-sign") === "true", documents: (window.MmdSignFormDocuments || []).filter(function (doc) { return ids.indexOf(doc.id) !== -1; }) };
  }
  function Guidance(props) {
    var state = React.useState({}), signing = state[0], setSigning = state[1];
    React.useEffect(function () {
      if (props.screen.type !== "signForms") return;
      var root = document.querySelector(".sign-forms");
      function update() { var next = signingState(); setSigning(function (old) { return JSON.stringify(old) === JSON.stringify(next) ? old : next; }); }
      update();
      if (!root) return;
      var observer = new MutationObserver(update);
      observer.observe(root, { attributes: true, attributeFilter: ["data-mmd-missing-name", "data-mmd-missing-signature", "data-mmd-missing-e-sign", "data-mmd-missing-documents"] });
      return function () { observer.disconnect(); };
    }, [props.screen.id, props.formsReady]);
    var items = describe(props.screen, props.answers, { enabled: !props.blocked, submitting: props.submitting, uploadBusy: props.uploadBusy, missingDetails: props.missingDetails, signing: signing });
    var key = JSON.stringify(items);
    React.useEffect(function () {
      var marked = [];
      items.forEach(function (missing) {
        var targets = [];
        if (missing.selector) targets = Array.from(document.querySelectorAll(missing.selector));
        else if (missing.fieldLabel) targets = Array.from(document.querySelectorAll("main.stage .field")).filter(function (label) { var first = label.querySelector("span"); return first && first.textContent.trim().replace(/\s*\*$/, "") === missing.fieldLabel; });
        targets.forEach(function (target) {
          var box = target.matches("input,select,textarea") ? target.closest(".field,.checkline,.sign-forms-document") || target : target;
          if (marked.some(function (entry) { return entry.box === box; })) return;
          var controls = Array.from(box.querySelectorAll("input:not([readonly]),select,textarea,canvas"));
          if (box.matches("input,select,textarea,canvas")) controls.push(box);
          var records = controls.map(function (control) { var oldInvalid = control.getAttribute("aria-invalid"), oldDescription = control.getAttribute("aria-describedby"); control.setAttribute("aria-invalid", "true"); control.setAttribute("aria-describedby", ((oldDescription || "") + " mmd-continue-guidance").trim()); return { control: control, invalid: oldInvalid, description: oldDescription }; });
          var oldMark = box.getAttribute("data-mmd-missing"); box.setAttribute("data-mmd-missing", "true"); marked.push({ box: box, oldMark: oldMark, records: records });
        });
      });
      return function () { marked.forEach(function (entry) { if (entry.oldMark === null) entry.box.removeAttribute("data-mmd-missing"); else entry.box.setAttribute("data-mmd-missing", entry.oldMark); entry.records.forEach(function (r) { if (r.control.getAttribute("aria-invalid") === "true") { if (r.invalid === null) r.control.removeAttribute("aria-invalid"); else r.control.setAttribute("aria-invalid", r.invalid); } var current = r.control.getAttribute("aria-describedby") || ""; if (current.indexOf("mmd-continue-guidance") !== -1) { if (r.description === null) r.control.removeAttribute("aria-describedby"); else r.control.setAttribute("aria-describedby", r.description); } }); }); };
    }, [props.screen.id, key]);
    if (!props.blocked || !items.length) return null;
    var simple = items.length === 1 && /^(Please |Uploading |Submitting )/.test(items[0].label);
    return JSX.jsxs("div", { id: "mmd-continue-guidance", className: "patient-submit-missing intake-continue-guidance", role: "status", "aria-live": "polite", children: simple ? [JSX.jsx("p", { children: items[0].label })] : [JSX.jsx("p", { children: "Almost there - please fill in:" }), JSX.jsx("ul", { children: items.map(function (missing, index) { return JSX.jsx("li", { children: missing.label }, String(index) + missing.label); }) })] });
  }
  Guidance.describe = describe;
  return Guidance;
};
