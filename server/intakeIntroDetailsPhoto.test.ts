import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { inverseApprovedShippingApprovalWording } from "./intakeIntroDetailsPhotoScope.test";

const root = resolve(import.meta.dirname, "..");
const read = (path: string) => readFileSync(resolve(root, path), "utf8");
const source = read("client/intake/index.html");
const baseline = execFileSync("git", ["show", "0648c6e3:client/intake/index.html"], { cwd: root, encoding: "utf8" });
const packet = JSON.parse(read("server/fixtures/intakeIntroDetailsPhotoFragments.json"));
function fn(text: string, name: string) { const p = text.lastIndexOf(`function ${name}(`); expect(p).toBeGreaterThanOrEqual(0); return text.slice(p, text.indexOf("function ", p + 12)); }

describe("Weight Care How it works details CTA and doctor photo", () => {
  it("reverses only seven approved fragments to the complete prior intake and leaves metadata/validators/navigation intact", () => {
    expect(packet.html_fragments).toHaveLength(7);
    const beforeShippingApproval = inverseApprovedShippingApprovalWording("client/intake/index.html", source);
    let restored = beforeShippingApproval;
    for (const f of [...packet.html_fragments].reverse()) { expect(restored.split(f.new).length - 1).toBe(f.count); restored = restored.split(f.new).join(f.old); }
    expect(restored).toBe(baseline);
    expect(source.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]).toBe(baseline.match(/routes:JSON\.parse\(`(.*?)`\)/s)![1]);
    for (const name of ["se", "ie", "be", "MmdIntakeFlowScreens", "MmdIntakeMissingDetails", "MmdSigningPayloadReady", "MmdPhoneVerificationSatisfied"]) expect(fn(beforeShippingApproval, name)).toBe(fn(baseline, name));
  });

  it.each([false, true])("uses the exact same details button and supporting note when video=%s", video => {
    const body = source.slice(source.lastIndexOf("const canContinue="));
    expect(body).toContain('screen.id==="w01"?"Continue to my details":MmdIntakeSubmitScreen(screen)?');
    const label = new Function("screen", "answers", 'return screen.id==="w01"?"Continue to my details":MmdIntakeSubmitScreen(screen)?"other":"Continue"')({ id: "w01" }, { videoVisitInterest: video });
    expect(label).toBe("Continue to my details");
    expect(body).toContain('screen.id==="w01"&&(0,M.jsx)("p",{className:"intro97-footer-note",children:"Just one more step."})');
  });

  it("preserves heading, subtitle, every step, pricing, doctor text, video checkbox and fine print", () => {
    let restoredIntro = fn(source, "Ge");
    for (const f of [...packet.html_fragments].reverse()) if (restoredIntro.includes(f.new)) restoredIntro = restoredIntro.replace(f.new, f.old);
    expect(restoredIntro).toBe(fn(baseline, "Ge"));
    expect(source).toContain('id:"mmd-video-interest",type:"checkbox",checked:answers.videoVisitInterest===true,onChange:event=>onValue("videoVisitInterest",event.target.checked)');
    expect(source).toContain('className:"intro97-fine-print",children:"Prescriptions only when medically appropriate. Follow-up covers that visit\'s assessment and plan. New concerns or additional treatments require a separate visit."');
  });

  it("uses only a stable public assets path with a once-only permanent public fallback, never a temporary/manus-storage image", () => {
    const intro = fn(source, "Ge");
    expect(intro).toContain('src:"/assets/dr-jumana-al-deek-portrait.webp"');
    expect(intro).toContain('alt:"Dr. Jumana Al-Deek",width:88,height:88');
    expect(intro).toContain('if(image.dataset.publicPortraitFallback)return;');
    expect(intro).toContain('https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/NfYmKtEGqUrrcCpa.webp');
    expect(intro).not.toContain('/manus-storage/');
    expect(intro).not.toMatch(/Expires=|Signature=|X-Amz-/);
  });

  it("sizes only the doctor image column from its text height, preserves mobile width and tears down its read-only observer", () => {
    const intro = fn(source, "Ge");
    expect(intro).toContain('copy.getBoundingClientRect().height');
    expect(intro).toContain('mobile?68:');
    expect(intro).toContain('observer.disconnect();window.removeEventListener("resize",fit)');
    expect(source).toContain('height:var(--intro97-doctor-size,88px);object-fit:cover;object-position:center 25%;border-radius:12px');
    expect(source).toContain('.intro97-doctor img{width:68px;height:68px;align-self:start}');
    const hook = packet.html_fragments.find((f: { old: string }) => f.old === 'function Ge({answers,onValue}){return').new;
    expect(hook).not.toMatch(/onValue\(|fetch\(|sessionStorage|localStorage|\.click\(/);
  });

  it("registers the isolated public-only asset using exactly two additive lines", () => {
    let registration = read("server/intakeScaleExampleAsset.ts");
    for (const f of [...packet.registration_fragments].reverse()) { expect(registration.split(f.new).length - 1).toBe(1); registration = registration.replace(f.new, f.old); }
    expect(registration).toBe(execFileSync("git", ["show", "0648c6e3:server/intakeScaleExampleAsset.ts"], { cwd: root, encoding: "utf8" }));
    const asset = read("server/intakeDoctorPortraitAsset.ts");
    expect(createHash("sha256").update(asset).digest("hex")).toBe("4bfdfd2fb90bf8fab63aafb00c0e04c750b416cc6d58108b29364acc7631e159");
    expect(asset).not.toMatch(/req\.params|req\.query|req\.body|patient\.|submission|DATABASE_URL|JWT_SECRET|storagePut\(/);
  });
});

describe("Fixed public physician image endpoint", () => {
  beforeEach(() => { vi.resetModules(); });
  afterEach(() => { vi.unstubAllGlobals(); });
  async function invoke(response: Response | Error) {
    const fetch = vi.fn(); response instanceof Error ? fetch.mockRejectedValue(response) : fetch.mockResolvedValue(response); vi.stubGlobal("fetch", fetch);
    const module = await import("./intakeDoctorPortraitAsset"); let handler: any, registered = "";
    module.registerIntakeDoctorPortraitAsset({ get: (path: string, callback: any) => { registered = path; handler = callback; } } as any);
    const result = await new Promise<{ code: number; headers: Record<string, string>; bytes?: Buffer }>(resolveResult => {
      const output = { code: 0, headers: {} as Record<string, string>, bytes: undefined as Buffer | undefined };
      const res: any = { set: (headers: Record<string, string>) => { Object.assign(output.headers, headers); return res; }, status: (code: number) => { output.code = code; return res; }, send: (bytes: Buffer) => { output.bytes = bytes; resolveResult(output); }, end: () => resolveResult(output) };
      handler({}, res);
    });
    return { result, fetch, registered, module };
  }
  const webp = Buffer.from("RIFF1234WEBPpublic-example");
  it("returns valid WebP bytes, image MIME, nosniff and public cache from a fixed URL", async () => {
    const { result, fetch, registered, module } = await invoke(new Response(webp, { headers: { "content-type": "image/webp" } }));
    expect(registered).toBe("/assets/dr-jumana-al-deek-portrait.webp"); expect(result.code).toBe(200); expect(result.bytes).toEqual(webp);
    expect(result.headers).toEqual({ "Content-Type": "image/webp", "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" });
    expect(fetch).toHaveBeenCalledWith(module.INTAKE_DOCTOR_PORTRAIT_SOURCE, expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });
  it.each([
    new Response("<html>not an image</html>", { headers: { "content-type": "text/html" } }),
    new Response("wrong magic", { headers: { "content-type": "image/webp" } }),
    new Response(Buffer.alloc(200000), { headers: { "content-type": "image/webp" } }),
    new Response("unavailable", { status: 503 }),
    new Error("No public response"),
  ])("fails safely for unavailable, incorrect, oversized or non-image sources", async response => {
    const { result } = await invoke(response); expect(result.code).toBe(503); expect(result.headers).toEqual({ "Cache-Control": "no-store", "Retry-After": "30" }); expect(result.bytes).toBeUndefined();
  });
});
