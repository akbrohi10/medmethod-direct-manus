// Frozen report-letter-only inverse. No tests, I/O, network, or production imports.
const files = {"client/public/hormone-symptom-quiz.html":[{"old":"      var fix = ans(\"fixFirst\");\n      html += '<div class=\"letter\"><p>Dear friend,</p>'\n        + \"<p>Before the numbers, here is what you told us \u2014 in plain sight, the way it deserves to be:</p>\"\n        + (glance.length ? '<ul class=\"glance\">' + glance.map(function(g){ return \"<li>\" + g + \"</li>\"; }).join(\"\") + \"</ul>\" : \"\")\n        + \"<p>None of these arrived on their own. They tend to travel together, because they share a driver: estrogen, falling the way it does in these years. Here is your whole picture, scored.</p>\"\n        + (fix ? \"<p>And the thing you'd fix first \u2014 <b>\" + fix.toLowerCase() + \"</b> \u2014 shapes the order of your drivers below.</p>\" : \"\")\n        + \"</div>\";\n      var ord = orderDrivers(metrics, fix);\n","new":"      var fix = ans(\"fixFirst\");\n      var ord = orderDrivers(metrics, fix);\n"}]};
export function inverseHormoneQuizLetterRemoval(path: string, source: string): string {
  path = String(path).replaceAll("\\", "/");
  const key = Object.keys(files).find(p => path === p || path.endsWith("/" + p) || (p === "client/public/hormone-symptom-quiz.html" && (path === "dist/public/hormone-symptom-quiz.html" || path.endsWith("/dist/public/hormone-symptom-quiz.html"))));
  if (!key) return source;
  const f = files[key as keyof typeof files][0];
  const oldCount = source.split(f.old).length - 1;
  const newCount = source.split(f.new).length - 1;
  if (oldCount === 1 && newCount === 0) return source;
  if (oldCount !== 0 || newCount !== 1) throw Error("Quiz letter removal scope mismatch");
  return source.replace(f.new, f.old);
}
