import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { crawlerMiddleware } from "./crawlerMiddleware";
import { injectCareTeamConfirmationPrivacyIntoHtml } from "./careTeamConfirmationPrivacy";
import type { Request, Response } from "express";

function request(path: string, originalUrl: string, referer?: string) {
  const req = { method: "GET", path, originalUrl, headers: { "user-agent": "normal browser", referer } } as Request;
  const res = { set: vi.fn(), redirect: vi.fn() };
  res.set.mockReturnValue(res);
  const next = vi.fn();
  crawlerMiddleware(req, res as unknown as Response, next);
  return { res, next };
}

describe("confirmation-only tracking URL privacy", () => {
  it("redirects any query string before returning HTML or loading pixels", () => {
    const { res, next } = request("/care-team-booking-confirmed", "/care-team-booking-confirmed?email=synthetic%40example.invalid&treatment=synthetic");
    expect(res.set).toHaveBeenCalledWith("Referrer-Policy", "no-referrer");
    expect(res.set).toHaveBeenCalledWith("Cache-Control", "no-store");
    expect(res.redirect).toHaveBeenCalledWith(302, "/care-team-booking-confirmed");
    expect(next).not.toHaveBeenCalled();
  });

  it("removes an incoming referrer by one clean no-referrer redirect", () => {
    const { res, next } = request("/care-team-booking-confirmed", "/care-team-booking-confirmed", "https://medmethoddirect.com/care-team-booking?booking=synthetic");
    expect(res.redirect).toHaveBeenCalledWith(302, "/care-team-booking-confirmed");
    expect(res.set).toHaveBeenCalledWith("Referrer-Policy", "no-referrer");
    expect(next).not.toHaveBeenCalled();
  });

  it("does not loop on the clean referrer-free page load", () => {
    const { res, next } = request("/care-team-booking-confirmed", "/care-team-booking-confirmed");
    expect(res.set).toHaveBeenCalledWith("Referrer-Policy", "no-referrer");
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it.each(["/care-team-booking", "/masterclass", "/webinar-registration-confirmed", "/", "/intake/"])("does not change URL or referrer handling on %s", path => {
    const { res, next } = request(path, `${path}?untouched=1`, "https://example.invalid/source");
    expect(res.set).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it("strips fragments and queries only on confirmation, before GTM and any Meta script", () => {
    const template = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    const html = injectCareTeamConfirmationPrivacyIntoHtml(template, "/care-team-booking-confirmed");
    const privacy = html.indexOf('id="care-team-confirmation-url-privacy"');
    expect(privacy).toBeGreaterThan(0);
    expect(privacy).toBeLessThan(html.indexOf("<!-- Google Tag Manager -->"));
    expect(html).toContain('window.history.replaceState(window.history.state, "", window.location.pathname);');
    expect(privacy).toBeLessThan(html.indexOf('id="confirmation-meta-pixel"'));
    expect(html.match(/id="confirmation-meta-pixel"/g)).toHaveLength(1);
    expect(html.indexOf('id="confirmation-meta-pixel"')).toBeLessThan(html.indexOf("</head>"));
    expect(html.match(/fbq\('init', '1589326469554181'\)/g)).toHaveLength(1);
    expect(html.match(/fbq\('track', 'PageView'\)/g)).toHaveLength(1);
    expect(html.match(/fbq\('track', 'Lead'\)/g)).toHaveLength(1);
    expect(html).not.toContain("mmd_lead_fired");
    expect(html).not.toContain("sessionStorage");
    expect(html).toContain("fbq('track', 'PageView');\nfbq('track', 'Lead');");
    expect(html).not.toContain("fbq('track', 'Schedule')");
    expect(html).not.toContain("fbq('track', 'Purchase')");
    expect(html.match(/id="care-team-confirmation-meta-pixel-noscript"/g)).toHaveLength(1);
    expect(html.indexOf('id="care-team-confirmation-meta-pixel-noscript"')).toBeGreaterThan(html.indexOf("<body"));
    expect(html).toContain('ev=PageView&amp;noscript=1');
    expect(injectCareTeamConfirmationPrivacyIntoHtml(html, "/care-team-booking-confirmed")).toBe(html);
    for (const path of ["/", "/masterclass", "/care-team-booking", "/intake/", "/webinar-registration-confirmed"]) {
      expect(injectCareTeamConfirmationPrivacyIntoHtml(template, path)).toBe(template);
    }
  });
});
