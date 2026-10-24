import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const original = read("client/src/pages/MasterclassVideoFirst.tsx");
const duplicate = read("client/src/pages/Masterclass2.tsx");
const app = read("client/src/App.tsx");
const pixelHelper = read("client/src/lib/masterclassMetaPixel.ts");

const normalizedDuplicate = duplicate
  .replaceAll("Masterclass2", "MasterclassVideoFirst")
  .replaceAll(
    "https://medmethoddirect.com/masterclass2",
    "https://medmethoddirect.com/masterclass",
  );

const socialProofRouter = app.slice(
  app.indexOf("function SocialProofNotificationsRouter()"),
  app.indexOf("\nfunction App()"),
);

describe("approved /masterclass2 duplicate checkpoint", () => {
  it("is an independent byte-copy of the original after only the approved component and canonical substitutions", () => {
    expect(duplicate).toContain("export default function Masterclass2()");
    expect(duplicate).toContain(
      '<link rel="canonical" href="https://medmethoddirect.com/masterclass2" />',
    );
    expect(normalizedDuplicate).toBe(original);
  });

  it("preserves the exact video, image assets, content, pricing, and established booking component", () => {
    expect(duplicate).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect([...duplicate.matchAll(/\/manus-storage\/[^"']+/g)].map(([asset]) => asset)).toEqual(
      [...original.matchAll(/\/manus-storage\/[^"']+/g)].map(([asset]) => asset),
    );
    expect(duplicate).toContain("Weight won’t budge?");
    expect(duplicate).toContain("$199 first visit. A $50 deposit holds your appointment and is applied to the visit.");
    expect(duplicate).toContain("$50<span className=\"text-xl tracking-normal\">/month</span>");
    expect(duplicate).toContain('href="/care-team-booking"');
    expect(duplicate).toContain(
      '<LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />',
    );
  });

  it("registers the additional lazy route while retaining the original /masterclass route", () => {
    expect(app).toContain('const MasterclassVideoFirst = lazy(() => import("@/pages/MasterclassVideoFirst"));');
    expect(app).toContain('const Masterclass2 = lazy(() => import("@/pages/Masterclass2"));');
    expect(app).toContain('<Route path="/masterclass" component={MasterclassVideoFirst} />');
    expect(app).toContain('<Route path="/masterclass2" component={Masterclass2} />');
  });

  it("suppresses social-proof notifications on the duplicate route", () => {
    expect(socialProofRouter).toContain('location === "/masterclass2"');
    expect(socialProofRouter).toMatch(
      /if\s*\([^)]*location === "\/masterclass2"[^)]*\)\s*return null;/,
    );
  });

  it("keeps Meta Pixel installation limited to /masterclass", () => {
    expect(duplicate).toContain("installMasterclassMetaPixel();");
    expect(pixelHelper).toContain(
      'window.location.pathname.replace(/\\/$/, "") !== "/masterclass"',
    );
    expect(pixelHelper).not.toContain("/masterclass2");
  });
});
