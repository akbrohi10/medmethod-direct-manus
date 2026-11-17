/* Presentation only. Intake questions, answers, validation and transport remain owned by the original app. */
window.MmdPremiumHeading = function (JSX, text) {
  if (typeof text !== "string" || !text.trim()) return text;
  var phrases = ["Dr. Al-Deek", "weight care", "treatment", "health history", "medical history", "GLP-1 history", "GLP-1 preferences", "weight loss", "shipping address", "meds shipped", "lab tests", "scale", "text you", "safety questions", "your goals", "medications", "allergies"];
  var lower = text.toLowerCase(), match, start;
  for (var i = 0; i < phrases.length; i++) {
    start = lower.indexOf(phrases[i].toLowerCase());
    if (start !== -1) { match = text.slice(start, start + phrases[i].length); break; }
  }
  if (!match) {
    var words = text.match(/\S+\s*$/);
    if (!words) return text;
    match = words[0]; start = text.lastIndexOf(match);
  }
  return JSX.jsxs("span", { children: [text.slice(0, start), JSX.jsx("em", { className: "premium-heading-accent", children: match }), text.slice(start + match.length)] });
};

window.MmdCreatePremiumIntake = function (React, JSX, Intake) {
  var portrait = "/assets/dr-jumana-al-deek-portrait.webp";
  function Icon(props) {
    var paths = { clock: "M12 8v4l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0", chat: "M21 11a8 8 0 0 1-8 8H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4ZM7 8h10M7 12h7", shield: "m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Zm-4 9 3 3 5-6", check: "m5 12 4 4L19 6" };
    return JSX.jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, children: JSX.jsx("path", { d: paths[props.name] || paths.check }) });
  }
  function DoctorRow() {
    return JSX.jsxs("div", { className: "premium-doctor-row", children: [
      JSX.jsx("img", { src: portrait, alt: "Dr. Jumana Al-Deek", width: 44, height: 44 }),
      JSX.jsxs("div", { children: [JSX.jsx("strong", { children: "Dr. Jumana Al-Deek, DO" }), JSX.jsxs("p", { children: ["Menopause Society Certified Practitioner · ", JSX.jsx("b", { children: "50,000+ patients seen" })] })] })
    ] });
  }
  function DoctorPanel() {
    return JSX.jsxs("aside", { className: "premium-doctor-panel", "aria-label": "Meet your doctor", children: [
      JSX.jsx("img", { className: "premium-doctor-portrait", src: portrait, alt: "Dr. Jumana Al-Deek, DO", width: 440, height: 600 }),
      JSX.jsxs("div", { className: "premium-doctor-caption", children: [JSX.jsx("p", { className: "premium-doctor-eyebrow", children: "YOUR CARE, PERSONALLY GUIDED" }), JSX.jsx("h2", { children: "Dr. Jumana Al-Deek, DO" }), JSX.jsx("p", { className: "premium-doctor-credential", children: "Menopause Society Certified Practitioner" }), JSX.jsxs("p", { className: "premium-doctor-stat", children: ["Dr. Al-Deek has seen ", JSX.jsx("strong", { children: "50,000+ patients" }), "."] })] })
    ] });
  }
  function Welcome(props) {
    var benefits = ["Dr. Al-Deek personally reviews your assessment", "Includes 7 days of follow-up messaging with your doctor", "A personalized weight care plan, including GLP-1 options if right for you", "Full refund if Dr. Al-Deek determines you're not a candidate"];
    return JSX.jsxs(React.Fragment, { children: [
      JSX.jsxs("header", { className: "top premium-welcome-header", children: [JSX.jsx("a", { className: "back", href: "https://www.medmethoddirect.com", "aria-label": "Back to MedMethod Direct", children: "←" }), JSX.jsx("span", { className: "step", children: "MedMethod Direct" }), JSX.jsx("a", { className: "help", href: "mailto:info@medmethoddirect.com", children: "Help" })] }),
      JSX.jsxs("main", { className: "premium-welcome stage", children: [
        JSX.jsx("p", { className: "eyebrow premium-welcome-eyebrow", children: "DOCTOR-GUIDED WEIGHT CARE" }),
        JSX.jsxs("h1", { children: ["Start your weight care visit with ", JSX.jsx("em", { className: "premium-heading-accent", children: "Dr. Al-Deek" })] }),
        JSX.jsx(DoctorRow, {}),
        JSX.jsxs("section", { className: "premium-price-card", "aria-label": "Text visit pricing", children: [
          JSX.jsxs("div", { className: "premium-price-top", children: [JSX.jsx("span", { children: "Text visit" }), JSX.jsxs("div", { children: [JSX.jsx("strong", { className: "premium-visit-price", children: "$29" }), JSX.jsx("span", { children: "one-time" })] })] }),
          JSX.jsx("ul", { className: "premium-visit-benefits", children: benefits.map(function (text) { return JSX.jsxs("li", { children: [JSX.jsx(Icon, { name: "check" }), JSX.jsx("span", { children: text })] }, text); }) }),
          JSX.jsx("p", { className: "premium-medication-note", children: "Medication costs are separate. You'll see options and prices before anything is prescribed." })
        ] }),
        JSX.jsx("div", { className: "premium-trust-chips", children: [["clock", "5–10 minutes"], ["chat", "Text your doctor directly"], ["shield", "Private & secure"]].map(function (item) { return JSX.jsxs("span", { children: [JSX.jsx(Icon, { name: item[0] }), item[1]] }, item[0]); }) }),
        JSX.jsx("button", { id: "mmd-start-assessment", className: "primary premium-start", type: "button", onClick: props.onStart, children: "Start my assessment" })
      ] })
    ] });
  }
  function PremiumIntake() {
    var state = React.useState(false), started = state[0], setStarted = state[1], right = React.useRef(null);
    var backState = React.useState(true), backDisabled = backState[0], setBackDisabled = backState[1];
    function begin() { setStarted(true); window.scrollTo({ top: 0, behavior: "auto" }); }
    React.useEffect(function () {
      if (!started || !right.current) return;
      var heading = right.current.querySelector(".stage h1");
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
      function syncBack() {
        var back = right.current && right.current.querySelector(".top .back");
        setBackDisabled(!back || back.disabled);
      }
      var observer = new MutationObserver(syncBack);
      observer.observe(right.current, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled"] });
      syncBack();
      return function () { observer.disconnect(); };
    }, [started]);
    function nativeAction(selector) {
      var control = right.current && right.current.querySelector(selector);
      if (control && !control.disabled) control.click();
    }
    return JSX.jsxs(React.Fragment, { children: [
      JSX.jsxs("header", { className: "top premium-global-header", children: [
        started ? JSX.jsx("button", { className: "back", type: "button", disabled: backDisabled, "aria-label": "Go back", onClick: function () { nativeAction(".top .back"); }, children: "←" }) : JSX.jsx("a", { className: "back", href: "https://www.medmethoddirect.com", "aria-label": "Back to MedMethod Direct", children: "←" }),
        JSX.jsx("span", { className: "step", children: "MedMethod Direct" }),
        started ? JSX.jsx("button", { className: "help", type: "button", onClick: function () { nativeAction(".top .help"); }, children: "Help" }) : JSX.jsx("a", { className: "help", href: "mailto:info@medmethoddirect.com", children: "Help" })
      ] }),
      JSX.jsxs("div", { className: "premium-layout", children: [JSX.jsx(DoctorPanel, {}), JSX.jsx("div", { className: "premium-form-panel", ref: right, children: started ? JSX.jsx(Intake, {}) : JSX.jsx(Welcome, { onStart: begin }) })] })
    ] });
  }
  window.MmdPremiumDoctorRow = DoctorRow;
  return PremiumIntake;
};
