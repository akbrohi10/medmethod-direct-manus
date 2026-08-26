import json
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SCREENSHOT_DIR = Path(
    "/home/ubuntu/report-deliverables/mmd-compliance-verification/screenshots"
)
OUTPUT_DIR = Path(
    "/home/ubuntu/report-deliverables/mmd-compliance-verification/comparisons"
)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
        if bold
        else "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


TITLE = load_font(34, bold=True)
LABEL = load_font(25, bold=True)
SMALL = load_font(18)


def slugify(route: str) -> str:
    if route == "/":
        return "homepage"
    return re.sub(r"[^a-z0-9]+", "-", route.lower()).strip("-")


def fit_inside(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
    copy = image.copy()
    copy.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
    return copy


def top_crop(image: Image.Image, crop_height: int = 1050) -> Image.Image:
    return image.crop((0, 0, image.width, min(crop_height, image.height)))


def paste_center(canvas: Image.Image, image: Image.Image, box: tuple[int, int, int, int]) -> None:
    left, top, right, bottom = box
    x = left + (right - left - image.width) // 2
    y = top + (bottom - top - image.height) // 2
    canvas.paste(image, (x, y))


def build_board(entry: dict) -> Path:
    route = entry["route"]
    before_path = Path(entry["before"]["file"])
    after_path = Path(entry["after"]["file"])
    output = OUTPUT_DIR / f"{slugify(route)}-before-after.png"

    with Image.open(before_path).convert("RGB") as before, Image.open(after_path).convert(
        "RGB"
    ) as after:
        before_top = fit_inside(top_crop(before), 560, 460)
        after_top = fit_inside(top_crop(after), 560, 460)
        before_full = fit_inside(before, 560, 820)
        after_full = fit_inside(after, 560, 820)

        canvas = Image.new("RGB", (1260, 1520), "white")
        draw = ImageDraw.Draw(canvas)
        draw.rectangle((0, 0, 1260, 94), fill="#781f7f")
        draw.text((38, 25), f"Route: {route}", font=TITLE, fill="white")
        draw.text((155, 110), "BEFORE", font=LABEL, fill="#5b1b62")
        draw.text((805, 110), "AFTER", font=LABEL, fill="#5b1b62")

        draw.rounded_rectangle((34, 150, 614, 645), radius=14, outline="#d7c9d9", width=3)
        draw.rounded_rectangle((646, 150, 1226, 645), radius=14, outline="#d7c9d9", width=3)
        paste_center(canvas, before_top, (44, 160, 604, 635))
        paste_center(canvas, after_top, (656, 160, 1216, 635))

        draw.text((42, 666), "Full-page context", font=SMALL, fill="#4b4450")
        draw.rounded_rectangle((34, 700, 614, 1480), radius=14, outline="#dedede", width=2)
        draw.rounded_rectangle((646, 700, 1226, 1480), radius=14, outline="#dedede", width=2)
        paste_center(canvas, before_full, (44, 710, 604, 1470))
        paste_center(canvas, after_full, (656, 710, 1216, 1470))

        if entry["after"]["requestedUrl"] != entry["after"]["finalUrl"]:
            draw.rectangle((646, 610, 1226, 645), fill="#eef8f1")
            draw.text((660, 617), "After: permanent redirect destination", font=SMALL, fill="#176b36")

        canvas.save(output, optimize=True)
    return output


def main() -> None:
    manifest = json.loads((SCREENSHOT_DIR / "manifest.json").read_text())
    generated = [build_board(entry) for entry in manifest["results"]]
    print(f"generated={len(generated)}")
    for path in generated:
        print(path)


if __name__ == "__main__":
    main()
