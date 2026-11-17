window.MmdCreateSignForms = function (l, M) {
  var typed = window.MmdTypedSignature;
  function easternDate(value) { return new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", month: "2-digit", day: "2-digit", year: "numeric" }).format(new Date(value)); }
  function Content(props) { return M.jsx("div", { className: "sign-forms-document-copy", children: props.content.map(function (block, index) { return M.jsx(block.tag || "p", { children: block.items ? block.items.map(function (item, i) { return M.jsx("li", { children: item }, i); }) : block.text || "" }, index); }) }); }
  function Sample(props) {
    var wrap = l.useRef(null), text = l.useRef(null);
    l.useEffect(function () {
      function fit() { if (!wrap.current || !text.current) return; var size = 32, limit = Math.max(1, wrap.current.clientWidth - 2); text.current.style.fontSize = size + "px"; for (var i = 0; i < 8; i++) { var natural = text.current.getBoundingClientRect().width; if (natural <= limit) break; size *= limit / natural * 0.98; text.current.style.fontSize = size + "px"; } }
      fit(); var observer = new ResizeObserver(fit); if (wrap.current) observer.observe(wrap.current); return function () { observer.disconnect(); };
    }, [props.name, props.style.id]);
    return M.jsx("span", { ref: wrap, className: "typed-signature-sample", "data-hj-suppress": "true", children: M.jsx("span", { ref: text, style: { fontFamily: '"' + props.style.family + '"', fontWeight: props.style.weight }, children: props.name }) });
  }
  function SignForms(props) {
    var documents = Array.isArray(props.documents) ? props.documents : [];
    var nameState = l.useState(props.patientName || ""), value = nameState[0], setName = nameState[1];
    var agreedState = l.useState(true), agreed = agreedState[0], setAgreed = agreedState[1];
    var relationState = l.useState(""), relation = relationState[0], setRelation = relationState[1];
    var relationOpen = l.useState(false), showRelation = relationOpen[0], setShowRelation = relationOpen[1];
    var openState = l.useState({}), open = openState[0], setOpen = openState[1];
    var choiceState = l.useState(null), choice = choiceState[0], setChoice = choiceState[1];
    var fontsState = l.useState(null), fonts = fontsState[0], setFonts = fontsState[1];
    var imageState = l.useState(null), image = imageState[0], setImage = imageState[1];
    var failedState = l.useState(false), renderFailed = failedState[0], setRenderFailed = failedState[1];
    var dateState = l.useState(Date.now()), today = dateState[0], setToday = dateState[1];
    var nameRef = l.useRef(null), allRef = l.useRef(null), stylesRef = l.useRef(null), signedAt = l.useRef(null), callbacks = l.useRef(props), lastAttempt = l.useRef(0), lastFontEvent = l.useRef(false), edited = l.useRef(false);
    callbacks.current = props;
    var normalized = typed.name(value), validName = typed.valid(value), attempted = Number(props.validationAttempt || 0) > 0;
    var available = fonts ? typed.styles.filter(function (style, index) { return fonts[index]; }) : [];
    var hasStyle = choice !== null && available.some(function (style) { return style.id === choice; });
    var hasSignature = !!image && image.name === normalized && image.style === choice;
    var ready = documents.length === 5 && agreed && validName && hasStyle && hasSignature;
    function invalidate() { signedAt.current = null; if (callbacks.current.onSigningChange) callbacks.current.onSigningChange(null); if (callbacks.current.onReadyChange) callbacks.current.onReadyChange(false); }
    function updateName(next) { edited.current = true; invalidate(); setName(next); }
    l.useEffect(function () { if (!edited.current) setName(props.patientName || ""); }, [props.patientName]);
    l.useEffect(function () {
      var active = true; typed.load().then(function (loaded) { if (!active) return; setFonts(loaded); if (loaded.some(function (ok) { return !ok; }) && !lastFontEvent.current) { lastFontEvent.current = true; typed.event("font_load_failed", props.demoMode); } });
      return function () { active = false; };
    }, []);
    l.useEffect(function () { var timer = window.setInterval(function () { setToday(Date.now()); }, 60000); return function () { window.clearInterval(timer); }; }, []);
    l.useEffect(function () {
      if (!validName || !fonts || !available.length) { setImage(null); return; }
      var selected = hasStyle ? choice : available[0].id;
      if (choice !== selected) { setChoice(selected); return; }
      try { setImage(typed.render(normalized, selected, fonts)); setRenderFailed(false); }
      catch (_) { setImage(null); setRenderFailed(true); typed.event("render_failed", props.demoMode); }
    }, [normalized, validName, fonts, choice]);
    l.useEffect(function () {
      var cb = callbacks.current;
      if (cb.onGlpConsentChange) cb.onGlpConsentChange(agreed);
      if (!ready) { if (cb.onSigningChange) cb.onSigningChange(null); if (cb.onReadyChange) cb.onReadyChange(false); return; }
      if (!signedAt.current) signedAt.current = new Date().toISOString();
      if (cb.onSigningChange) cb.onSigningChange({ version: "2026-10", signer_name: normalized, typed_name: normalized, relation: relation.trim(), signed_at: signedAt.current, document_checks: { glp1: true, general: true, telehealth: true, privacy: true, policy: true }, electronic_agreement: true, signature_png: image.png, signature_method: "typed", signature_style: choice });
      if (cb.onReadyChange) cb.onReadyChange(true);
    }, [ready, agreed, normalized, choice, image, relation]);
    l.useEffect(function () {
      var attempt = Number(props.validationAttempt || 0); if (attempt <= lastAttempt.current) return; lastAttempt.current = attempt;
      var target = !agreed ? allRef.current : !validName ? nameRef.current : stylesRef.current;
      if (!validName) typed.event("name_incomplete", props.demoMode); else if (!hasStyle) typed.event(fonts && !available.length ? "font_load_failed" : "no_style", props.demoMode); else if (renderFailed) typed.event("render_failed", props.demoMode);
      if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
    }, [props.validationAttempt]);
    var nameError = attempted && !validName, styleError = attempted && validName && (!hasStyle || !hasSignature), agreementError = attempted && !agreed;
    function error(message, id) { return M.jsxs("p", { id: id, className: "typed-sign-error", role: "alert", children: [M.jsx("span", { "aria-hidden": "true", children: "!" }), message] }); }
    return M.jsxs("section", { className: "sign-forms typed-sign-forms" + (normalized.length > 24 ? " typed-long-name" : ""), "data-hj-suppress": "true", "data-mmd-missing-name": !validName ? "true" : "false", "data-mmd-missing-signature": !hasSignature ? "true" : "false", "data-mmd-missing-e-sign": !agreed ? "true" : "false", "data-mmd-missing-documents": "[]", children: [
      M.jsxs("fieldset", { className: "sign-forms-documents", children: [M.jsx("legend", { children: "Documents" }), M.jsx("div", { className: "sign-forms-document-list", children: documents.map(function (doc) { var id = "mmd-document-" + doc.id; return M.jsxs("section", { className: "sign-forms-document", children: [M.jsxs("button", { className: "sign-forms-document-toggle", type: "button", "aria-expanded": !!open[doc.id], "aria-controls": id, onClick: function () { setOpen(function (previous) { var next = Object.assign({}, previous); next[doc.id] = !previous[doc.id]; return next; }); }, children: [M.jsx("span", { className: "document-name", children: doc.title }), M.jsx("span", { className: "document-read-label", children: open[doc.id] ? "Close" : "Tap to read" })] }), M.jsx("div", { id: id, className: "sign-forms-document-body", hidden: !open[doc.id], children: M.jsx(Content, { content: doc.content || [] }) })] }, doc.id); }) })] }),
      M.jsxs("div", { className: "sign-forms-electronic-agreement" + (agreementError ? " typed-has-error" : ""), children: [M.jsxs("label", { className: "sign-forms-checkline", children: [M.jsx("input", { ref: allRef, id: "mmd-sign-all-agreement", type: "checkbox", checked: agreed, "aria-invalid": agreementError || undefined, "aria-describedby": agreementError ? "mmd-sign-agreement-error" : undefined, onChange: function (e) { invalidate(); setAgreed(e.target.checked); } }), M.jsx("span", { children: "I've read and agree to all " + documents.length + " documents above, and I agree to sign electronically – my electronic signature is as valid as a handwritten one." })] }), agreementError && error("Please check this box to continue.", "mmd-sign-agreement-error")] }),
      M.jsxs("fieldset", { className: "sign-forms-signature-fields", children: [M.jsx("legend", { children: "Signature" }), M.jsxs("div", { className: "sign-forms-fields-grid", children: [M.jsxs("div", { className: "sign-forms-field sign-forms-field-name" + (nameError ? " typed-has-error" : ""), children: [M.jsx("label", { htmlFor: "mmd-sign-full-name", children: "Full name" }), M.jsx("input", { ref: nameRef, id: "mmd-sign-full-name", type: "text", autoComplete: "name", value: value, maxLength: 160, "data-hj-suppress": "true", "aria-invalid": nameError || undefined, "aria-describedby": nameError ? "mmd-sign-name-error" : undefined, onChange: function (e) { updateName(e.target.value); } }), nameError && error("Type your full first and last name to create your signature.", "mmd-sign-name-error")] }),
      M.jsxs("div", { className: "sign-forms-field sign-forms-field-date", children: [M.jsx("label", { htmlFor: "mmd-sign-date", children: "Date" }), M.jsx("input", { id: "mmd-sign-date", type: "text", value: easternDate(today), readOnly: true, "aria-readonly": "true" })] })] }),
      M.jsxs("div", { ref: stylesRef, tabIndex: -1, className: "typed-signature-options" + (styleError ? " typed-has-error" : ""), children: [M.jsx("h3", { id: "mmd-signature-title", children: "Your signature" }), !validName ? M.jsx("p", { className: "typed-signature-placeholder", children: "Enter your full name to create your signature." }) : !fonts ? M.jsx("p", { role: "status", children: "Preparing signature styles…" }) : !available.length ? M.jsxs("div", { children: [M.jsx("p", { role: "alert", children: "Signature fonts couldn't load. Please retry." }), M.jsx("button", { type: "button", className: "typed-retry", onClick: function () { setFonts(null); typed.load(true).then(setFonts); }, children: "Retry signature styles" })] }) : M.jsx("div", { className: "typed-signature-cards", role: "radiogroup", "aria-labelledby": "mmd-signature-title", children: available.map(function (style) { var selected = choice === style.id; return M.jsxs("button", { type: "button", role: "radio", "aria-checked": selected, className: "typed-signature-card" + (selected ? " is-selected" : ""), onClick: function () { if (choice !== style.id) { invalidate(); setChoice(style.id); } else if (renderFailed) { try { setImage(typed.render(normalized, style.id, fonts)); setRenderFailed(false); } catch (_) { typed.event("render_failed", props.demoMode); } } }, children: [M.jsx("span", { className: "typed-style-label", children: style.label }), M.jsx(Sample, { name: normalized, style: style }), M.jsx("span", { className: "typed-style-check", "aria-hidden": "true", children: selected ? "✓" : "○" })] }, style.id); }) }), M.jsx("p", { className: "typed-signature-helper", children: "This is your electronic signature. Tap a style to choose it." }), styleError && error(renderFailed ? "We couldn't create your signature. Please retry a style." : "Please choose a signature style.", "mmd-sign-style-error")] }),
      M.jsx("button", { className: "sign-for-other", type: "button", "aria-expanded": showRelation, "aria-controls": "mmd-sign-relation", onClick: function () { setShowRelation(!showRelation); }, children: "Signing for someone else?" }), showRelation && M.jsxs("div", { id: "mmd-sign-relation", className: "sign-forms-field", children: [M.jsx("label", { htmlFor: "mmd-sign-relation-input", children: "Relation to patient (Optional)" }), M.jsx("input", { id: "mmd-sign-relation-input", type: "text", value: relation, maxLength: 160, autoComplete: "off", "data-hj-suppress": "true", onChange: function (e) { invalidate(); setRelation(e.target.value); } })] })] })
    ] });
  }
  return SignForms;
};
