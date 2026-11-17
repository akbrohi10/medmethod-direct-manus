window.MmdCreateActionDock = function (React, JSX) {
  return function ActionDock(props) {
    var own = React.useRef(null), state = React.useState(null), view = state[0], setView = state[1];
    React.useLayoutEffect(function () {
      var panel = props.panel.current; if (!panel) return;
      var frame = 0, stopped = false;
      function update() {
        cancelAnimationFrame(frame); frame = requestAnimationFrame(function () {
          if (stopped || !own.current) return;
          var primary = panel.querySelector(".footer button.primary, #mmd-start-assessment"), skip = panel.querySelector(".footer button.shipping-skip");
          if (!primary) { setView(null); return; }
          var viewport = window.visualViewport, rect = panel.getBoundingClientRect(), height = own.current.offsetHeight || (skip ? 134 : 86), mobile = window.innerWidth < 1024;
          var bottom = (viewport ? viewport.offsetTop + viewport.height : window.innerHeight), top = mobile ? bottom - height : Math.max(64, Math.min(rect.bottom - height, bottom - height - 12));
          var next = { label: primary.textContent.trim(), disabled: primary.disabled, skip: !!skip, skipDisabled: !!skip && skip.disabled, style: { left: mobile ? 0 : rect.left, top: top, width: mobile ? document.documentElement.clientWidth : rect.width } };
          setView(function (old) { return JSON.stringify(old) === JSON.stringify(next) ? old : next; });
          var clearance = height + "px"; if (panel.style.getPropertyValue("--mmd-action-clearance") !== clearance) panel.style.setProperty("--mmd-action-clearance", clearance);
          if (document.documentElement.style.getPropertyValue("--mmd-action-clearance") !== clearance) document.documentElement.style.setProperty("--mmd-action-clearance", clearance);
          var active = document.activeElement;
          var typing = mobile && viewport && viewport.height < window.innerHeight - 120 && active && panel.contains(active) && active.matches("input,textarea,select");
          var keyboardSpace = typing ? Math.max(0, window.innerHeight - bottom) + height + 24 + "px" : "0px";
          if (document.documentElement.style.getPropertyValue("--mmd-keyboard-space") !== keyboardSpace) document.documentElement.style.setProperty("--mmd-keyboard-space", keyboardSpace);
          if (typing) {
            var input = active.getBoundingClientRect();
            if (input.bottom > top - 18) window.scrollBy({ top: input.bottom - top + 24, behavior: "auto" });
          }
        });
      }
      var mutation = new MutationObserver(update); mutation.observe(panel, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["disabled"] });
      var resize = new ResizeObserver(update); resize.observe(panel); if (own.current) resize.observe(own.current);
      window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); window.visualViewport && window.visualViewport.addEventListener("resize", update); window.visualViewport && window.visualViewport.addEventListener("scroll", update); update();
      return function () { stopped = true; cancelAnimationFrame(frame); mutation.disconnect(); resize.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); window.visualViewport && window.visualViewport.removeEventListener("resize", update); window.visualViewport && window.visualViewport.removeEventListener("scroll", update); panel.style.removeProperty("--mmd-action-clearance"); document.documentElement.style.removeProperty("--mmd-action-clearance"); document.documentElement.style.removeProperty("--mmd-keyboard-space"); };
    }, [props.panel]);
    function native(selector) { var node = props.panel.current && props.panel.current.querySelector(selector); if (node && !node.disabled) node.click(); }
    return JSX.jsxs("div", { ref: own, className: "mmd-action-dock", style: view ? view.style : { visibility: "hidden" }, "aria-label": "Intake actions", children: [view && view.skip && JSX.jsx("button", { className: "mmd-dock-skip", type: "button", disabled: view.skipDisabled, onPointerDown: function (e) { e.preventDefault(); }, onClick: function () { native(".footer button.shipping-skip"); }, children: "Skip for now" }), JSX.jsx("button", { className: "primary mmd-dock-primary", type: "button", disabled: view ? view.disabled : true, onPointerDown: function (e) { e.preventDefault(); }, onClick: function () { native(".footer button.primary, #mmd-start-assessment"); }, children: view ? view.label : "Continue" })] });
  };
};
