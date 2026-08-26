// ============================================================================
// blogPosts.ts — MedMethod Direct Blog Post Registry
// All blog articles are registered here. Add new posts by appending to the array.
// Slug must match the route path used in App.tsx.
// ============================================================================

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  pillar: "menopause-metabolism" | "glp1-education" | "hormone-therapy" | "symptoms-identity";
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
  {
    slug: "what-is-food-noise-midlife",
    title: "What Is Food Noise and Why Is It So Common in Midlife?",
    excerpt:
      "The constant mental chatter about food — what you just ate, what you'll eat next, whether you should have eaten differently — has a name. And for women in perimenopause and menopause, it has a biological explanation.",
    pillar: "glp1-education",
    pillarLabel: "GLP-1 Education",
    readTime: 7,
    publishDate: "2026-03-27",
    author: AUTHOR_DR_ALDEEK,
    primaryKeyword: "food noise midlife",
    metaDescription:
      "What is food noise and why does it get louder in midlife? Dr. Jumana Al-Deek explains the hormonal science behind food preoccupation and what actually quiets it.",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/blog-hero-food-noise-GXQM8uF8FQQwQCbCHfGfng.webp",
  },
  {
    slug: "hormone-therapy-weight-sleep-metabolism",
    title: "Can Hormone Therapy Help With Weight, Sleep, and Metabolism?",
    excerpt: "The science on hormone therapy has moved significantly since 2002.",
    pillar: "hormone-therapy",
    pillarLabel: "Hormone Therapy for Women",
    readTime: 10,
    publishDate: "2026-03-27",
    author: AUTHOR_DR_ALDEEK,
    primaryKeyword: "hormone therapy weight loss menopause",
    metaDescription: "Can hormone therapy help with menopause weight gain, sleep, and metabolism?",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/blog-hero-hormone-therapy-MMsbifkEGanthJdeAvCaKS.webp",
  },
  {
    slug: "putting-yourself-last-has-to-change",
    title: "You've Been Putting Yourself Last for Years. Here's Why That Has to Change.",
    excerpt:
      "You've been managing everyone else's needs while quietly ignoring your own. The fatigue, the weight, the brain fog — they keep getting pushed to the bottom of the list. Here's what that's actually costing you, and what showing up for yourself looks like.",
    pillar: "symptoms-identity",
    pillarLabel: "Symptoms & Feeling Like Yourself",
    readTime: 8,
    publishDate: "2026-03-27",
    author: AUTHOR_DR_ALDEEK,
    primaryKeyword: "women's health midlife self-care",
    metaDescription:
      "If you've been putting your health last for years, this is your permission to stop. Dr. Jumana Al-Deek on why midlife is the moment to finally show up for yourself.",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663416709267/KyWCLydSK7KZUFLqfZ7cfe/blog-hero-putting-yourself-last-LJPmiKm4hbEMRAVjigBKWd.webp",
  },
];

export const PILLAR_LABELS: Record<BlogPost["pillar"], string> = {
  "menopause-metabolism": "Menopause & Metabolism",
  "glp1-education": "GLP-1 Education",
  "hormone-therapy": "Hormone Therapy for Women",
  "symptoms-identity": "Symptoms & Feeling Like Yourself",
};

export const PILLAR_COLORS: Record<BlogPost["pillar"], string> = {
  "menopause-metabolism": "#E8339E",
  "glp1-education": "#7A1E7E",
  "hormone-therapy": "#C2185B",
  "symptoms-identity": "#AD1457",
};
