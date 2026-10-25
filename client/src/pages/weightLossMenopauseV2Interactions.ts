/** Same supplied interactions, with queries scoped to the React page and disposable resources. */
export function initializeWeightLossMenopauseV2(root: HTMLElement): () => void {
  const disposers: Array<() => void> = [];
  let disposed = false;
  function listen(target: EventTarget, event: string, callback: EventListener, options?: AddEventListenerOptions) {
    target.addEventListener(event, callback, options);
    disposers.push(() => target.removeEventListener(event, callback, options));
  }
  const tabs = Array.from(root.querySelectorAll<HTMLElement>(".feature-tab"));
  tabs.forEach(tab => listen(tab, "click", () => {
    tabs.forEach(item => item.setAttribute("aria-selected", "false"));
    root.querySelectorAll<HTMLElement>(".app-screen").forEach(screen => { screen.hidden = true; });
    tab.setAttribute("aria-selected", "true");
    const panel = root.querySelector<HTMLElement>(`#screen-${tab.dataset.screen}`);
    if (panel) panel.hidden = false;
  }));

  const medicationSection = root.querySelector(".medication-pricing");
  const medicationButtons = Array.from(root.querySelectorAll<HTMLElement>("[data-medication-choice]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-medication-panel]"));
  const glp1Copy = medicationSection?.querySelector<HTMLElement>("[data-glp1-price-copy]");
  const estimator = root.querySelector<HTMLElement>(".estimator-band");
  medicationButtons.forEach(button => listen(button, "click", () => {
    const choice = button.dataset.medicationChoice;
    medicationButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    panels.forEach(panel => { panel.hidden = panel.dataset.medicationPanel !== choice; });
    if (glp1Copy) glp1Copy.hidden = choice === "hrt";
    if (estimator) estimator.hidden = choice === "hrt";
    queueStickyUpdate();
  }));

  const sticky = root.querySelector<HTMLElement>(".sticky-cta");
  const stickyStart = root.querySelector<HTMLElement>(".hero-actions .btn");
  const stickyStop = root.querySelector<HTMLElement>(".privacy-band");
  let stickyFrame: number | null = null;
  function updateSticky() {
    stickyFrame = null;
    if (disposed || !sticky || !stickyStart || !stickyStop) return;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const startReached = stickyStart.getBoundingClientRect().bottom <= 0;
    const stopReached = stickyStop.getBoundingClientRect().top <= window.innerHeight * .78;
    const show = mobile && startReached && !stopReached;
    sticky.classList.toggle("is-visible", show);
    sticky.setAttribute("aria-hidden", String(!show));
  }
  function queueStickyUpdate() {
    if (!disposed && stickyFrame === null) stickyFrame = requestAnimationFrame(updateSticky);
  }
  listen(window, "scroll", queueStickyUpdate, { passive: true });
  listen(window, "resize", queueStickyUpdate);
  updateSticky();

  const slider = root.querySelector<HTMLInputElement>("#weight-estimate");
  const weightValue = root.querySelector<HTMLElement>("#weight-value");
  const estimatedLoss = root.querySelector<HTMLElement>("#estimated-loss");
  function updateEstimate() {
    if (!slider || !weightValue || !estimatedLoss) return;
    const weight = parseInt(slider.value, 10), min = parseInt(slider.min, 10), max = parseInt(slider.max, 10);
    weightValue.textContent = `${weight} lbs`;
    estimatedLoss.textContent = String(Math.round(weight * .2));
    slider.style.setProperty("--range-fill", `${((weight - min) / (max - min)) * 100}%`);
  }
  if (slider) { listen(slider, "input", updateEstimate); updateEstimate(); }

  const chat = root.querySelector<HTMLElement>("[data-live-chat]");
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-chat-at]"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timers: ReturnType<typeof setTimeout>[] = [];
  let loopTimer: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let observer: IntersectionObserver | null = null;
  function clearChatTimers() {
    timers.forEach(clearTimeout); timers = [];
    if (loopTimer !== null) clearTimeout(loopTimer);
    loopTimer = null;
  }
  function showAll() {
    clearChatTimers();
    items.forEach(item => { item.hidden = item.classList.contains("typing-bubble"); item.classList.remove("chat-pop"); });
    if (chat) chat.scrollTop = chat.scrollHeight;
  }
  function resetChat() {
    items.forEach(item => { item.hidden = true; item.classList.remove("chat-pop"); });
    if (chat) chat.scrollTop = 0;
  }
  function reveal(item: HTMLElement) {
    if (disposed || !chat) return;
    item.hidden = false; item.classList.remove("chat-pop"); void item.offsetWidth;
    item.classList.add("chat-pop");
    chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });
    const hide = parseInt(item.dataset.chatHide ?? "", 10);
    if (hide) timers.push(setTimeout(() => { item.hidden = true; }, hide));
  }
  function playChat() {
    if (!running || disposed) return;
    clearChatTimers(); resetChat();
    items.forEach(item => timers.push(setTimeout(() => { if (running) reveal(item); }, parseInt(item.dataset.chatAt ?? "0", 10))));
    loopTimer = setTimeout(playChat, 16500);
  }
  function updateMotion() {
    if (!chat || disposed) return;
    if (reduced.matches) { running = false; showAll(); }
    else if (!document.hidden && chat.getBoundingClientRect().top < window.innerHeight && chat.getBoundingClientRect().bottom > 0) { running = true; playChat(); }
  }
  if (chat) {
    listen(reduced, "change", updateMotion);
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (disposed || reduced.matches || document.hidden) return;
        if (entry.isIntersecting && !running) { running = true; playChat(); }
        else if (!entry.isIntersecting && running) { running = false; clearChatTimers(); }
      }), { threshold: .25 });
      observer.observe(chat);
    } else { running = true; playChat(); }
    listen(document, "visibilitychange", () => {
      if (document.hidden) { running = false; clearChatTimers(); }
      else updateMotion();
    });
    if (reduced.matches) showAll();
  }
  return () => {
    disposed = true; running = false;
    disposers.forEach(dispose => dispose());
    observer?.disconnect(); clearChatTimers();
    if (stickyFrame !== null) cancelAnimationFrame(stickyFrame);
  };
}
