import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const baseline = "6b49f2e2";
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const baselineFile = (path: string) => execFileSync("git", ["show", `${baseline}:${path}`], { cwd: root, encoding: "utf8" });

const staticThankYouPath = "client/intake/thank-you/index.html";
const videoThankYouPath = "client/src/pages/ThankYouVideo.tsx";
const staticThankYou = read(staticThankYouPath);
const videoThankYou = read(videoThankYouPath);

const oldStaticStep1 = "Look for a text from MedMethod Direct. Open it and reply to start chatting with our Care Team or a doctor.";
const newStaticStep1 = "You should have received a text from MedMethod Direct, or you'll receive one shortly. Please reply to our message so we can stay connected!";
const oldStaticStep3 = "Complete your Account Details &amp; Required Forms";
const newStaticStep3 = "Upload or update your info in the Patient Portal";
const oldStaticStep3Description = "On the right-side menu, click My Account Details to complete your information then click Forms &amp; Questionnaires to review, sign, and submit all required forms.";
const newStaticStep3Description = "Log in to review your details and upload anything Dr. Al-Deek may need, like recent lab results.";
const removedPortalGuide = `        <figure class="portal-guide">\n          <img src="/manus-storage/PatientPortalMenuHighlights_5e7b0fd0.png" alt="Patient Portal menu with My Account Details and Forms and Questionnaires highlighted" />\n        </figure>\n\n`;
const oldVideoStep2 = "Check your email for your Patient Portal invite. Click the link to create your username and password, then complete your forms before your visit so Dr. Al-Deek can review your information ahead of time.";
const newVideoStep2 = "Check your email for your Patient Portal invite. Click the link to create your username and password, then upload or update your info so Dr. Al-Deek can review it before your visit.";

describe("approved thank-you next steps copy", () => {
  it("has exactly three static next steps with the approved copy and no portal screenshot", () => {
    const nextSteps = staticThankYou.match(/<section class="confirmation-next-steps"[\s\S]*?<\/section>/)?.[0] ?? "";

    expect(nextSteps.match(/<li>/g)).toHaveLength(3);
    expect(nextSteps).toContain(`<strong id="care-message-title">Check your text messages</strong><span id="care-message-copy">${newStaticStep1}</span>`);
    expect(nextSteps).toContain("<strong>Check your email &amp; create your account</strong><span>Look for our welcome email with your Patient Portal link. Click the link, create your username and password, and log in.</span>");
    expect(nextSteps).toContain(`<strong>${newStaticStep3}</strong><span>${newStaticStep3Description}</span>`);
    expect(staticThankYou).not.toContain("figure class=\"portal-guide\"");
    expect(staticThankYou).not.toContain("PatientPortalMenuHighlights_5e7b0fd0.png");
  });

  it("preserves the static page's follow-up, help, video offer, buttons, payment receipt client, styles, and routes", () => {
    for (const text of [
      "Complete the portal steps above so the Care Team can help with the next steps in your care.",
      '<strong>Need help?</strong> Our Care Team is happy to assist! Call us at <a href="tel:+18883627011">888-362-7011</a>.',
      '<section class="video-visit-card" id="video-visit-card"',
      "Add a Zoom video visit with a doctor specializing in medical weight loss — <strong>$97.</strong>",
      '<button class="primary" id="open-video-checkout" type="button">Add a Video Visit — $97</button>',
      '<button class="secondary" id="recover-video-payment" type="button">Check payment confirmation</button>',
      '<section class="checkout" id="video-checkout"',
      '<a class="start-over" href="/intake/">Start over</a>',
      '<script src="/intake/video-visit.js?v=intake-video-97-20261027"></script>',
      '.portal-guide { margin: 28px auto 22px; }',
      '.portal-guide img { display: block;',
    ]) expect(staticThankYou).toContain(text);
  });

  it("changes only the authorized static next-step text and portal figure from the baseline", () => {
    const expected = baselineFile(staticThankYouPath)
      .replace(oldStaticStep1, newStaticStep1)
      .replace(oldStaticStep3, newStaticStep3)
      .replace(oldStaticStep3Description, newStaticStep3Description)
      .replace(removedPortalGuide, "");

    expect(staticThankYou).toBe(expected);
  });

  it("uses only the approved React Step 2 description and changes nothing else from the baseline", () => {
    expect(videoThankYou).toContain(`description: "${newVideoStep2}"`);
    expect(videoThankYou).not.toContain(oldVideoStep2);
    expect(videoThankYou).toBe(baselineFile(videoThankYouPath).replace(oldVideoStep2, newVideoStep2));
  });
});
