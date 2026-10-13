/* UI-only navigation and tab accessibility. Existing application behavior stays separate. */
(function () {
  'use strict';
  var menu = document.querySelector('.menu-btn');
  var navigation = document.getElementById('nav-links');
  var header = document.querySelector('.site-header');
  var mobile = window.matchMedia('(max-width: 900px)');

  function setMenu(open, restoreFocus) {
    if (!menu || !navigation) return;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    navigation.classList.toggle('open', open);
    if (!open && restoreFocus) menu.focus({ preventScroll: true });
  }

  if (menu && navigation) {
    menu.addEventListener('click', function (event) {
      var open = menu.getAttribute('aria-expanded') !== 'true';
      setMenu(open, false);
      if (open && event.detail === 0) navigation.querySelector('a')?.focus({ preventScroll: true });
    });
    navigation.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false, false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setMenu(false, true);
      }
    });
    document.addEventListener('click', function (event) {
      if (menu.getAttribute('aria-expanded') === 'true' && !navigation.contains(event.target) && !menu.contains(event.target)) {
        setMenu(false, false);
      }
    });
    header.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (mobile.matches && menu.getAttribute('aria-expanded') === 'true' && !header.contains(document.activeElement)) setMenu(false, false);
      }, 0);
    });
    function resetMenu() { setMenu(false, false); }
    if (mobile.addEventListener) mobile.addEventListener('change', resetMenu);
  }

  function measureHeader() {
    if (header) document.documentElement.style.setProperty('--site-header-height', header.getBoundingClientRect().height + 'px');
  }
  measureHeader();
  if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  else window.addEventListener('resize', measureHeader);

  var tabs = Array.from(document.querySelectorAll('.feature-tab'));
  function selectTab(tab, moveFocus) {
    tabs.forEach(function (candidate) {
      var selected = candidate === tab;
      candidate.setAttribute('aria-selected', String(selected));
      candidate.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(candidate.getAttribute('aria-controls'));
      if (panel) panel.hidden = !selected;
    });
    if (moveFocus) tab.focus({ preventScroll: true });
  }
  tabs.forEach(function (tab, index) {
    if (!tab.id) tab.id = 'app-tab-' + tab.getAttribute('data-screen');
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (panel) {
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    }
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectTab(tabs[next], true);
    });
  });
  if (tabs.length) selectTab(tabs.find(function (tab) { return tab.getAttribute('aria-selected') === 'true'; }) || tabs[0], false);
})();
