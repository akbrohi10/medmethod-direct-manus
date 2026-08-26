import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const beforeBase = "https://3101-i1mvsg6sfw46rfj0913bv-e2da2539.us2.manus.computer";
const afterBase = "https://3000-i1mvsg6sfw46rfj0913bv-e2da2539.us2.manus.computer";
const outputDir = "/home/ubuntu/report-deliverables/mmd-compliance-verification/screenshots";

const routes = [
  "/",
  "/locations",
  "/lp/hrt2",
  "/lp/hrt3",
  "/lp/WL",
  "/lp/WL2",
  "/terms",
  "/blog",
  "/blog/why-weight-gain-feels-different-in-menopause",
  "/florida/boca-raton",
  "/virginia/arlington",
  "/pricing-guide",
  "/blog/semaglutide-vs-tirzepatide-women-midlife",
  "/male",
  "/the-menopause-weight-loss-trap",
];

const slug = route => (route === "/" ? "homepage" : route.replace(/^\//, "").replaceAll("/", "--"));

async function preparePage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForFunction(() => {
    const root = document.getElementById("root");
    return root && root.innerText.trim().length > 80;
  }, { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(1_800);

  await page.evaluate(async () => {
    const step = Math.max(500, Math.round(window.innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
    }
    window.scrollTo(0, 0);
    await new Promise(resolve => setTimeout(resolve, 250));

    for (const element of document.querySelectorAll("body *")) {
      const style = getComputedStyle(element);
      if (style.position !== "fixed") continue;
      const rect = element.getBoundingClientRect();
      const isTopHeader = rect.top <= 2 && rect.height <= 140;
      if (!isTopHeader) element.dataset.evidenceHide = "true";
    }
  });

  await page.addStyleTag({
    content: `
      [data-evidence-hide="true"] { display: none !important; }
      * { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; }
    `,
  });
}

async function capture(browser, route) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const record = { route, before: {}, after: {}, success: true, errors: [] };

  for (const [version, base] of [["before", beforeBase], ["after", afterBase]]) {
    const target = `${base}${route}`;
    try {
      await preparePage(page, target);
      const file = path.join(outputDir, `${slug(route)}--${version}.png`);
      await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
      record[version] = {
        requestedUrl: target,
        finalUrl: page.url(),
        title: await page.title(),
        file,
        bodyTextLength: await page.locator("body").innerText().then(text => text.length).catch(() => 0),
      };
    } catch (error) {
      record.success = false;
      record.errors.push(`${version}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  await context.close();
  return record;
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ executablePath: "/usr/bin/chromium", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const results = [];

try {
  for (const route of routes) {
    const result = await capture(browser, route);
    results.push(result);
    console.log(`${result.success ? "OK" : "FAIL"}\t${route}\t${result.before.finalUrl ?? ""}\t${result.after.finalUrl ?? ""}`);
  }
} finally {
  await browser.close();
}

const manifest = {
  generatedAt: new Date().toISOString(),
  beforeBase,
  afterBase,
  viewport: { width: 1280, height: 720 },
  routeCount: routes.length,
  successfulPairs: results.filter(item => item.success).length,
  results,
};

await writeFile(path.join(outputDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify({ routeCount: manifest.routeCount, successfulPairs: manifest.successfulPairs, outputDir }, null, 2));
