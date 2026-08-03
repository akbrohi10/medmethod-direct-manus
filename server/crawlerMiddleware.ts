/**
 * Lightweight Crawler-Detection Middleware
 *
 * Detects social media bot user-agents and returns minimal static HTML
 * with correct per-route OG/Twitter meta tags for link previews.
 * Regular users get the normal React SPA (next() is called).
 */
import type { Request, Response, NextFunction } from "express";

// ─── Bot User-Agent Patterns ────────────────────────────────────────────────
const BOT_USER_AGENTS = [
  "facebookexternalhit", // Facebook / Messenger
  "Facebot",            // Facebook crawler
  "Twitterbot",         // Twitter/X
  "WhatsApp",           // WhatsApp
  "LinkedInBot",        // LinkedIn
  "TelegramBot",        // Telegram
  "Slackbot",           // Slack
  "Discordbot",         // Discord
  "Applebot",           // Apple (iMessage link previews, Siri)
  "Pinterest",          // Pinterest
  "Embedly",            // Embedly (used by many platforms)
  "Quora Link Preview", // Quora
  "Showyoubot",         // Showyou
  "vkShare",            // VK
  "W3C_Validator",      // W3C
  "Iframely",           // Iframely (used by Reddit, etc.)
  "outbrain",           // Outbrain
  "Baiduspider",        // Baidu (for link previews)
];

/**
 * Check if a user-agent string belongs to a social media crawler/bot.
 */
export function isCrawlerBot(userAgent: string | undefined): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}

// ─── Route Meta Data ────────────────────────────────────────────────────────

interface RouteMeta {
  title: string;
  description: string;
  image: string;
  url: string;
}

const SITE_NAME = "MedMethod Direct";
const BASE_URL = "https://medmethoddirect.com";

// Default OG image (used for homepage and fallback)
// files.manuscdn.com serves as image/jpeg — correct content-type for all social crawlers
const DEFAULT_OG_IMAGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/gQaqEInQGsbxCqPk.jpg";

// Hero image (used for Dr. Al-Deek and landing pages)
// Same branded image — correct content-type, shows the Dr. Al-Deek branded card in iMessage/social previews
const HERO_IMAGE =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/gQaqEInQGsbxCqPk.jpg";

// State-specific hero images
const STATE_IMAGES: Record<string, string> = {
  florida:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/florida-hub-hero-ggUpBHC7z4TNuVPwpZ8K58.webp",
  "north-carolina":
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/nc-hero-state-BTbJpCUp5vmWkE8yyaagjE.webp",
  pennsylvania:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/pa-hero-state-FoXJjK2ovNWFFhvKLaRMvL.webp",
  colorado:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/co-hero-state-LHRPRyCbvcv2PfGZZrD6R3.webp",
  arizona:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/az-hero-state-EwZEMZx6BjJT36PS22ktj2.png",
  texas:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/texas-hero-state-D4wnfSxoKugiKcDpFB6xoE.png",
};

/**
 * Per-route meta tag definitions.
 * Routes not listed here will use the default fallback.
 */
