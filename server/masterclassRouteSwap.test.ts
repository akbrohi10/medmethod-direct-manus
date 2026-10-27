import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const BASELINE = "bd30bdec";
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const readBaseline = (path: string) =>
  execFileSync("git", ["show", `${BASELINE}:${path}`], {
    cwd: root,
    encoding: "utf8",
  });
const count = (source: string, value: string) => source.split(value).length - 1;

const appPath = "client/src/App.tsx";
const masterclass2Path = "client/src/pages/Masterclass2.tsx";
const masterclassVideoFirstPath = "client/src/pages/MasterclassVideoFirst.tsx";
const pixelPath = "client/src/lib/masterclassMetaPixel.ts";
const crawlerPath = "server/crawlerMiddleware.ts";
const legacyStripePath = "client/src/components/masterclass2/VideoVisitStripePayment.tsx";
const stripe4799Path = "client/src/components/masterclass2/checkout4799/VideoVisitStripePayment4799.tsx";
const legitScriptFooterSealStart =
  '\n          <div data-masterclass-legitscript-footer-seal className="mt-6 flex justify-center">';
const legitScriptFooterSealEnd = "\n          </div>";

function restoreAppRoutes(source: string) {
  return source
    .replace(
      '<Route path="/masterclass" component={Masterclass2} />',
      '<Route path="/masterclass" component={MasterclassVideoFirst} />',
    )
    .replace(
      '<Route path="/masterclass2" component={MasterclassVideoFirst} />',
      '<Route path="/masterclass2" component={Masterclass2} />',
    );
}

function restoreMasterclass2RouteMetadata(source: string) {
  return source.replace(
    '        <link rel="canonical" href="https://medmethoddirect.com/masterclass" />\n        <meta property="og:url" content="https://medmethoddirect.com/masterclass" />',
    '        <link rel="canonical" href="https://medmethoddirect.com/masterclass2" />',
  );
}

function restoreApprovedFinalFaqPageLines(source: string) {
  const withoutFinalFaq = source
    .replace('import FinalFaq from "@/components/masterclass2/FinalFaq";\n', "")
    .replace('        <FinalFaq intakeHref="https://intake.medmethoddirect.com/" />\n', "");
  const start = withoutFinalFaq.indexOf(legitScriptFooterSealStart);
  if (start < 0) return withoutFinalFaq;
  const end = withoutFinalFaq.indexOf(legitScriptFooterSealEnd, start);
  if (end < 0) throw new Error("Missing end of marked Masterclass LegitScript footer seal");
  return withoutFinalFaq.slice(0, start) + withoutFinalFaq.slice(end + legitScriptFooterSealEnd.length);
}

function restoreMasterclassVideoFirstRouteMetadata(source: string) {
  return source.replace(
    '        <link rel="canonical" href="https://medmethoddirect.com/masterclass2" />\n        <meta property="og:url" content="https://medmethoddirect.com/masterclass2" />',
    '        <link rel="canonical" href="https://medmethoddirect.com/masterclass" />',
  );
}

function restorePixelPathChecks(source: string) {
  return source
    .replace(
      '!!pageUrl && new URL(pageUrl).pathname.replace(/\\/$/, "") === "/masterclass2";',
      '!!pageUrl && new URL(pageUrl).pathname.replace(/\\/$/, "") === "/masterclass";',
    )
    .replace(
      'if (window.location.pathname.replace(/\\/$/, "") !== "/masterclass2") return false;',
      'if (window.location.pathname.replace(/\\/$/, "") !== "/masterclass") return false;',
    );
}

function restoreCrawlerNoscriptCondition(source: string) {
  return source.replace(
    'if (meta.url === `${BASE_URL}/masterclass2` && !page.includes(\'id="masterclass-meta-pixel-noscript"\')) {',
    'if (meta.url === `${BASE_URL}/masterclass` && !page.includes(\'id="masterclass-meta-pixel-noscript"\')) {',
  );
}

function restoreLegacyStripeReturn(source: string) {
  return source
    .replace(
      'return_url: `${window.location.origin}${window.location.pathname.replace(/\\/$/, "") === "/masterclass" ? "/masterclass" : "/masterclass2"}`,',
      'return_url: `${window.location.origin}/masterclass2`,',
    )
    .replace(
      "// Masterclass bank-authentication returns use /masterclass; other consumers keep their legacy /masterclass2 fallback. The\n",
      "// For bank-authentication redirects, the page returns to /masterclass2. The\n",
    );
}

function restore4799StripeReturn(source: string) {
  return source
    .replace(
      'return_url: `${window.location.origin}/masterclass`,',
      'return_url: `${window.location.origin}/masterclass2`,',
    )
    .replace(
      "// For bank-authentication redirects, the page returns to /masterclass. The\n",
      "// For bank-authentication redirects, the page returns to /masterclass2. The\n",
    );
}

