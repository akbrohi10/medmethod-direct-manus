import { describe, it, expect } from "vitest";
import {
  isCrawlerBot,
  getMetaForPath,
  generateCrawlerHtml,
  injectRouteMetaIntoHtml,
} from "./crawlerMiddleware";

describe("crawlerMiddleware", () => {
  describe("isCrawlerBot", () => {
    it("detects Facebook external hit", () => {
      expect(isCrawlerBot("facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)")).toBe(true);
    });

    it("detects Facebot", () => {
      expect(isCrawlerBot("Facebot")).toBe(true);
    });

    it("detects Twitterbot", () => {
      expect(isCrawlerBot("Twitterbot/1.0")).toBe(true);
    });

    it("detects WhatsApp", () => {
      expect(isCrawlerBot("WhatsApp/2.23.20.0 A")).toBe(true);
    });

    it("detects LinkedInBot", () => {
      expect(isCrawlerBot("LinkedInBot/1.0 (compatible; Mozilla/5.0)")).toBe(true);
    });

    it("detects TelegramBot", () => {
      expect(isCrawlerBot("TelegramBot (like TwitterBot)")).toBe(true);
    });

    it("detects Slackbot", () => {
      expect(isCrawlerBot("Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)")).toBe(true);
    });

    it("detects Discordbot", () => {
      expect(isCrawlerBot("Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)")).toBe(true);
    });

    it("detects Applebot (iMessage)", () => {
      expect(isCrawlerBot("Applebot/0.1 (+http://www.apple.com/go/applebot)")).toBe(true);
    });

    it("does NOT detect regular Chrome browser", () => {
      expect(
        isCrawlerBot(
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
      ).toBe(false);
    });

    it("does NOT detect regular Safari browser", () => {
      expect(
        isCrawlerBot(
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        )
      ).toBe(false);
    });

    it("does NOT detect Googlebot (we want Google to see the SPA)", () => {
      expect(isCrawlerBot("Googlebot/2.1 (+http://www.google.com/bot.html)")).toBe(false);
    });

    it("returns false for undefined user agent", () => {
      expect(isCrawlerBot(undefined)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isCrawlerBot("")).toBe(false);
    });
  });

  describe("getMetaForPath", () => {
    it("returns homepage meta for /", () => {
      const meta = getMetaForPath("/");
      expect(meta.title).toContain("MedMethod Direct");
      expect(meta.url).toBe("https://medmethoddirect.com");
    });

    it("returns Dr. Al-Deek meta for /dr-aldeek-booking", () => {
      const meta = getMetaForPath("/dr-aldeek-booking");
      expect(meta.title).toBe("Book with Dr. Jumana Al-Deek, DO | MedMethod Direct");
      expect(meta.image).toMatch(/cloudfront\.net|manuscdn\.com/);
      expect(meta.url).toBe("https://medmethoddirect.com/dr-aldeek-booking");
    });

    it("returns landing page meta for /lp/hrt2", () => {
      const meta = getMetaForPath("/lp/hrt2");
      expect(meta.title).toContain("Hormone Therapy");
      expect(meta.image).toMatch(/cloudfront\.net|manuscdn\.com/);
    });

    it("returns weight loss meta for /lp/WL", () => {
      const meta = getMetaForPath("/lp/WL");
      expect(meta.title).toContain("Weight Loss");
      expect(meta.description).toContain("weight loss");
    });

    it("returns dedicated social metadata for /masterclass", () => {
      const meta = getMetaForPath("/masterclass?utm_source=facebook");
      expect(meta.title).toBe("Free Masterclass: Menopause, Metabolism & Weight Loss");
      expect(meta.description).toBe(
        "Watch Dr. Jumana Al-Deek explain how hormones, metabolism, and medical weight loss connect—plus real questions from women 35+.",
      );
      expect(meta.image).toBe(
        "https://medmethoddirect.com/manus-storage/masterclass-social-share-1200x630_5f4c1cf1.png",
      );
      expect(meta.imageAlt).toContain("masterclass with Dr. Jumana Al-Deek");
      expect(meta.url).toBe("https://medmethoddirect.com/masterclass");
    });

    it("returns Texas meta for /texas", () => {
      const meta = getMetaForPath("/texas");
      expect(meta.title).toContain("Texas");
      expect(meta.image).toContain("texas-hero-state");
    });

    it("returns Arizona meta for /arizona", () => {
      const meta = getMetaForPath("/arizona");
      expect(meta.title).toContain("Arizona");
      expect(meta.image).toContain("az-hero-state");
    });

    it("returns Virginia meta for /virginia", () => {
      const meta = getMetaForPath("/virginia");
      expect(meta.title).toContain("Virginia");
    });

    it("strips trailing slash", () => {
      const meta = getMetaForPath("/dr-aldeek-booking/");
      expect(meta.title).toBe("Book with Dr. Jumana Al-Deek, DO | MedMethod Direct");
    });

    it("strips query string", () => {
      const meta = getMetaForPath("/lp/WL?utm_source=facebook");
      expect(meta.title).toContain("Weight Loss");
    });

    it("returns default meta for unknown routes", () => {
      const meta = getMetaForPath("/some-random-page");
      expect(meta.title).toContain("MedMethod Direct");
      expect(meta.image).toMatch(/cloudfront\.net|manuscdn\.com/);
    });
  });

  describe("generateCrawlerHtml", () => {
    it("generates valid HTML with all required meta tags", () => {
      const meta = getMetaForPath("/dr-aldeek-booking");
      const html = generateCrawlerHtml(meta);

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain('<meta property="og:title"');
      expect(html).toContain('<meta property="og:description"');
      expect(html).toContain('<meta property="og:image"');
      expect(html).toContain('<meta property="og:url"');
      expect(html).toContain('<meta property="og:type" content="website"');
      expect(html).toContain('<meta property="og:site_name" content="MedMethod Direct"');
      expect(html).toContain('<meta name="twitter:card" content="summary_large_image"');
      expect(html).toContain('<meta name="twitter:title"');
      expect(html).toContain('<meta name="twitter:description"');
      expect(html).toContain('<meta name="twitter:image"');
      expect(html).toContain('<link rel="canonical"');
      expect(html).toContain('<meta name="facebook-domain-verification" content="6gvdlzh2z653n5ezbhv5386mr0uqlu">');
    });

    it("HTML-escapes special characters in meta content", () => {
      const meta = {
        title: 'Test "Title" & <More>',
        description: "Desc with & and <tags>",
        image: "https://example.com/img.jpg",
        url: "https://example.com/test",
      };
      const html = generateCrawlerHtml(meta);

      expect(html).toContain("Test &quot;Title&quot; &amp; &lt;More&gt;");
      expect(html).toContain("Desc with &amp; and &lt;tags&gt;");
      expect(html).not.toContain('"Test "Title"');
    });

    it("includes og:image:width and og:image:height", () => {
      const meta = getMetaForPath("/");
      const html = generateCrawlerHtml(meta);

      expect(html).toContain('<meta property="og:image:width" content="1200"');
      expect(html).toContain('<meta property="og:image:height" content="630"');
    });

    it("includes accessible image labels for the masterclass social card", () => {
      const html = generateCrawlerHtml(getMetaForPath("/masterclass"));

      expect(html).toContain('<meta property="og:image:alt" content="Free on-demand menopause, metabolism, and weight loss masterclass with Dr. Jumana Al-Deek">');
      expect(html).toContain('<meta name="twitter:image:alt" content="Free on-demand menopause, metabolism, and weight loss masterclass with Dr. Jumana Al-Deek">');
    });
  });

  describe("injectRouteMetaIntoHtml", () => {
    it("replaces homepage metadata with exactly one masterclass image", () => {
      const shell = `<!doctype html><html><head>
        <title>Homepage</title>
        <meta name="description" content="Homepage description" />
        <meta property="og:title" content="Homepage" />
        <meta property="og:description" content="Homepage description" />
        <meta property="og:image" content="https://example.com/home.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com" />
        <meta property="og:site_name" content="Example" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Homepage" />
        <meta name="twitter:description" content="Homepage description" />
        <meta name="twitter:image" content="https://example.com/home.jpg" />
        <link rel="canonical" href="https://example.com" />
      </head><body></body></html>`;

      const html = injectRouteMetaIntoHtml(shell, getMetaForPath("/masterclass"));

      expect(html.match(/property="og:image"/g)).toHaveLength(1);
      expect(html.match(/name="twitter:image"/g)).toHaveLength(1);
      expect(html).not.toContain("home.jpg");
      expect(html).toContain("masterclass-social-share-1200x630_5f4c1cf1.png");
      expect(html).toContain('<meta property="og:url" content="https://medmethoddirect.com/masterclass" />');
      expect(html).toContain('<link rel="canonical" href="https://medmethoddirect.com/masterclass" />');
    });
  });
});
