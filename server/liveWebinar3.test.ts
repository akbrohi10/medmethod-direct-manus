import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
const liveWebinar2Source = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar2.tsx"),
  "utf8",
);
const liveWebinar3Source = readFileSync(
  resolve(process.cwd(), "client/src/pages/LiveWebinar3.tsx"),
  "utf8",
);

describe("live webinar 3 A/B variation", () => {
  it("registers an isolated public route without changing the existing webinar routes", () => {
    expect(appSource).toContain('const LiveWebinar3 = lazy(() => import("@/pages/LiveWebinar3"));');
    expect(appSource).toContain('<Route path="/live-webinar3" component={LiveWebinar3} />');
    expect(appSource).toContain('location === "/live-webinar3"');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
  });

  it("uses only the approved simplified banner and top-video hierarchy changes", () => {
    expect(liveWebinar3Source).toContain("Free Webinar");
    expect(liveWebinar3Source).not.toContain("A Free Educational Webinar");
    expect(liveWebinar3Source).toContain("data-webinar3-top-video");
    expect(liveWebinar3Source).toContain("data-webinar2-video-shell");
    expect(liveWebinar3Source).toContain("data-webinar2-video-captions");
    expect(liveWebinar3Source).toContain("data-webinar2-primary-cta");
    expect(liveWebinar3Source.indexOf("data-webinar2-top-event")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar3-top-video"),
    );
    expect(liveWebinar3Source.indexOf("data-webinar3-top-video")).toBeLessThan(
      liveWebinar3Source.indexOf("data-webinar2-opening-copy"),
    );
    expect(liveWebinar3Source).not.toBe(liveWebinar2Source);
  });
});