const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "MedMethod Direct | Virtual Hormone Therapy & GLP-1 Weight Loss for Women",
    description:
      "Physician-led virtual hormone therapy, menopause care, and GLP-1 weight loss — 100% virtual. Board-certified care with Dr. Al-Deek. Book your consultation today.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663416709267/gQaqEInQGsbxCqPk.jpg",
    url: BASE_URL,
  },
  "/dr-aldeek-booking": {
    title: "Book with Dr. Jumana Al-Deek, DO | MedMethod Direct",
    description:
      "Schedule your virtual appointment with Dr. Jumana Al-Deek, DO — Board-Certified Physician specializing in hormone therapy, menopause care, and medical weight loss.",
    image: HERO_IMAGE,
    url: `${BASE_URL}/dr-aldeek-booking`,
  },
  "/lp/hrt": {
    title: "Hormone Therapy & Weight Loss — 100% Virtual | MedMethod Direct",
    description:
      "Board-certified physician-led hormone therapy, menopause care, and GLP-1 weight loss — 100% virtual. Book your consultation with Dr. Al-Deek today.",
    image: HERO_IMAGE,
    url: `${BASE_URL}/lp/hrt`,
  },
  "/lp/hrt2": {
    title: "Hormone Therapy & Weight Loss — 100% Virtual | MedMethod Direct",
    description:
      "Board-certified physician-led hormone therapy, menopause care, and GLP-1 weight loss — 100% virtual. Book your consultation with Dr. Al-Deek today.",
    image: HERO_IMAGE,
    url: `${BASE_URL}/lp/hrt2`,
  },
  "/lp/WL": {
    title: "A Custom Medical Weight Loss Plan Built Around You | MedMethod Direct",
    description:
      "Physician-prescribed medical weight loss — custom plan built around you. Book a 45-minute virtual consultation with Dr. Al-Deek. No insurance needed. $50 deposit today.",
    image: HERO_IMAGE,
    url: `${BASE_URL}/lp/WL`,
  },
  "/lp/hrt3": {
    title: "Is Hormone Therapy Right for You? | MedMethod Direct",
    description:
      "Book a 45-minute virtual consultation with Dr. Al-Deek — personalized hormone therapy or GLP-1 weight loss, if it's right for you. 100% virtual. $50 deposit today.",
    image: HERO_IMAGE,
    url: `${BASE_URL}/lp/hrt3`,
  },
  // ─── State Pages ────────────────────────────────────────────────────────
  "/virginia": {
    title:
      "Virtual Hormone, Menopause & Weight Loss Doctor in Virginia | MedMethod Direct",
    description:
      "Virginia's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Virginia.",
    image: DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/virginia`,
  },
  "/florida": {
    title:
      "Virtual Hormone, Menopause & Weight Loss Doctor in Florida | MedMethod Direct",
    description:
      "Expert virtual hormone therapy, GLP-1 medical weight loss & menopause care for women throughout Florida. Physician-prescribed semaglutide, BHRT & testosterone. Free consultation.",
    image:
      STATE_IMAGES["florida"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/florida`,
  },
  "/maryland": {
    title:
      "Virtual Hormone, Menopause & Weight Loss Doctor in Maryland | MedMethod Direct",
    description:
      "Maryland's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Maryland.",
    image: DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/maryland`,
  },
  "/washington-dc": {
    title:
      "Virtual Hormone, Menopause & Weight Loss Doctor in Washington DC | MedMethod Direct",
    description:
      "Washington DC's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of DC.",
    image: DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/washington-dc`,
  },
  "/colorado": {
    title: "Colorado Women's Health | MedMethod Direct",
    description:
      "Virtual hormone therapy & GLP-1 weight loss for women across Colorado. Board-certified physicians, no office visit required.",
    image:
      STATE_IMAGES["colorado"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/colorado`,
  },
  "/arizona": {
    title: "Arizona Women's Health | MedMethod Direct",
    description:
      "Premium virtual hormone therapy, medical weight loss, and menopause care for Arizona women. Scottsdale, Paradise Valley, Chandler, Gilbert, Tempe, Tucson.",
    image:
      STATE_IMAGES["arizona"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/arizona`,
  },
  "/north-carolina": {
    title: "North Carolina Women's Health | MedMethod Direct",
    description:
      "Virtual hormone therapy & GLP-1 weight loss for women across North Carolina. Board-certified physicians, no office visit required.",
    image:
      STATE_IMAGES["north-carolina"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/north-carolina`,
  },
  "/pennsylvania": {
    title: "Pennsylvania Women's Health | MedMethod Direct",
    description:
      "Virtual hormone therapy & GLP-1 weight loss for women across Pennsylvania. Board-certified physicians, no office visit required.",
    image:
      STATE_IMAGES["pennsylvania"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/pennsylvania`,
  },
  "/texas": {
    title:
      "Virtual Hormone, Menopause & Weight Loss Doctor in Texas | MedMethod Direct",
    description:
      "Texas's premier virtual hormone therapy, GLP-1 medical weight loss & menopause clinic. Physician-prescribed semaglutide, BHRT & testosterone — serving all of Texas.",
    image:
      STATE_IMAGES["texas"] || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/texas`,
  },
};

// Default fallback meta (same as index.html)
const DEFAULT_META: RouteMeta = {
  title: "MedMethod Direct | Physician-Led Hormone & Metabolic Care",
  description:
    "Physician-led virtual clinical care for hormone optimization, menopause management, metabolic health, and longevity medicine for women. 100% virtual, licensed in 17 states.",
  image: DEFAULT_OG_IMAGE,
  url: BASE_URL,
};

/**
 * Get the meta data for a given path.
 * Exact match first, then fallback to default.
 */
export function getMetaForPath(path: string): RouteMeta {
  // Normalize: strip trailing slash (except root), strip query string
  const cleanPath = path.split("?")[0].replace(/\/$/, "") || "/";
  return ROUTE_META[cleanPath] || DEFAULT_META;
}

/**
 * HTML-escape a string to prevent XSS in meta tag content.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Generate minimal HTML page with OG/Twitter meta tags for crawlers.
 */
export function generateCrawlerHtml(meta: RouteMeta): string {
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const img = escapeHtml(meta.image);
  const url = escapeHtml(meta.url);
  const siteName = escapeHtml(SITE_NAME);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${t}</title>
<meta name="description" content="${d}">
<!-- Open Graph -->
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="${url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${siteName}">
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/x-icon" href="https://medmethoddirect.com/favicon.ico">
<link rel="shortcut icon" href="https://medmethoddirect.com/favicon.ico">
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
</body>
</html>`;
}

/**
 * Express middleware that intercepts social media crawler requests
 * and returns minimal HTML with correct OG/Twitter meta tags.
 * Regular users pass through to the React SPA.
 */
export function crawlerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Only intercept GET requests (crawlers only do GET)
  if (req.method !== "GET") {
    next();
    return;
  }

  // Skip API routes, static assets, and storage proxy
  const path = req.path;
  if (
    path.startsWith("/api/") ||
    path.startsWith("/manus-storage/") ||
    path.startsWith("/src/") ||
    path.startsWith("/@") ||
    path.startsWith("/node_modules/") ||
    path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map|webp|mp4|webm)$/)
  ) {
    next();
    return;
  }

  const userAgent = req.headers["user-agent"];
  if (!isCrawlerBot(userAgent)) {
    next();
    return;
  }

  // Bot detected — serve minimal HTML with OG tags
  const meta = getMetaForPath(path);
  const html = generateCrawlerHtml(meta);

  console.log(
    `[Crawler Middleware] Bot detected: ${userAgent?.substring(0, 50)} → ${path}`
  );

  res.status(200).set({ "Content-Type": "text/html; charset=utf-8" }).send(html);
}
