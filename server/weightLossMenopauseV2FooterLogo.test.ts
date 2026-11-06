import { describe,it,expect } from "vitest";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { inverseV2FooterLogo,newV2FooterLogo,oldV2FooterLogo } from "./fixtures/v2FooterLogoScope";
import { inverseV2TestimonialReadMore } from "./fixtures/v2TestimonialReadMoreScope";
import { inverseV2TestimonialTextAction } from "./fixtures/v2TestimonialTextActionScope";
const read=(p:string)=>inverseV2TestimonialReadMore(p,inverseV2TestimonialTextAction(p,readFileSync(p,"utf8")));
const page="client/src/pages/WeightLossMenopauseV2.tsx", source=()=>read(page),base=(p:string)=>execFileSync("git",["show","cf73e20f:"+p],{encoding:"utf8"});
describe("V2 regular footer logo only",()=>{
 it("replaces the footer label with the existing regular centered clinic logo",()=>{expect(source()).toContain(newV2FooterLogo);expect(source()).not.toContain(oldV2FooterLogo);expect(newV2FooterLogo).toContain('alt="MedMethod Direct"');expect(newV2FooterLogo).toContain('margin: "0 auto"');expect(newV2FooterLogo).toContain('/manus-storage/medmethod-logo-navbar_99a2ea82.png');});
 it("restores the whole V2 page exactly and keeps every stylesheet and shared component unchanged",()=>{expect(inverseV2FooterLogo(page,source())).toBe(base(page));for(const p of ["client/src/pages/WeightLossMenopauseV2.css","client/src/components/Navbar.tsx","client/src/pages/WeightLossMenopauseV2DoctorBio.tsx","client/src/pages/WeightLossMenopauseV2MobileBar.tsx"])expect(read(p)).toBe(base(p));});
 it("freezes the exact logo helper without registering imported tests",()=>{expect(createHash("sha256").update(readFileSync("server/fixtures/v2FooterLogoScope.ts")).digest("hex")).toBe("2b2c90128a438022efef3785c2262a529b8a5a25ed6be9e426a89c21b9675391");});
 it("rejects a changed or duplicated logo without ignoring unrelated source",()=>{expect(()=>inverseV2FooterLogo(page,source()+newV2FooterLogo)).toThrow();expect(()=>inverseV2FooterLogo(page,source().replace('width: "240px"','width: "241px"'))).toThrow();expect(inverseV2FooterLogo("other.tsx",source())).toBe(source());});
});
