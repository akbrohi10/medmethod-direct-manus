window.MmdCreateSignForms = function (l, M) {
function MmdEasternDate(value) {
  var date = value instanceof Date ? value : new Date(value || Date.now());
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  }).format(date);
}

function MmdEasternDateParts(value) {
  var date = value instanceof Date ? value : new Date(value || Date.now());
  var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  var result = {};
  parts.forEach(function (part) {
    if (part.type !== "literal") result[part.type] = part.value;
  });
  return result;
}

function MmdNextEasternMidnight(reference) {
  var now = reference instanceof Date ? reference : new Date(reference || Date.now());
  var eastern = MmdEasternDateParts(now);
  var nextCalendarDay = new Date(Date.UTC(
    Number(eastern.year),
    Number(eastern.month) - 1,
    Number(eastern.day) + 1
  ));
  var targetYear = String(nextCalendarDay.getUTCFullYear());
  var targetMonth = String(nextCalendarDay.getUTCMonth() + 1).padStart(2, "0");
  var targetDay = String(nextCalendarDay.getUTCDate()).padStart(2, "0");
  var hour;

  /* New York midnight is between 04:00 and 05:00 UTC; retaining the loop keeps
     this correct across daylight-saving transitions without storing any data. */
  for (hour = 0; hour <= 12; hour += 1) {
    var candidate = new Date(Date.UTC(
      nextCalendarDay.getUTCFullYear(),
      nextCalendarDay.getUTCMonth(),
      nextCalendarDay.getUTCDate(),
      hour
    ));
    var candidateParts = MmdEasternDateParts(candidate);
    if (
      candidateParts.year === targetYear &&
      candidateParts.month === targetMonth &&
      candidateParts.day === targetDay &&
      candidateParts.hour === "00"
    ) {
      return candidate;
    }
  }

  return new Date(now.getTime() + 86400000);
}

function MmdSignFormsContent(props) {
  var blocks = Array.isArray(props.content) ? props.content : [];

  return M.jsx("div", {
    className: "sign-forms-document-copy",
    children: blocks.map(function (block, index) {
      var key = "content-" + index;
      if (block.tag === "h3") {
        return M.jsx("h3", { children: block.text || "" }, key);
      }
      if (block.tag === "ul" || block.tag === "ol") {
        return M.jsx(block.tag, {
          children: (Array.isArray(block.items) ? block.items : []).map(function (item, itemIndex) {
            return M.jsx("li", { children: item }, "item-" + itemIndex);
          })
        }, key);
      }
      return M.jsx("p", { children: block.text || "" }, key);
    })
  });
}

function MmdSignFormsPointerPoint(event, canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
    y: Math.max(0, Math.min(rect.height, event.clientY - rect.top))
  };
}

