// ============================================================================
// blogPosts.ts — MedMethod Direct Blog Post Registry
// All blog articles are registered here. Add new posts by appending to the array.
// Slug must match the route path used in App.tsx.
// ============================================================================

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  pillar: "menopause-metabolism" | "glp1-education" | "hormone-therapy" | "longevity" | "symptoms-identity";
  pillarLabel: string;
  readTime: number; // minutes
  publishDate: string; // ISO format: YYYY-MM-DD
  author: {
    name: string;
    credentials: string;
    title: string;
  };
  primaryKeyword: string;
  metaDescription: string;
  heroImage?: string; // CDN URL
  featured?: boolean;
}

export const AUTHOR_DR_ALDEEK = {
  name: "Dr. Jumana Al-Deek",
  credentials: "DO",
  title: "Medical Director, MedMethod Direct",
};

export const blogPosts: BlogPost[] = [
  {
    slug: "why-weight-gain-feels-different-in-menopause",
    title: "Why Does Weight Gain Feel Different in Menopause?",
    excerpt:
      "You haven't changed what you eat or how you move — yet your body is behaving differently. Here's the honest biological explanation for why menopause changes the way your body stores fat, burns energy, and responds to food.",
    pillar: "menopause-metabolism",
    pillarLabel: "Menopause & Metabolism",
    readTime: 8,
    publishDate: "2026-03-27",
    author: AUTHOR_DR_ALDEEK,
    primaryKeyword: "menopause weight gain",
    metaDescription:
      "Why does weight gain feel so different in menopause? Dr. Jumana Al-Deek explains the hormonal science behind belly fat, insulin resistance, and what actually helps.",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/blog-hero-menopause-weight-gain-6fJgUvvmMCcQ26bctdpM5F.webp",
    featured: true,
  },
];

export const PILLAR_LABELS: Record<BlogPost["pillar"], string> = {
  "menopause-metabolism": "Menopause & Metabolism",
  "glp1-education": "GLP-1 Education",
  "hormone-therapy": "Hormone Therapy & Testosterone",
  "longevity": "Longevity & Healthy Aging",
  "symptoms-identity": "Symptoms & Feeling Like Yourself",
};

export const PILLAR_COLORS: Record<BlogPost["pillar"], string> = {
  "menopause-metabolism": "#E8339E",
  "glp1-education": "#7A1E7E",
  "hormone-therapy": "#C2185B",
  "longevity": "#6A1B9A",
  "symptoms-identity": "#AD1457",
};
