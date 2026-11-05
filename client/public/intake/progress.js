window.MmdCreateIntakeProgress = function (React, JSX) {
  function welcome(screen, index) { return !!screen && (screen.type === "welcome" || screen.type === "start" || screen.type === "startScreen" || (screen.id === "w01" && index === 0)); }
  function eligible(screens) { return screens.filter(function (screen, index) { return !welcome(screen, index) && ["wReview", "planReview", "checkout", "consent"].indexOf(screen.type) === -1; }); }
  function section(screen, index) {
    if (index < 2) return "Getting started";
    if (["w30", "wShippingAddress", "wScalePhoto", "w38", "wSignForms", "w01", "w02"].indexOf(screen.id) !== -1) return "Final steps";
    if (screen.section === "Health history" || screen.id === "w04a") return "Health history";
    return "Your goals";
  }
  function project(previous, screen, screens, history, hidden) {
    var visible = eligible(screens), index = visible.findIndex(function (item) { return screen && item.id === screen.id; });
    if (hidden || index < 0) return null;
    var trail = history.filter(function (id) { return visible.some(function (item) { return item.id === id; }); }), depth = trail.length;
    var id = screen.id, percent, entries;
    if (previous && previous.id === id && previous.depth === depth) {
      percent = previous.percent;
      entries = previous.entries;
    } else if (previous && depth < previous.depth) {
      var known = previous.entries[depth];
      percent = known && known.id === id ? known.percent : 100 * (index + 1) / Math.max(1, visible.length);
      entries = previous.entries.slice(0, depth + 1);
    } else if (previous && depth > previous.depth && index > 0) {
      percent = previous.percent + (100 - previous.percent) / Math.max(1, visible.length - index);
      entries = previous.entries.slice(0, depth);
    } else {
      percent = 100 * (index + 1) / Math.max(1, visible.length);
      entries = previous ? previous.entries.slice(0, depth) : [];
    }
    if (index === visible.length - 1) percent = 100;
    percent = Math.max(0, Math.min(100, percent));
    entries = entries.slice();
    entries[depth] = { id: id, percent: percent };
    var rounded = Math.round(percent), late = rounded >= 75, last = index >= visible.length - 2;
    return { id: id, depth: depth, percent: percent, rounded: rounded, entries: entries, section: section(screen, index), label: last ? "Last step!" : (late ? "Almost there" : section(screen, index)) + " · " + rounded + "%", time: index === 0 ? "About 5-10 minutes" : late ? "About 1 minute left" : null };
  }
  function Progress(props) {
    var ledger = React.useRef(null), view = project(ledger.current, props.screen, props.screens, props.history, props.hidden);
    React.useLayoutEffect(function () { ledger.current = view; });
    if (!view) return null;
    return JSX.jsxs("section", { className: "mmd-progress-wrap", "aria-label": "Your intake progress", children: [
      JSX.jsxs("div", { className: "mmd-progress-inner", children: [
        JSX.jsx("p", { id: "mmd-progress-label", className: "mmd-progress-label", "aria-live": "polite", "aria-atomic": "true", children: view.label }),
        JSX.jsx("div", { className: "mmd-progress-track", role: "progressbar", "aria-labelledby": "mmd-progress-label", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": view.rounded, "aria-valuetext": view.section + ", " + view.rounded + "% complete" + (view.label === "Last step!" ? ", last step" : ""), children: JSX.jsx("span", { className: "mmd-progress-fill", style: { transform: "scaleX(" + view.percent / 100 + ")" } }) }),
        view.time && JSX.jsx("p", { className: "mmd-progress-time", children: view.time })
      ] })
    ] });
  }
  return { Progress: Progress, project: project, eligible: eligible, section: section, welcome: welcome };
};
