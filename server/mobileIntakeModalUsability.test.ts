import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const modalSource = readFileSync(
  resolve(process.cwd(), "client/src/components/home1/LpConsultationModal2.tsx"),
  "utf8",
);
const notificationSource = readFileSync(
  resolve(process.cwd(), "client/src/components/SocialProofNotificationsLP.tsx"),
  "utf8",
);
const styleSource = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("homepage mobile intake usability", () => {
  it("uses an upper-centered, safe-area-aware modal with a protected action footer", () => {
    expect(modalSource).toContain("items-center justify-center");
    expect(modalSource).toContain("-translate-y-[2svh]");
    expect(modalSource).toContain('maxHeight: "min(86dvh, 720px)"');
    expect(modalSource).toContain("calc(env(safe-area-inset-bottom) + 0.75rem)");
  });

  it("suppresses mobile social-proof overlays while the homepage intake modal is active", () => {
    expect(modalSource).toContain('document.body.dataset.mmIntakeModalOpen = "true"');
    expect(notificationSource).toContain("data-social-proof-notification");
    expect(styleSource).toContain('body[data-mm-intake-modal-open="true"] [data-social-proof-notification]');
  });

  it("keeps a visible notification dismissal control as a secondary fallback", () => {
    expect(notificationSource).toContain("handleDismiss");
    expect(notificationSource).toContain('aria-label="Dismiss notification"');
    expect(notificationSource).toContain("CONFIG.dismissCooldown");
  });
});
