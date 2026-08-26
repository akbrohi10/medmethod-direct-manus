import asyncio
from pathlib import Path

from playwright.async_api import async_playwright


URL = "https://3102-i1mvsg6sfw46rfj0913bv-e2da2539.us2.manus.computer/male"
OUTPUT = Path("/home/ubuntu/report-deliverables/mmd-compliance-verification/screenshots/male--before.png")


async def main() -> None:
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            executable_path="/usr/bin/chromium",
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        page = await browser.new_page(
            viewport={"width": 1280, "height": 720},
            device_scale_factor=1,
            reduced_motion="reduce",
        )
        await page.goto(URL, wait_until="domcontentloaded", timeout=45_000)
        await page.wait_for_function(
            """() => {
              const root = document.getElementById('root');
              return root && root.innerText.trim().length > 80;
            }""",
            timeout=30_000,
        )
        await page.wait_for_timeout(1800)
        await page.evaluate(
            """async () => {
              const step = Math.max(500, Math.round(window.innerHeight * 0.8));
              for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
                window.scrollTo(0, y);
                await new Promise(resolve => setTimeout(resolve, 70));
              }
              window.scrollTo(0, 0);
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
        await page.screenshot(path=str(OUTPUT), full_page=True, animations="disabled")
        print(f"captured={OUTPUT}")
        print(f"final_url={page.url}")
        print(f"title={await page.title()}")
        await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
