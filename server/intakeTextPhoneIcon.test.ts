import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");

describe("intake pay-per-visit visual contract", () => {
  it("uses the Intro 97 teal hierarchy without an obsolete decorative phone illustration", () => {
    expect(source).toContain('className:"weight-intro intake-intro97"');
    expect(source).toContain('.intake-intro97 h1{color:#113a3a');
    expect(source).toContain('.intro97-step-number{color:#fff;background:#0e7c7b');
    expect(source).toContain('.intro97-pricing{background:#fff;border:1.5px solid #0e7c7b');
    expect(source).not.toContain('className:"intro-text-phone-icon"');
    expect(source).not.toContain('className:"intro-doctor"');
  });

  it("keeps the later plan card icon and the optional boolean video-interest control", () => {
    expect(source).toContain('.intro-care-icon{display:grid;place-items:center;width:80px;height:80px;border-radius:50%;background:#eef6f3;color:#075c5c');
    expect(source).toContain('.plan-consultation-card .intro-care-icon{align-self:start}');
    expect(source.match(/className:"intro-care-icon","aria-hidden":true,children:"\+"/g)).toHaveLength(1);
    expect(source).toContain("Pay-per-visit doctor care");
    expect(source).toContain("I'd like a video visit with Dr. Al-Deek - $97");
    expect(source).toContain('checked:answers.videoVisitInterest===true');
  });
});