const protectedPaths = [
  "client/src/components/masterclass2/VideoVisitCheckout.tsx",
  "client/src/components/masterclass2/VideoVisitPaypalPayment.tsx",
  "client/src/components/masterclass2/videoVisitCheckoutStorage.ts",
  "client/src/components/masterclass2/checkout4799/VideoVisitCheckout4799.tsx",
  "client/src/components/masterclass2/checkout4799/VideoVisitPaypalPayment4799.tsx",
  "client/src/components/masterclass2/checkout4799/videoVisitCheckout4799Storage.ts",
  "client/src/components/weight-loss-menopause-v2/checkout97/VideoVisitStripePayment97.tsx",
  "client/src/components/thank-you-video/IntakeVideoPayment.tsx",
  "client/src/pages/ThankYouVideo.tsx",
  "client/src/pages/ThankYouVideo4799.tsx",
  "client/src/pages/ThankYouVideo97.tsx",
  "server/routers.ts",
  "server/routers/masterclassVideo.ts",
  "server/routers/masterclassVideo4799.ts",
  "server/routers/menopauseVideo97.ts",
];

describe("approved masterclass route swap", () => {
  it("is exactly reversible to bd30bdec in App.tsx except for the two inverse route lines", () => {
    const app = read(appPath);

    expect(count(app, '<Route path="/masterclass" component={Masterclass2} />')).toBe(1);
    expect(count(app, '<Route path="/masterclass2" component={MasterclassVideoFirst} />')).toBe(1);
    expect(restoreAppRoutes(app)).toBe(readBaseline(appPath));
  });

  it("is exactly reversible in both page sources except for their canonical and og:url route metadata", () => {
    const masterclass2 = read(masterclass2Path);
    const masterclassVideoFirst = read(masterclassVideoFirstPath);

    expect(count(masterclass2, 'href="https://medmethoddirect.com/masterclass"')).toBe(1);
    expect(count(masterclass2, 'content="https://medmethoddirect.com/masterclass"')).toBe(1);
    expect(count(masterclassVideoFirst, 'href="https://medmethoddirect.com/masterclass2"')).toBe(1);
    expect(count(masterclassVideoFirst, 'content="https://medmethoddirect.com/masterclass2"')).toBe(1);
    expect(restoreApprovedFinalFaqPageLines(restoreMasterclass2RouteMetadata(masterclass2))).toBe(readBaseline(masterclass2Path));
    expect(restoreMasterclassVideoFirstRouteMetadata(masterclassVideoFirst)).toBe(
      readBaseline(masterclassVideoFirstPath),
    );
  });

  it("is exactly reversible in the Meta Pixel helper except for its two /masterclass2 path checks", () => {
    const pixel = read(pixelPath);

    expect(count(pixel, '=== "/masterclass2"')).toBe(1);
    expect(count(pixel, '!== "/masterclass2"')).toBe(1);
    expect(restorePixelPathChecks(pixel)).toBe(readBaseline(pixelPath));
  });

  it("is exactly reversible in crawler middleware except for the /masterclass2 noscript condition", () => {
    const crawler = read(crawlerPath);
    const condition = 'if (meta.url === `${BASE_URL}/masterclass2` && !page.includes(\'id="masterclass-meta-pixel-noscript"\')) {';

    expect(count(crawler, condition)).toBe(1);
    expect(restoreCrawlerNoscriptCondition(crawler)).toBe(readBaseline(crawlerPath));
  });

  it("is exactly reversible in the two Stripe modules except for approved return_url and comment updates", () => {
    const legacyStripe = read(legacyStripePath);
    const stripe4799 = read(stripe4799Path);

    expect(legacyStripe).toContain(
      'return_url: `${window.location.origin}${window.location.pathname.replace(/\\/$/, "") === "/masterclass" ? "/masterclass" : "/masterclass2"}`,',
    );
    expect(legacyStripe).toContain(
      "// Masterclass bank-authentication returns use /masterclass; other consumers keep their legacy /masterclass2 fallback. The",
    );
    expect(stripe4799).toContain('return_url: `${window.location.origin}/masterclass`,');
    expect(stripe4799).toContain(
      "// For bank-authentication redirects, the page returns to /masterclass. The",
    );
    expect(restoreLegacyStripeReturn(legacyStripe)).toBe(readBaseline(legacyStripePath));
    expect(restore4799StripeReturn(stripe4799)).toBe(readBaseline(stripe4799Path));
  });

  it("keeps payment contracts, prices, namespaces, and all thank-you sources byte-identical", () => {
    for (const path of protectedPaths) {
      expect(read(path), path).toBe(readBaseline(path));
    }
  });
});
