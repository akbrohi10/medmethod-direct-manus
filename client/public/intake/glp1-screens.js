window.MmdCreateGlp1Screens = function (React, JSX, original) {
  var historyIds = ["w16", "w17", "w32", "w18", "w19", "w20", "w21", "w22"];
  var preferenceIds = ["w34", "w35", "w36", "w37"];
  var allIds = historyIds.concat(preferenceIds);
  function isGroup(screen) { return !!screen && screen.type === "glp1Group"; }
  function ids(screen) { return screen.id === "w16" ? historyIds : preferenceIds; }
  function visible(screen, answers) {
    return ids(screen).map(function (id) { return original.questions("w").find(function (q) { return q.id === id; }); }).filter(function (question) {
      if (!question) return false;
      if (question.id === "w17" || question.id === "w32") return answers.w16 === "yes";
      if (["w19", "w20", "w21", "w22"].indexOf(question.id) !== -1) return answers.w18 === "yes";
      return true;
    });
  }
  function missing(screen, answers, demoMode) {
    return visible(screen, answers).filter(function (question) { return !original.validate(question, answers, demoMode); });
  }
  function combine(screens) {
    return screens.filter(function (screen) { return allIds.indexOf(screen.id) === -1 || screen.id === "w16" || screen.id === "w34"; }).map(function (screen) {
      if (screen.id !== "w16" && screen.id !== "w34") return screen;
      return Object.assign({}, screen, { type: "glp1Group", question_text: screen.id === "w16" ? "Your GLP-1 history" : "Your GLP-1 preferences", helper_text: null, glp1_question_ids: (screen.id === "w16" ? historyIds : preferenceIds).slice() });
    });
  }
  function clearHidden(screen, answers) {
    var next = Object.assign({}, answers);
    if (screen.id === "w16") {
      if (next.w16 !== "yes") ["w17", "w32"].forEach(function (id) { delete next[id]; });
      if (next.w18 !== "yes") ["w19", "w20", "w21", "w22"].forEach(function (id) { delete next[id]; });
    }
    return next;
  }
  function scrollQuestion(id, focus) {
    var node = document.getElementById("mmd-glp1-" + id);
    if (!node) return;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (focus) node.focus({ preventScroll: true });
    node.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }
  function focusMissing(screen, answers, demoMode) {
    var questions = missing(screen, answers, demoMode);
    if (questions.length) scrollQuestion(questions[0].id, true);
  }
  function Screen(props) {
    var questions = visible(props.screen, props.answers), previous = React.useRef(questions.map(function (q) { return q.id; }));
    var key = questions.map(function (q) { return q.id; }).join(","), previousScreen = React.useRef(props.screen.id);
    React.useEffect(function () {
      if (previousScreen.current !== props.screen.id) { previousScreen.current = props.screen.id; previous.current = questions.map(function (q) { return q.id; }); return; }
      var appeared = questions.filter(function (q) { return previous.current.indexOf(q.id) === -1; });
      previous.current = questions.map(function (q) { return q.id; });
      if (!appeared.length || !window.matchMedia("(max-width: 767px)").matches) return;
      var timer = window.setTimeout(function () { scrollQuestion(appeared[0].id, false); }, 100);
      return function () { window.clearTimeout(timer); };
    }, [key]);
    return JSX.jsx("div", { className: "glp1-questions", "data-hj-suppress": true, children: questions.map(function (question) {
      var incomplete = !original.validate(question, props.answers, props.demoMode);
      var follow = ["w17", "w32", "w19", "w20", "w21", "w22"].indexOf(question.id) !== -1;
      return JSX.jsxs("section", { id: "mmd-glp1-" + question.id, className: "glp1-question" + (follow ? " glp1-follow-up" : ""), "data-glp1-question": question.id, "data-mmd-missing": incomplete ? "true" : undefined, role: "group", "aria-label": question.question_text, tabIndex: -1, children: [
        question.type !== "text" && JSX.jsx("h2", { children: question.question_text }),
        question.helper_text && JSX.jsx("p", { className: "field-help", children: question.helper_text }),
        JSX.jsx(original.Question, Object.assign({}, props, { screen: question }))
      ] }, question.id);
    }) });
  }
  function Guidance(props) {
    var questions = missing(props.screen, props.answers, props.demoMode);
    if (!questions.length) return null;
    return JSX.jsxs("div", { id: "mmd-glp1-guidance", className: "patient-submit-missing glp1-guidance", role: "status", "aria-live": "polite", children: [
      JSX.jsx("p", { children: "Almost there - please answer:" }),
      JSX.jsx("ul", { children: questions.map(function (question) {
        return JSX.jsx("li", { children: JSX.jsx("button", { type: "button", className: "glp1-missing-link", onClick: function () { scrollQuestion(question.id, true); }, children: question.question_text }) }, question.id);
      }) })
    ] });
  }
  return { isGroup: isGroup, visible: visible, missing: missing, combine: combine, clearHidden: clearHidden, focusMissing: focusMissing, Screen: Screen, Guidance: Guidance };
};