function MmdSignForms({patientName, onReadyChange, onGlpConsentChange, documents}) {
  patientName = patientName || "";
  documents = Array.isArray(documents) ? documents : [];
  var documentIds = documents.map(function (document) { return document.id; });
  var documentIdKey = documentIds.join("\u001f");
  var initialNameRef = l.useRef(patientName);
  var nameEditedRef = l.useRef(false);
  var readyCallbackRef = l.useRef(onReadyChange);
  var glpConsentCallbackRef = l.useRef(onGlpConsentChange);
  var canvasRef = l.useRef(null);
  var resizeSignatureCanvasRef = l.useRef(null);
  var signatureDrawingRef = l.useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    started: false
  });
  var initializedCanvasRef = l.useRef(false);
  var nameState = l.useState(initialNameRef.current);
  var signatureName = nameState[0];
  var setSignatureName = nameState[1];
  var relationshipState = l.useState("");
  var relationship = relationshipState[0];
  var setRelationship = relationshipState[1];
  var documentChecksState = l.useState({});
  var documentChecks = documentChecksState[0];
  var setDocumentChecks = documentChecksState[1];
  var electronicAgreementState = l.useState(false);
  var electronicAgreement = electronicAgreementState[0];
  var setElectronicAgreement = electronicAgreementState[1];
  var signatureState = l.useState(false);
  var hasSignature = signatureState[0];
  var setHasSignature = signatureState[1];
  var noticeState = l.useState({});
  var revealedNotices = noticeState[0];
  var setRevealedNotices = noticeState[1];
  var dateState = l.useState(Date.now());
  var dateNow = dateState[0];
  var setDateNow = dateState[1];

  l.useEffect(function () {
    readyCallbackRef.current = onReadyChange;
  }, [onReadyChange]);

  l.useEffect(function () {
    glpConsentCallbackRef.current = onGlpConsentChange;
  }, [onGlpConsentChange]);

  l.useEffect(function () {
    if (!nameEditedRef.current) setSignatureName(patientName);
  }, [patientName]);

  l.useEffect(function () {
    setDocumentChecks(function (previous) {
      var next = {};
      documentIds.forEach(function (id) {
        if (previous[id]) next[id] = true;
      });
      return next;
    });
  }, [documentIdKey]);

  l.useEffect(function () {
    var timeoutId;
    function updateDateAtEasternMidnight() {
      var now = new Date();
      setDateNow(now.getTime());
      var nextMidnight = MmdNextEasternMidnight(now);
      timeoutId = window.setTimeout(
        updateDateAtEasternMidnight,
        Math.max(1000, nextMidnight.getTime() - now.getTime() + 100)
      );
    }
    updateDateAtEasternMidnight();
    return function () {
      window.clearTimeout(timeoutId);
    };
  }, []);

  l.useEffect(function () {
    var canvas = canvasRef.current;
    if (!canvas) return undefined;

    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      var cssWidth = Math.max(1, Math.round(rect.width));
      var cssHeight = Math.max(1, Math.round(rect.height));
      var pixelRatio = Math.max(1, window.devicePixelRatio || 1);
      var nextWidth = Math.max(1, Math.round(cssWidth * pixelRatio));
      var nextHeight = Math.max(1, Math.round(cssHeight * pixelRatio));
      var snapshot = null;

      if (initializedCanvasRef.current && canvas.width && canvas.height) {
        snapshot = document.createElement("canvas");
        snapshot.width = canvas.width;
        snapshot.height = canvas.height;
        snapshot.getContext("2d").drawImage(canvas, 0, 0);
      }

      canvas.width = nextWidth;
      canvas.height = nextHeight;
      var context = canvas.getContext("2d");
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, cssWidth, cssHeight);
      context.strokeStyle = "#113a3a";
      context.lineWidth = 2.5;
      context.lineCap = "round";
      context.lineJoin = "round";

      if (snapshot) {
        context.drawImage(
          snapshot,
          0,
          0,
          snapshot.width,
          snapshot.height,
          0,
          0,
          cssWidth,
          cssHeight
        );
      }
      initializedCanvasRef.current = true;
    }

    resizeSignatureCanvasRef.current = resizeCanvas;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);
    var observer = typeof ResizeObserver === "function" ? new ResizeObserver(resizeCanvas) : null;
    if (observer) observer.observe(canvas);

    return function () {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      if (observer) observer.disconnect();
      resizeSignatureCanvasRef.current = null;
    };
  }, []);

  var glpConsent = Boolean(documentChecks.glp1);
  l.useEffect(function () {
    if (documentIds.indexOf("glp1") !== -1 && typeof glpConsentCallbackRef.current === "function") {
      glpConsentCallbackRef.current(glpConsent);
    }
  }, [glpConsent, documentIdKey]);

  l.useEffect(function () {
    var allDocumentsAccepted = documents.length > 0 && documents.every(function (document) {
      return Boolean(documentChecks[document.id]);
    });
    var ready = Boolean(signatureName.trim()) && allDocumentsAccepted && electronicAgreement && hasSignature;
    if (typeof readyCallbackRef.current === "function") readyCallbackRef.current(ready);
  }, [signatureName, documentChecks, electronicAgreement, hasSignature, documentIdKey]);

  function updateDocumentCheck(id, event) {
    var checked = event.target.checked;
    setDocumentChecks(function (previous) {
      var next = {};
      var key;
      for (key in previous) {
        if (Object.prototype.hasOwnProperty.call(previous, key)) next[key] = previous[key];
      }
      next[id] = checked;
      return next;
    });
  }

  function beginSignature(event) {
    var canvas = canvasRef.current;
    if (!canvas || event.button !== undefined && event.button !== 0) return;
    var point = MmdSignFormsPointerPoint(event, canvas);
    signatureDrawingRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: point.x,
      startY: point.y,
      lastX: point.x,
      lastY: point.y,
      started: false
    };
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
  }

  function continueSignature(event) {
    var canvas = canvasRef.current;
    var drawing = signatureDrawingRef.current;
    if (!canvas || !drawing.active || drawing.pointerId !== event.pointerId) return;

    var point = MmdSignFormsPointerPoint(event, canvas);
    var distanceFromStart = Math.hypot(point.x - drawing.startX, point.y - drawing.startY);
    var context = canvas.getContext("2d");
    if (!drawing.started && distanceFromStart < 4) {
      drawing.lastX = point.x;
      drawing.lastY = point.y;
      return;
    }

    if (!drawing.started) {
      drawing.started = true;
      context.beginPath();
      context.moveTo(drawing.startX, drawing.startY);
    }

    context.strokeStyle = "#113a3a";
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.quadraticCurveTo(
      drawing.lastX,
      drawing.lastY,
      (drawing.lastX + point.x) / 2,
      (drawing.lastY + point.y) / 2
    );
    context.stroke();
    drawing.lastX = point.x;
    drawing.lastY = point.y;
    setHasSignature(true);
  }

  function endSignature(event) {
    var canvas = canvasRef.current;
    var drawing = signatureDrawingRef.current;
    if (!canvas || !drawing.active || drawing.pointerId !== event.pointerId) return;
    if (drawing.started) {
      var context = canvas.getContext("2d");
      context.lineTo(drawing.lastX, drawing.lastY);
      context.stroke();
    }
    if (canvas.releasePointerCapture && canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    drawing.active = false;
    drawing.pointerId = null;
  }

  function clearSignature() {
    var canvas = canvasRef.current;
    if (!canvas) return;
    var context = canvas.getContext("2d");
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
    signatureDrawingRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastY: 0,
      started: false
    };
    setHasSignature(false);
  }

  return M.jsxs("section", {
    className: "sign-forms",
    "data-hj-suppress": "true",
    children: [
      M.jsxs("fieldset", {
        className: "sign-forms-documents",
        children: [
          M.jsx("legend", { children: "Documents" }),
          M.jsx("div", {
            className: "sign-forms-document-list",
            children: documents.map(function (document) {
          var documentId = "mmd-sign-forms-" + document.id;
          var noticeId = "mmd-sign-forms-notice-" + document.id;
          var isFullNotice = document.id === "npp" || Boolean(document.linkLabel);
          var contentIsVisible = !isFullNotice || Boolean(revealedNotices[document.id]);
          return M.jsxs("details", {
            className: "sign-forms-document",
            children: [
              M.jsx("summary", { children: document.title }),
              M.jsxs("div", {
                className: "sign-forms-document-body",
                children: [
                  isFullNotice ? M.jsx("button", {
                    className: "sign-forms-read-notice",
                    type: "button",
                    "aria-expanded": Boolean(revealedNotices[document.id]),
                    "aria-controls": noticeId,
                    onClick: function () {
                      setRevealedNotices(function (previous) {
                        var next = {};
                        var key;
                        for (key in previous) {
                          if (Object.prototype.hasOwnProperty.call(previous, key)) next[key] = previous[key];
                        }
                        next[document.id] = true;
                        return next;
                      });
                    },
                    children: document.linkLabel || "Read full notice"
                  }) : null,
                  contentIsVisible ? M.jsx("div", {
                    id: noticeId,
                    children: M.jsx(MmdSignFormsContent, { content: document.content })
                  }) : null,
                  M.jsxs("label", {
                    className: "sign-forms-checkline",
                    htmlFor: documentId,
                    children: [
                      M.jsx("input", {
                        id: documentId,
                        type: "checkbox",
                        checked: Boolean(documentChecks[document.id]),
                        onChange: function (event) { updateDocumentCheck(document.id, event); }
                      }),
                      M.jsx("span", { children: document.checkbox })
                    ]
                  })
                ]
              })
            ]
            }, document.id);
            })
          })
        ]
      }),
      M.jsxs("fieldset", {
        className: "sign-forms-signature-fields",
        children: [
          M.jsx("legend", { children: "Signature" }),
          M.jsxs("div", {
            className: "sign-forms-fields-grid",
            children: [
              M.jsxs("label", {
                className: "sign-forms-field sign-forms-field-name",
                children: [
                  M.jsx("span", { children: "Full name" }),
                  M.jsx("input", {
                    type: "text",
                    value: signatureName,
                    autoComplete: "name",
                    "data-hj-suppress": "true",
                    onChange: function (event) {
                      nameEditedRef.current = true;
                      setSignatureName(event.target.value);
                    }
                  })
                ]
              }),
              M.jsxs("label", {
                className: "sign-forms-field",
                children: [
                  M.jsx("span", { children: "Relation to patient (only if signing for someone else)" }),
                  M.jsx("input", {
                    type: "text",
                    value: relationship,
                    autoComplete: "off",
                    "data-hj-suppress": "true",
                    onChange: function (event) { setRelationship(event.target.value); }
                  })
                ]
              }),
              M.jsxs("label", {
                className: "sign-forms-field sign-forms-field-date",
                children: [
                  M.jsx("span", { children: "Date" }),
                  M.jsx("input", {
                    type: "text",
                    value: MmdEasternDate(dateNow),
                    readOnly: true,
                    "aria-readonly": "true"
                  })
                ]
              })
            ]
          }),
          M.jsxs("label", {
            className: "sign-forms-checkline sign-forms-electronic-agreement",
            children: [
              M.jsx("input", {
                type: "checkbox",
                checked: electronicAgreement,
                onChange: function (event) { setElectronicAgreement(event.target.checked); }
              }),
              M.jsx("span", {
                children: "I agree to sign electronically, and my electronic signature is as valid as a handwritten one."
              })
            ]
          }),
          M.jsxs("div", {
            className: "sign-forms-signature-pad",
            children: [
              M.jsx("label", {
                className: "sign-forms-canvas-label",
                children: "Sign with your finger or mouse"
              }),
              M.jsx("canvas", {
                ref: canvasRef,
                className: "sign-forms-canvas",
                role: "img",
                "aria-label": "Sign with your finger or mouse",
                "data-hj-suppress": "true",
                onPointerDown: beginSignature,
                onPointerMove: continueSignature,
                onPointerUp: endSignature,
                onPointerCancel: endSignature
              }),
              M.jsx("button", {
                className: "sign-forms-clear",
                type: "button",
                onClick: clearSignature,
                children: "Clear"
              })
            ]
          })
        ]
      })
    ]
  });
}

return MmdSignForms;
};
