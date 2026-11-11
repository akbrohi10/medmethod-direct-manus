import { readFile } from "node:fs";
import type { Request, Response } from "express";

const transportTag = '<script defer src="/assets/hormone-quiz-transport.js"></script>';
const previewBoot = `<script>
(function () {
  function openSampleResults() {
    demoPrefill = true;
    prefillDemoAnswers();
    syncConditional();
    introEl.classList.add("hidden");
    quizEl.classList.add("hidden");
    submissionRecord = null;
    window.__quizSubmission = null;
    $("submissionData").textContent = "";
    renderReport();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", openSampleResults, { once: true });
  else openSampleResults();
})();
</script>`;

/** Only a development response can open sample results; raw/published HTML stays unchanged. */
export function buildQuizPreviewResultsHtml(html: string): string {
  if (html.split(transportTag).length !== 2 || html.split("</body>").length !== 2) {
    throw new Error("Quiz preview template unavailable");
  }
  return html.replace(transportTag, "").replace("</body>", previewBoot + "\n</body>");
}

export function serveQuizPreviewResults(
  req: Pick<Request, "query">,
  res: Response,
  htmlPath: string,
  environment = process.env.NODE_ENV,
): boolean {
  if (environment !== "development" || req.query.preview !== "results") return false;
  res.setHeader("Cache-Control", "no-store");
  readFile(htmlPath, "utf8", (error, html) => {
    if (error) { res.status(500).type("text/plain").send("Preview unavailable"); return; }
    try { res.type("html").send(buildQuizPreviewResultsHtml(html)); }
    catch { res.status(500).type("text/plain").send("Preview unavailable"); }
  });
  return true;
}
