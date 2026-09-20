import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const readSource = (relativePath: string) =>
  readFileSync(resolve(root, relativePath), "utf8");

const externalLinksSource = readSource("client/src/lib/externalLinks.ts");
const appSource = readSource("client/src/App.tsx");
const serverSource = readSource("server/_core/index.ts");
const homepageFooterSource = readSource("client/src/components/home1/Footer.tsx");
const secondaryFooterSource = readSource("client/src/components/Footer.tsx");
const legacyNavbarSource = readSource("client/src/components/Navbar.tsx");
const blogSectionSource = readSource("client/src/components/Blog.tsx");

describe("external Dr. Jumana Al-Deek blog destination", () => {
  it("defines one canonical destination", () => {
    expect(externalLinksSource).toContain(
      'export const DR_JUMANA_AL_DEEK_BLOG_URL = "https://drjumanaaldeek.com/blog";',
    );
  });

  it("redirects both the former blog index and article URLs to the external blog", () => {
    expect(appSource).toContain("function ExternalBlogRedirect()");
    expect(appSource).toContain("window.location.replace(DR_JUMANA_AL_DEEK_BLOG_URL);");
    expect(appSource).toContain('<Route path={"/blog"} component={ExternalBlogRedirect} />');
    expect(appSource).toContain('<Route path={"/blog/:slug"} component={ExternalBlogRedirect} />');
    expect(appSource).not.toContain('<Route path={"/blog"} component={BlogIndex} />');
    expect(appSource).not.toContain('<Route path={"/blog/:slug"} component={BlogPost} />');
    expect(serverSource).toContain('app.get("/blog", (_req, res) =>');
    expect(serverSource).toContain('app.get("/blog/*", (_req, res) =>');
    expect(serverSource).toContain('res.redirect(301, "https://drjumanaaldeek.com/blog")');
  });

  it("sends every visible site-owned blog call-to-action to the canonical external blog", () => {
    for (const source of [
      homepageFooterSource,
      secondaryFooterSource,
      legacyNavbarSource,
      blogSectionSource,
    ]) {
      expect(source).toContain('import { DR_JUMANA_AL_DEEK_BLOG_URL } from "@/lib/externalLinks";');
      expect(source).toContain("DR_JUMANA_AL_DEEK_BLOG_URL");
    }

    expect(blogSectionSource).not.toContain('href="/blog"');
    expect(blogSectionSource).not.toContain("href={`/blog/${article.slug}`}");
  });
});
