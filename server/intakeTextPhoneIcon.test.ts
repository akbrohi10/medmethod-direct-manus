import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(import.meta.dirname, "../client/intake/index.html"), "utf8");

describe("intake introductory free-care phone icon", () => {
  it("uses one dark-frame, white-screen phone with teal and lavender conversation bubbles", () => {
    expect(source.match(/className:"intro-text-phone-icon"/g)).toHaveLength(1);
    const icon = source.slice(source.indexOf('className:"intro-text-phone-icon"'), source.indexOf('className:"intro-consultation-price"', source.indexOf('className:"intro-text-phone-icon"')));
    expect(icon).toContain('width:44,height:56,viewBox:"0 0 48 60"');
    for (const color of ["#20282E", "#FFFFFF", "#008F83", "#E9E7F5"]) expect(icon).toContain(`fill:"${color}"`);
    expect(icon).toContain('"aria-hidden":true,focusable:"false"');
    expect(icon).not.toMatch(/onClick|onChange|src:|children:"Your doctor"/);
  });

  it("keeps the existing circle, offer copy, optional interest and later plan-card icon", () => {
    expect(source).toContain('.intro-care-icon{display:grid;place-items:center;width:80px;height:80px;border-radius:50%;background:#eef6f3;color:#075c5c');
    expect(source).toContain('.plan-consultation-card .intro-care-icon{align-self:start}');
    expect(source.match(/className:"intro-care-icon","aria-hidden":true,children:"\+"/g)).toHaveLength(1);
    expect(source).toContain("Text-based doctor care");
    expect(source).toContain("I’m interested in adding a video visit — $39 per visit");
    expect(source).toContain('checked:answers.videoVisitInterest===true');
  });
});
