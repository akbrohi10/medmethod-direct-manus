import { describe, expect, it } from "vitest";
import { isPreviewEnvironment } from "../client/src/lib/isPreviewEnvironment";

describe("preview environment detection", () => {
  it("allows temporary Manus preview hosts", () => {
    expect(isPreviewEnvironment("3000-demo.manus.computer")).toBe(true);
    expect(isPreviewEnvironment("preview.manuspre.computer")).toBe(true);
  });

  it("never enables a preview payment skip on live domains", () => {
    expect(isPreviewEnvironment("medmethoddirect.com")).toBe(false);
    expect(isPreviewEnvironment("www.medmethoddirect.com")).toBe(false);
    expect(isPreviewEnvironment("medmethod-kywclyds.manus.space")).toBe(false);
  });
});
