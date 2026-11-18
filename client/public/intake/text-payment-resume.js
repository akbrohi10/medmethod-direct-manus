(function () {
  'use strict';
  var token = new URLSearchParams(window.location.hash.slice(1)).get('token');
  window.history.replaceState(null, '', '/intake/resume');
  var status = document.getElementById('resume-status');
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token) || window.self !== window.top) {
    status.textContent = 'This resume link is unavailable or expired. Please start a new assessment.';
    return;
  }
  window.MmdTextPaymentApi.resume(token).then(function () {
    token = null;
    window.location.replace('/intake/?resume=1');
  }).catch(function () {
    token = null;
    status.textContent = 'This resume link is unavailable or has already been used. Please start a new assessment.';
  });
})();
