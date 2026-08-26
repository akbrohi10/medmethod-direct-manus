import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

function read(relativePath: string) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function listTextFiles(directory: string): string[] {
  const absolute = path.join(projectRoot, directory);
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) return listTextFiles(relative);
    return /\.(ts|tsx|html|xml|txt|md|json)$/.test(entry.name) ? [relative] : [];
  });
}

describe("Georgia, Illinois, and Michigan state hubs", () => {
  const states = [
    { name: "Georgia", slug: "georgia", file: "LocationGeorgia.tsx" },
    { name: "Illinois", slug: "illinois", file: "LocationIllinois.tsx" },
    { name: "Michigan", slug: "michigan", file: "LocationMichigan.tsx" },
  ] as const;

  it("registers each individual state page in the client router", () => {
    const app = read("client/src/App.tsx");
    for (const state of states) {
      expect(app).toContain(`import("@/pages/Location${state.name}")`);
      expect(app).toContain(`<Route path="/${state.slug}" component={Location${state.name}} />`);
    }
  });

  it("uses the compliant shared state-hub template with unique statewide content", () => {
    const shared = read("client/src/components/location/StateHubPage.tsx");
    expect(shared).toContain('"@type": "MedicalBusiness"');
    expect(shared).toContain('"@type": "FAQPage"');
    expect(shared).toContain('"@type": "BreadcrumbList"');
    expect(shared).toContain("Medical weight management (GLP-1)");
    expect(shared).toContain("Hormone therapy for women");
    expect(shared).toContain("Nutrition and vitamin optimization");
    expect(shared).toContain("Dermatology and skin");
    expect(shared).toContain("Hair restoration");
    expect(shared).toContain("nc-hero-state-BTbJpCUp5vmWkE8yyaagjE.webp");
    expect(shared).toContain("Telehealth consultation for women's health in ${state}");

    for (const state of states) {
      const page = read(`client/src/pages/${state.file}`);
      expect(page).toContain(`state="${state.name}"`);
      expect(page).toContain(`slug="${state.slug}"`);
      expect(page).toContain("regionalIntro=");
      expect(page).toContain("metaDescription=");
    }
  });

  it("exposes every new hub through locations, footer, sitemap, crawler metadata, and llms.txt", () => {
    const locations = read("client/src/pages/Locations.tsx");
    const footer = read("client/src/components/Footer.tsx");
    const sitemap = read("client/public/sitemap.xml");
    const crawler = read("server/crawlerMiddleware.ts");
    const llms = read("client/public/llms.txt");

    for (const state of states) {
      expect(locations).toContain(`name: "${state.name}"`);
      expect(locations).toContain(`href: "/${state.slug}"`);
      expect(footer).toContain(`{ label: "${state.name}", href: "/${state.slug}" }`);
      expect(sitemap).toContain(`<loc>https://medmethoddirect.com/${state.slug}</loc>`);
      expect(crawler).toContain(`"/${state.slug}": {`);
      expect(llms).toContain(`https://medmethoddirect.com/${state.slug}`);
    }
  });
});

describe("removed-state patient-service cleanup", () => {
  it("contains no Nevada, Oregon, or West Virginia patient-service references", () => {
    const files = [
      ...listTextFiles("client/src"),
      ...listTextFiles("client/public"),
      ...listTextFiles("server"),
    ].filter((file) => file !== "server/stateHubRoutes.test.ts" && file !== "server/legitScriptCompliance.test.ts");

    const allowedCredential = "West Virginia School of Osteopathic Medicine";
    const prohibited = ["Nevada", "Oregon", "West Virginia", "/nevada", "/oregon", "/west-virginia"];
    const violations: string[] = [];

    for (const file of files) {
      for (const [index, line] of read(file).split("\n").entries()) {
        if (line.includes(allowedCredential)) continue;
        if (prohibited.some((term) => line.includes(term))) {
          violations.push(`${file}:${index + 1}:${line.trim()}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
