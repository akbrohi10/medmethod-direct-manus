import asyncio
import json
import os
from pathlib import Path

from playwright.async_api import async_playwright


BEFORE_BASE = "https://3101-i1mvsg6sfw46rfj0913bv-e2da2539.us2.manus.computer"
AFTER_BASE = "https://3000-i1mvsg6sfw46rfj0913bv-e2da2539.us2.manus.computer"
OUTPUT_DIR = Path("/home/ubuntu/report-deliverables/mmd-compliance-verification/screenshots")

ROUTES = [
    "/",
    "/locations",
    "/lp/hrt2",
    "/lp/hrt3",
    "/lp/WL",
    "/lp/WL2",
    "/terms",
    "/blog",
    "/blog/why-weight-gain-feels-different-in-menopause",
    "/florida/boca-raton",
    "/virginia/arlington",
    "/pricing-guide",
    "/blog/semaglutide-vs-tirzepatide-women-midlife",
    "/male",
    "/the-menopause-weight-loss-trap",
]


def route_slug(route: str) -> str:
    if route == "/":
        return "homepage"
    return route.strip("/").replace("/", "--")


async def prepare_page(page, url: str) -> None:
    await page.goto(url, wait_until="domcontentloaded", timeout=45_000)
    try:
        await page.wait_for_function(
            """() => {
              const root = document.getElementById('root');
              return root && root.innerText.trim().length > 80;
            }""",
            timeout=30_000,
        )
    except Exception:
        pass
    await page.wait_for_timeout(1800)
    await page.evaluate(
        """async () => {
          const step = Math.max(500, Math.round(window.innerHeight * 0.8));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 70));
          }
          window.scrollTo(0, 0);
          await new Promise(resolve => setTimeout(resolve, 250));

          for (const element of document.querySelectorAll('body *')) {
            const style = getComputedStyle(element);
            if (style.position !== 'fixed') continue;
            const rect = element.getBoundingClientRect();
            const isTopHeader = rect.top <= 2 && rect.height <= 140;
            if (!isTopHeader) element.dataset.evidenceHide = 'true';
          }
        }"""
    )
    await page.add_style_tag(
        content="""
          [data-evidence-hide='true'] { display: none !important; }
          * { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; }
        """
    )


async def capture_pair(browser, route: str) -> dict:
    context = await browser.new_context(
        viewport={"width": 1280, "height": 720},
        device_scale_factor=1,
        reduced_motion="reduce",
    )
    page = await context.new_page()
    record = {"route": route, "before": {}, "after": {}, "success": True, "errors": []}

    for version, base in (("before", BEFORE_BASE), ("after", AFTER_BASE)):
        target = f"{base}{route}"
        try:
            await prepare_page(page, target)
            file_path = OUTPUT_DIR / f"{route_slug(route)}--{version}.png"
            await page.screenshot(path=str(file_path), full_page=True, animations="disabled")
            body_text = await page.locator("body").inner_text()
            record[version] = {
                "requestedUrl": target,
                "finalUrl": page.url,
                "title": await page.title(),
                "file": str(file_path),
                "bodyTextLength": len(body_text),
            }
        except Exception as exc:
            record["success"] = False
            record["errors"].append(f"{version}: {exc}")

    await context.close()
    return record


async def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path="/usr/bin/chromium",
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        results = []
        try:
            for route in ROUTES:
                result = await capture_pair(browser, route)
                results.append(result)
                print(
                    "\t".join(
                        [
                            "OK" if result["success"] else "FAIL",
                            route,
                            result.get("before", {}).get("finalUrl", ""),
                            result.get("after", {}).get("finalUrl", ""),
                        ]
                    ),
                    flush=True,
                )
        finally:
            await browser.close()

    manifest = {
        "beforeBase": BEFORE_BASE,
        "afterBase": AFTER_BASE,
        "viewport": {"width": 1280, "height": 720},
        "routeCount": len(ROUTES),
        "successfulPairs": sum(1 for result in results if result["success"]),
        "results": results,
    }
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(json.dumps({
        "routeCount": manifest["routeCount"],
        "successfulPairs": manifest["successfulPairs"],
        "outputDir": str(OUTPUT_DIR),
    }, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
