import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const dialogSource = fs.readFileSync(
  path.join(root, "client/src/components/WebinarRegistrationDialog.tsx"),
  "utf8",
);

describe("click-triggered SendMeAPro webinar registration dialog", () => {
  it("uses the supplied Webinar Form iframe source and provider metadata", () => {
    expect(dialogSource).toContain('const WEBINAR_FORM_ID = "A3e1g5dCf1hc3tY3xpHi"');
    expect(dialogSource).toContain("https://link.sendmeapro.com/widget/form/${WEBINAR_FORM_ID}");
    expect(dialogSource).toContain("iframe loads the form directly");
    expect(dialogSource).toContain('id={`inline-${WEBINAR_FORM_ID}`}');
    expect(dialogSource).toContain('data-layout={\'{"id":"INLINE"}\'}');
    expect(dialogSource).toContain('data-form-name="Webinar Form"');
    expect(dialogSource).toContain('data-height="450"');
    expect(dialogSource).toContain('data-form-id={WEBINAR_FORM_ID}');
    expect(dialogSource).toContain('data-cookie-consent="true"');
    expect(dialogSource).toContain('data-cookie-consent-provider="auto"');
    expect(dialogSource).toContain('title="Webinar Form"');
  });

  it("mounts the form only in an open accessible dialog without installing a global helper that can duplicate or mutate the dialog", () => {
    expect(dialogSource).toContain("<Dialog open={open} onOpenChange={handleOpenChange}>");
    expect(dialogSource).toContain("data-webinar-registration-dialog");
    expect(dialogSource).toContain("const handleOpenChange = (nextOpen: boolean) => {");
    expect(dialogSource).toContain("if (nextOpen) {");
    expect(dialogSource).toContain("onOpenChange(nextOpen);");
    expect(dialogSource).not.toContain("form_embed.js");
    expect(dialogSource).not.toContain("document.createElement(\"script\")");
    expect(dialogSource).toContain("onLoad={() => setFormLoaded(true)}");
    expect(dialogSource).toContain("onError={() => setFormLoadError(true)}");
    expect(dialogSource).toContain("Loading secure registration form");
    expect(dialogSource).toContain("The registration form could not load.");
  });
});
