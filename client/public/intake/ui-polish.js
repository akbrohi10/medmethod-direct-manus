/* UI-only enhancement. React remains the owner of dialog open/close state. */
(function () {
  'use strict';
  var activeDialog = null;
  var pendingOpener = null;
  var dialogOpeners = new WeakMap();
  var redirectingFocus = false;
  var focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusable(dialog) {
    return Array.from(dialog.querySelectorAll(focusableSelector)).filter(function (element) {
      return element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
    });
  }

  function focusInside(dialog) {
    var target = focusable(dialog)[0];
    if (!target) {
      if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
      target = dialog;
    }
    target.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (event) {
    if (!activeDialog && event.target instanceof Element) {
      pendingOpener = event.target.closest('button, a[href], [tabindex]') || document.activeElement;
    }
  }, true);

  document.addEventListener('keydown', function (event) {
    if (!activeDialog || !activeDialog.isConnected) return;
    if (event.key === 'Escape') {
      var close = activeDialog.querySelector('.modal-head button');
      if (close) {
        event.preventDefault();
        event.stopPropagation();
        close.click();
      }
      return;
    }
    if (event.key !== 'Tab') return;
    var controls = focusable(activeDialog);
    if (!controls.length) {
      event.preventDefault();
      focusInside(activeDialog);
      return;
    }
    var first = controls[0];
    var last = controls[controls.length - 1];
    var focused = document.activeElement;
    if (!activeDialog.contains(focused) || (event.shiftKey && focused === first) || (!event.shiftKey && focused === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
    }
  }, true);

  document.addEventListener('focusin', function (event) {
    if (!redirectingFocus && activeDialog && activeDialog.isConnected && !activeDialog.contains(event.target)) {
      redirectingFocus = true;
      focusInside(activeDialog);
      redirectingFocus = false;
    }
  });

  function synchronizeDialog() {
    var dialogs = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).filter(function (dialog) {
      return dialog.getClientRects().length && getComputedStyle(dialog).visibility !== 'hidden';
    });
    var next = dialogs[dialogs.length - 1] || null;
    if (next === activeDialog) return;
    var previous = activeDialog;
    activeDialog = next;
    if (next) {
      var opener = pendingOpener && pendingOpener.isConnected ? pendingOpener : document.activeElement;
      dialogOpeners.set(next, opener);
      pendingOpener = null;
      focusInside(next);
    } else if (previous) {
      var restore = dialogOpeners.get(previous);
      if (restore && restore.isConnected && !restore.disabled) restore.focus({ preventScroll: true });
    }
  }

  function initialize() {
    new MutationObserver(synchronizeDialog).observe(document.body, { childList: true, subtree: true });
    synchronizeDialog();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
