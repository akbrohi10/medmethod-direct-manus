import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

const original = read("client/src/pages/MasterclassVideoFirst.tsx");
const duplicate = read("client/src/pages/Masterclass2.tsx");
const physicianProfile = read(
  "client/src/components/masterclass2/PhysicianProfile.tsx",
);
const app = read("client/src/App.tsx");
const pixelHelper = read("client/src/lib/masterclassMetaPixel.ts");

function sliceBetween(source: string, start: string, end: string) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);

  if (startIndex < 0 || endIndex < 0) {
    throw new Error(`Could not find expected source boundaries: ${start} … ${end}`);
  }

  return source.slice(startIndex, endIndex);
}

const originalLearningChecklist = sliceBetween(
  original,
  "// Keep this in sync with the original What You’ll Learn checklist on /live-webinar2.",
  "\nconst FEATURED_OUTLETS",
);
const originalLearningAndWatchSection = sliceBetween(
  original,
  '        <div className="px-5 pt-8 pb-8 sm:px-10 sm:pt-12 sm:pb-12 lg:px-16">',
  "\n\n        <section data-masterclass-video-first-bio",
);
const originalFamilyBio = sliceBetween(
  original,
  "        <section data-masterclass-video-first-bio",
  "\n        <FeaturedInStrip />",
);
const duplicateBeforeBannerMove = duplicate
  .replace("        <FeaturedInStrip />\n", "")
  .replace("        <PhysicianProfile />", "        <PhysicianProfile />\n        <FeaturedInStrip />");
const duplicateWatchSection = sliceBetween(
  duplicateBeforeBannerMove,
  '        <div className="px-5 py-5 sm:px-10 sm:py-6 lg:px-16">',
  "\n\n        <PhysicianProfile />",
);

const normalizedDuplicate = duplicateBeforeBannerMove
  .replace('import PhysicianProfile from "@/components/masterclass2/PhysicianProfile";\n', "")
  .replace(
    'import { CheckCircle2, ShieldCheck, Video } from "lucide-react";',
    'import { Check, CheckCircle2, ShieldCheck, Video } from "lucide-react";',
  )
  .replace(
    "\n\nconst FEATURED_OUTLETS",
    `\n\n${originalLearningChecklist}\nconst FEATURED_OUTLETS`,
  )
  .replace(duplicateWatchSection, originalLearningAndWatchSection)
  .replace("        <PhysicianProfile />", originalFamilyBio)
  .replaceAll("Masterclass2", "MasterclassVideoFirst")
  .replaceAll(
    "https://medmethoddirect.com/masterclass2",
    "https://medmethoddirect.com/masterclass",
  );

const socialProofRouter = app.slice(
  app.indexOf("function SocialProofNotificationsRouter()"),
  app.indexOf("\nfunction App()"),
);

const FAMILY_PRESENTER_ASSET =
  "/manus-storage/jumana-family-masterclass_238b56a3.webp";
const HOMEPAGE_PORTRAIT_ASSET =
  "/manus-storage/dr-aldeek-home-portrait_ba2b0014.webp";
const manuscriptAssets = (source: string) =>
  [...source.matchAll(/\/manus-storage\/[^"']+/g)].map(([asset]) => asset);

describe("approved /masterclass2 duplicate checkpoint", () => {
  it("differs from the original only by approved learning removal, physician-profile substitution and banner relocation", () => {
    expect(duplicate).toContain("export default function Masterclass2()");
    expect(duplicate).toContain(
      '<link rel="canonical" href="https://medmethoddirect.com/masterclass2" />',
    );
    expect(duplicate).toContain(
      'import PhysicianProfile from "@/components/masterclass2/PhysicianProfile";',
    );
    expect(duplicate).toContain("<PhysicianProfile />");
    expect(duplicate).not.toContain("learningChecklist");
    expect(duplicate).not.toContain("data-webinar2-learning");
    expect(duplicate).not.toContain("What You’ll Learn");
    expect(duplicate).not.toContain("Because You Deserve to Know.");
    expect(normalizedDuplicate).toBe(original);
  });

  it("preserves the exact video, headline, watch control, featured strip, booking, pricing, and payment content", () => {
    expect(duplicate).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect(duplicate).toContain("Weight won’t budge?");
    expect(duplicate).toContain("Watch Now—Get Answers.");
    expect(duplicate).toContain('data-masterclass-video-first-watch-arrow');
    expect(duplicate).toContain("Watch the Free Masterclass");
    expect(duplicate).toContain("Featured In");
    expect(duplicate).toContain("$199 first visit. A $50 deposit holds your appointment and is applied to the visit.");
    expect(duplicate).toContain('$50<span className="text-xl tracking-normal">/month</span>');
    expect(duplicate).toContain('href="/care-team-booking"');
    expect(duplicate).toContain(
      '<LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />',
    );
  });

  it("keeps all other assets unchanged and removes the approved local profile portrait without restoring the family image", () => {
    const originalAssets = manuscriptAssets(original);
    const preservedAssets = originalAssets.filter(
      asset => asset !== FAMILY_PRESENTER_ASSET,
    );

    expect(manuscriptAssets(duplicate)).toEqual(preservedAssets);
    expect(manuscriptAssets(physicianProfile)).toEqual([]);
    expect(duplicate).not.toContain(FAMILY_PRESENTER_ASSET);
    expect(physicianProfile).not.toContain(FAMILY_PRESENTER_ASSET);
    expect(physicianProfile).not.toContain(HOMEPAGE_PORTRAIT_ASSET);
    expect(physicianProfile).toContain("Training & Credentials");
    expect(physicianProfile).toContain("Credentials");
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
