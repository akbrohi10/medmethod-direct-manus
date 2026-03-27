// ============================================================================
// useSEO.ts — Dynamic SEO meta tag management for blog articles
// Sets document title, meta description, Open Graph, and JSON-LD schema
// ============================================================================
import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath?: string; // e.g. "/blog/why-weight-gain-feels-different-in-menopause"
  type?: "article" | "website";
  publishDate?: string;
  authorName?: string;
  authorCredentials?: string;
  imageUrl?: string;
  keywords?: string[];
}

const SITE_NAME = "MedMethod Direct";
const SITE_URL = "https://medmethoddirect.com";
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`;

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSEO({
  title,
  description,
  canonicalPath,
  type = "website",
  publishDate,
  authorName,
  authorCredentials,
  imageUrl,
  keywords,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    setMeta("description", description);
    if (keywords?.length) setMeta("keywords", keywords.join(", "));

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:image", imageUrl || DEFAULT_IMAGE, true);
    if (canonicalPath) {
      setMeta("og:url", `${SITE_URL}${canonicalPath}`, true);
      setLink("canonical", `${SITE_URL}${canonicalPath}`);
    }

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl || DEFAULT_IMAGE);

    // JSON-LD Schema
    if (type === "article" && publishDate) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        "name": title,
        "description": description,
        "url": canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL,
        "datePublished": publishDate,
        "author": {
          "@type": "Person",
          "name": authorName || "Dr. Jumana Al-Deek",
          "honorificSuffix": authorCredentials || "DO",
          "jobTitle": "Medical Director",
          "worksFor": {
            "@type": "MedicalOrganization",
            "name": SITE_NAME,
            "url": SITE_URL,
          },
        },
        "publisher": {
          "@type": "MedicalOrganization",
          "name": SITE_NAME,
          "url": SITE_URL,
        },
        "image": imageUrl || DEFAULT_IMAGE,
        "medicalAudience": {
          "@type": "MedicalAudience",
          "audienceType": "Patient",
        },
      };
      setJsonLd("blog-post-schema", schema);
    } else {
      // Organization schema for non-article pages
      const schema = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "description": "Premium virtual medical clinic focused on longevity, hormones, menopause, and medically guided weight loss.",
        "medicalSpecialty": ["Endocrinology", "Obstetrics and Gynecology", "Internal Medicine"],
      };
      setJsonLd("blog-post-schema", schema);
    }

    return () => {
      // Reset title on unmount
      document.title = `${SITE_NAME} — Your Path to Longevity`;
    };
  }, [title, description, canonicalPath, type, publishDate, authorName, authorCredentials, imageUrl, keywords]);
}
