import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "docs", "compliance-verification");
const baseline = "c20c8501";
const current = "50c2f472";

const git = (...args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });

const atRevision = (revision, file) => git("show", `${revision}:${file}`);

function routeMap(appSource) {
  const imports = new Map();
  for (const match of appSource.matchAll(
    /const\s+(\w+)\s*=\s*lazy\(\(\)\s*=>\s*import\(["'](?:@\/|\.\/)pages\/([^"']+)["']\)\);/g,
  )) {
    imports.set(match[1], `client/src/pages/${match[2]}.tsx`);
  }

  const routes = [];
  for (const match of appSource.matchAll(
    /<Route\s+path=\{?["']([^"']+)["']\}?\s+component=\{(\w+)\}/g,
  )) {
    routes.push({ route: match[1], component: match[2], file: imports.get(match[2]) ?? "" });
  }
  return routes;
}

const beforeRoutes = routeMap(atRevision(baseline, "client/src/App.tsx"));
const afterRoutes = routeMap(atRevision(current, "client/src/App.tsx"));

const diff = git(
  "diff",
  "--name-status",
  `${baseline}..${current}`,
  "--",
  "client/src/pages/*.tsx",
  "client/src/articles/*.tsx",
  "client/src/components/**/*.tsx",
  "client/src/components/*.tsx",
  "client/index.html",
  "client/public/*",
  "server/**/*.ts",
);

const changedFiles = new Set(
  diff
    .trim()
    .split("\n")
    .filter(Boolean)
    .map(line => line.split("\t").at(-1)),
);

const beforeByRoute = new Map(beforeRoutes.map(item => [item.route, item]));
const afterByRoute = new Map(afterRoutes.map(item => [item.route, item]));
const visibleRouteSet = new Set();

for (const item of [...beforeRoutes, ...afterRoutes]) {
  if (item.file && changedFiles.has(item.file) && !item.route.includes(":")) visibleRouteSet.add(item.route);
}

for (const route of [
  "/",
  "/blog",
  "/blog/why-weight-gain-feels-different-in-menopause",
  "/blog/hormone-therapy-weight-sleep-metabolism",
  "/blog/putting-yourself-last-has-to-change",
  "/blog/semaglutide-vs-tirzepatide-women-midlife",
  "/locations",
  "/lp/hrt2",
  "/lp/hrt3",
  "/lp/WL",
  "/lp/WL2",
  "/terms",
  "/pricing-guide",
  "/male",
  "/the-menopause-weight-loss-trap",
  "/before-you-start-treatment",
  "/guide/how-it-works",
  "/start/women",
  "/lp/hrt",
  "/lp/glp1",
]) {
  visibleRouteSet.add(route);
}

const redirectDestinations = new Map([
  ["/male", "/"],
  ["/pricing-guide", "/"],
  ["/blog/semaglutide-vs-tirzepatide-women-midlife", "/blog"],
  ["/the-menopause-weight-loss-trap", "/"],
  ["/before-you-start-treatment", "/"],
  ["/guide/how-it-works", "/"],
  ["/start/women", "/"],
  ["/lp/hrt", "/lp/hrt3"],
  ["/lp/glp1", "/lp/WL"],
]);

const rows = [...visibleRouteSet]
  .sort((a, b) => a.localeCompare(b))
  .map(route => ({
    route,
    before_component: beforeByRoute.get(route)?.component ?? (route.startsWith("/blog/") ? "BlogPost" : "dynamic/manual"),
    after_component: afterByRoute.get(route)?.component ?? (redirectDestinations.has(route) ? "HTTP 301 redirect" : route.startsWith("/blog/") ? "BlogPost" : "dynamic/manual"),
    after_destination: redirectDestinations.get(route) ?? route,
    evidence_type: redirectDestinations.has(route) ? "before screenshot + redirect proof + destination screenshot" : "matched before/after screenshots",
  }));

const technicalEvidence = [
  "HTTP 301 redirect status and Location header for every discontinued URL",
  "Source and route removal for deleted legacy pages and modules",
  "Crawler metadata, sitemap, llms.txt, and blog-registry cleanup",
  "Exact 12-jurisdiction licensing text and removed-state scan",
  "Exact compounded-medication disclosure coverage",
  "Exact Florida women’s-testosterone disclosure coverage and placement",
  "Footer destination status checks and placeholder-link removal",
  "Prohibited-content zero-match scan",
  "TypeScript, 114 automated tests, compliance regression suite, and production build",
  "Preserved Stripe, PayPal, GHL webhook, scheduling, intake, and admin routes",
];

mkdirSync(outputDir, { recursive: true });
writeFileSync(path.join(outputDir, "evidence-matrix.json"), JSON.stringify({ baseline, current, screenshot_routes: rows, technical_evidence: technicalEvidence }, null, 2));
writeFileSync(
  path.join(outputDir, "screenshot-routes.txt"),
  rows.map(row => row.route).join("\n") + "\n",
);
writeFileSync(
  path.join(outputDir, "evidence-matrix.csv"),
  ["route,before_component,after_component,after_destination,evidence_type", ...rows.map(row => [row.route, row.before_component, row.after_component, row.after_destination, row.evidence_type].map(value => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n") + "\n",
);

console.log(JSON.stringify({ baseline, current, screenshot_routes: rows.length, technical_evidence_items: technicalEvidence.length, outputDir }, null, 2));
