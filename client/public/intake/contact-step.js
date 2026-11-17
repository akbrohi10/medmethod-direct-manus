window.MmdCareUsPhone = function (value) {
  var phone = String(value || "").trim(), compact = phone.replace(/[\s().-]/g, "");
  return /^[\d\s().+-]+$/.test(phone) && /^(?:\+?1)?[2-9]\d{2}[2-9]\d{6}$/.test(compact);
};
window.MmdCreateContactStep = function (React, JSX, helpers) {
  function legal(text, href) { return JSX.jsx("a", { className: "legal-link", href: href, target: "_blank", rel: "noopener", onClick: function (e) { e.stopPropagation(); }, children: text }); }
  function Contact(props) {
    var answers = props.answers, update = props.onValue;
    var state = React.useState(false), details = state[0], setDetails = state[1];
    return JSX.jsxs("div", { className: "form mmd-contact-form", "data-hj-suppress": "true", children: [
      JSX.jsx(helpers.Field, { label: "First name", value: answers.first, onChange: function (v) { update("first", v); } }),
      JSX.jsx(helpers.Field, { label: "Last name", value: answers.last, onChange: function (v) { update("last", v); } }),
      JSX.jsx(helpers.BirthDate, { answers: answers, onValue: update, whyAsk: props.screen.why_ask }),
      JSX.jsxs("label", { className: "field full", children: [JSX.jsx("span", { children: "Your state" }), JSX.jsxs("select", { value: String(answers.state || ""), onChange: function (e) { update("state", e.target.value); }, children: [JSX.jsx("option", { value: "", children: "Select your state" }), helpers.states.map(function (name) { return JSX.jsx("option", { children: name }, name); })] })] }),
      JSX.jsx(helpers.Field, { label: "Email address", type: "email", value: answers.email, onChange: function (v) { update("email", v); }, full: true, placeholder: "you@example.com" }),
      JSX.jsx(helpers.Field, { label: "Mobile number", type: "tel", value: answers.phone, onChange: function (v) { update("phone", v); }, full: true, placeholder: "(555) 555-5555" }),
      JSX.jsx("p", { className: "field-help full", children: "We'll confirm your number with our first text after you submit." }),
      JSX.jsxs("aside", { className: "mmd-text-price-reminder full", children: [JSX.jsx("span", { className: "mmd-price-chat", "aria-hidden": true, children: JSX.jsx("svg", { viewBox: "0 0 24 24", width: 20, height: 20, fill: "none", stroke: "currentColor", strokeWidth: 1.5, children: JSX.jsx("path", { d: "M21 11a8 8 0 0 1-8 8H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4ZM7 8h10M7 12h7" }) }) }), JSX.jsxs("div", { children: [JSX.jsx("strong", { children: "Your text visit: $29" }), JSX.jsx("p", { children: "Includes Dr. Al-Deek's review and 7 days of follow-up messaging. Full refund if you're not a candidate." })] })] }),
      JSX.jsxs("div", { className: "checkline terms-checkline full mmd-care-sms-checkline", children: [JSX.jsx("input", { id: "w-sms-opt-in", type: "checkbox", checked: answers.smsOptIn === true, onChange: function (e) { update("smsOptIn", e.target.checked); } }), JSX.jsxs("div", { className: "mmd-care-sms-copy", children: [JSX.jsx("label", { htmlFor: "w-sms-opt-in", children: "Yes, text me about my care, including appointment reminders and health information like lab results." }), " ", JSX.jsx("button", { type: "button", className: "mmd-sms-details-toggle", "aria-expanded": details, "aria-controls": "mmd-sms-details", onClick: function () { setDetails(!details); }, children: details ? "Hide details" : "Details" }), JSX.jsxs("p", { id: "mmd-sms-details", className: "mmd-sms-details", hidden: !details, children: ["Texts aren't encrypted. Msg frequency varies; msg & data rates may apply. Reply STOP to opt out, HELP for help. ", legal("Terms of Service", "https://medmethoddirect.com/terms"), " · ", legal("Privacy Policy", "https://medmethoddirect.com/privacy-policy")] })] })] }),
      JSX.jsxs("div", { className: "checkline terms-checkline full mmd-combined-agreements", children: [JSX.jsx("input", { id: "w-terms", type: "checkbox", checked: answers.terms === true && answers.checkoutAck === true, onChange: function (e) { update("terms", e.target.checked); update("checkoutAck", e.target.checked); } }), JSX.jsxs("label", { htmlFor: "w-terms", children: ["I confirm my information is accurate and agree to the ", legal("Terms of Service", "https://medmethoddirect.com/terms"), ", ", legal("Privacy Policy", "https://medmethoddirect.com/privacy-policy"), " and ", JSX.jsx("a", { className: "legal-link", href: "#", onClick: function (e) { e.preventDefault(); e.stopPropagation(); props.onReadTelehealth(); }, children: "Consent to Telehealth" }), "."] })] })
    ] });
  }
  return Contact;
};
