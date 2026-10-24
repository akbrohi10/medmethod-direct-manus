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

const originalHero = sliceBetween(original, "        <section data-masterclass-video-first-hero", "\n\n        <section ref={videoRef}");
const currentHero = sliceBetween(duplicate, "        <section data-masterclass-video-first-hero", "\n\n        <section ref={videoRef}");
const approvedHero = originalHero
  .replace(/\n            <p data-masterclass-video-first-credentials[\s\S]*?<\/p>/, "");
const normalizedHero = currentHero
  .replace(/<h1[\s\S]*?<\/h1>/, originalHero.match(/<h1[\s\S]*?<\/h1>/)![0])
  .replace(/\n            <p\n              data-masterclass2-virtual-subheading[\s\S]*?<\/p>/, "");

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
const originalPricing = sliceBetween(original, "function PricingDetails()", "export default function");
const originalBooking = sliceBetween(original, "        <section data-masterclass-video-first-booking", "\n\n        <footer");
const currentBooking = sliceBetween(duplicate, "        <section data-masterclass-video-first-booking", "\n\n        <footer");
const mobileBookingPill = sliceBetween(duplicate, '\n        <button\n          type="button"\n          data-masterclass2-mobile-booking', '\n      <VideoVisitCheckout');
const mobileFocusRecovery = sliceBetween(duplicate, '  useEffect(() => {\n    if (!consultationOpen && mobileBookingOpened.current)', '  const scrollToVideo');
const normalizedDuplicate = duplicate
  .replace(/\n        <div data-masterclass2-family-photo-section[\s\S]*?<\/div>\n/, "")
  .replace(currentHero, originalHero)
  .replace(mobileFocusRecovery, "")
  .replace('  const mobileBookingRef = useRef<HTMLButtonElement>(null);\n  const mobileBookingOpened = useRef(false);\n', "")
  .replace(mobileBookingPill, "")
  .replace("<main data-masterclass2-page ", "<main ")
  .replace('        @media (max-width: 767px) {\n          [data-masterclass2-page] { padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px)); }\n        }\n', "")
  .replace('import { getVideoVisitPendingCheckout } from "@/components/masterclass2/videoVisitCheckoutStorage";\n', "")
  .replace('    const pendingCheckout = getVideoVisitPendingCheckout();\n    if (pendingCheckout && ["confirming", "provider_approved"].includes(pendingCheckout.phase ?? "")) setConsultationOpen(true);\n', "")
  .replace(currentBooking, originalBooking)
  .replace("export default function Masterclass2()", `${originalPricing}export default function Masterclass2()`)
  .replace('import VideoVisitCheckout from "@/components/masterclass2/VideoVisitCheckout";', 'import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";\nimport LpConsultationModal2 from "@/components/home1/LpConsultationModal2";')
  .replace('import { ShieldCheck } from "lucide-react";', 'import { CheckCircle2, ShieldCheck, Video } from "lucide-react";')
  .replace('<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />', '<LpConsultationModal2 open={consultationOpen} onClose={() => setConsultationOpen(false)} landingPage="/masterclass" startAtPayment />')
  .replace("        <FeaturedInStrip />\n", "")
  .replace("\n\n\n        <PhysicianProfile />", `\n\n${originalLearningAndWatchSection}\n\n        <PhysicianProfile />`)
  .replace('import PhysicianProfile from "@/components/masterclass2/PhysicianProfile";\n', "")
  .replace(
    'import { CheckCircle2, ShieldCheck, Video } from "lucide-react";',
    'import { Check, CheckCircle2, ShieldCheck, Video } from "lucide-react";',
  )
  .replace(
    "\n\nconst FEATURED_OUTLETS",
    `\n\n${originalLearningChecklist}\nconst FEATURED_OUTLETS`,
  )
  .replace("        <PhysicianProfile />", `${originalFamilyBio}\n        <FeaturedInStrip />`)
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
  it("differs from the original only by approved hero, profile, banner, removals and Work With Me checkout replacement", () => {
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

  it("changes only the approved homepage-style headline and virtual subheading, without restoring redundant credentials", () => {
    expect(normalizedHero).toBe(approvedHero);
    expect(currentHero).not.toContain("data-masterclass-video-first-credentials");
    expect(currentHero).not.toContain("50,000");
    expect(originalHero).toContain("Weight won’t budge?");
    expect(originalHero).toContain("data-masterclass-video-first-credentials");
  });

  it("preserves the video and banner while replacing only approved booking and pricing", () => {
    expect(duplicate).toContain('const MASTERCLASS_YOUTUBE_ID = "UNYMLkd61z8";');
    expect(duplicate).toContain("data-masterclass2-home-headline");
    expect(duplicate).toContain("Done Right for You.");
    expect(duplicate).toContain("Watch Now—Get Answers.");
    expect(duplicate).toContain('data-masterclass-video-first-watch-arrow');
    expect(duplicate).not.toContain("Watch the Free Masterclass");
    expect(duplicate).not.toContain("data-masterclass-watch-button");
    expect(duplicate).not.toContain('className="px-5 py-5 sm:px-10 sm:py-6 lg:px-16"');
    expect(original).toContain("Watch the Free Masterclass");
    expect(duplicate).toContain("Featured In");
    expect(duplicate).not.toContain("$199");
    expect(duplicate).not.toContain("PricingDetails");
    expect(duplicate).toContain('href="/care-team-booking"');
    expect(duplicate).toContain(
      '<VideoVisitCheckout open={consultationOpen} onClose={() => setConsultationOpen(false)} />',
    );
  });

  it("restores the original family image while keeping other assets and the portrait-free local profile unchanged", () => {
    const originalAssets = manuscriptAssets(original);

    expect(manuscriptAssets(duplicate)).toEqual(originalAssets);
    expect(manuscriptAssets(physicianProfile)).toEqual([]);
    expect(duplicate).toContain(FAMILY_PRESENTER_ASSET);
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
