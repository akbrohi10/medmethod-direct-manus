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

describe("live webinar 3 exact duplicate", () => {
  it("registers an isolated public route without changing the existing webinar routes", () => {
    expect(appSource).toContain('const LiveWebinar3 = lazy(() => import("@/pages/LiveWebinar3"));');
    expect(appSource).toContain('<Route path="/live-webinar3" component={LiveWebinar3} />');
    expect(appSource).toContain('location === "/live-webinar3"');
    expect(appSource).toContain('<Route path="/live-webinar2" component={LiveWebinar2} />');
    expect(appSource).toContain('<Route path="/live-webinar" component={LiveWebinar} />');
  });

  it("matches the current live-webinar2 source exactly apart from its isolated component name", () => {
    expect(liveWebinar3Source.replace("export default function LiveWebinar3()", "export default function LiveWebinar2()"))
      .toBe(liveWebinar2Source);
  });
});
