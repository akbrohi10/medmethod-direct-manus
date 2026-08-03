/* =============================================================================
   SocialProofNotificationsLP.tsx — LP-specific social proof notifications
   Used ONLY on /lp/WL and /lp/hrt3.
   All messages are focused on booking the initial appointment with Dr. Al-Deek.
   No membership/package references.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  firstDelay: { min: 12000, max: 15000 },
  displayDuration: 6000,
  intervalBetween: { min: 22000, max: 28000 },
  maxPerSession: 4,
  maxPerSessionMobile: 3,
  dismissCooldown: 90000,
};

// ─── Location pool (all 17 licensed states) ───────────────────────────────────
const LOCATIONS = [
  "Florida",
  "Virginia",
  "Colorado",
  "Maryland",
  "Michigan",
  "Illinois",
  "Texas",
  "Arizona",
  "Tennessee",
  "New Jersey",
  "Washington, D.C.",
  "Georgia",
  "Alabama",
  "Washington",
  "North Carolina",
  "Pennsylvania",
  "Ohio",
];

// ─── Message categories ───────────────────────────────────────────────────────
type Category = "appointment" | "trust" | "scarcity";

interface NotificationMessage {
  category: Category;
  text: string;
}

const MESSAGES: NotificationMessage[] = [
  // CATEGORY 1: Appointment Activity (60%)
  { category: "appointment", text: "Someone just booked their initial consultation with Dr. Al-Deek." },
  { category: "appointment", text: "A new patient appointment was confirmed today." },
  { category: "appointment", text: "Someone just reserved their spot with a $50 deposit." },
  { category: "appointment", text: "A patient just took the first step toward personalized care." },
  { category: "appointment", text: "A new 45-minute consultation was just booked." },
  { category: "appointment", text: "Someone just secured their appointment with Dr. Al-Deek." },
  { category: "appointment", text: "A new consultation request was received today." },

  // CATEGORY 2: Physician Authority / Trust (30%)
  { category: "trust", text: "Same physician every visit — Dr. Al-Deek." },
  { category: "trust", text: "Direct access to Dr. Al-Deek, every appointment." },
  { category: "trust", text: "100% virtual care from the comfort of home." },
  { category: "trust", text: "Physician-led weight loss and menopause care." },
  { category: "trust", text: "Personalized care designed around your goals." },
  { category: "trust", text: "No rotating providers. One physician. Your plan." },
  { category: "trust", text: "Board-certified physician. Personalized protocol." },

  // CATEGORY 3: Limited Availability / Scarcity (10%)
  { category: "scarcity", text: "Dr. Al-Deek limits new patients to maintain personalized care." },
  { category: "scarcity", text: "New patient appointments are limited each month." },
  { category: "scarcity", text: "Spots fill quickly — appointments are held with a $50 deposit." },
  { category: "scarcity", text: "Personalized physician-led care requires limited onboarding." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pickLocation(): string {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateLocationMessage(): string {
  const location = pickLocation();
  const templates = [
    `Someone from ${location} just booked their consultation with Dr. Al-Deek.`,
    `A patient in ${location} just secured their appointment.`,
    `Someone from ${location} just took the first step toward personalized care.`,
    `A ${location} resident just reserved their spot with Dr. Al-Deek.`,
    `A new consultation was just booked from ${location}.`,
    `Someone in ${location} just scheduled their appointment.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function getFirstMessage(): string {
  const loc = pickLocation();
  return `Someone from ${loc} just booked their consultation with Dr. Al-Deek.`;
}

function pickMessage(lastMessage: string): string {
  const rand = Math.random();
  let targetCategory: Category;

  if (rand < 0.60) targetCategory = "appointment";
  else if (rand < 0.90) targetCategory = "trust";
  else targetCategory = "scarcity";

  // For appointment category, 60% chance of location-based message
  if (targetCategory === "appointment" && Math.random() < 0.6) {
    const msg = generateLocationMessage();
    if (msg !== lastMessage) return msg;
  }

  const pool = MESSAGES.filter(
    (m) => m.category === targetCategory && m.text !== lastMessage
  );

  if (pool.length === 0) {
    const fallback = MESSAGES.filter((m) => m.text !== lastMessage);
    return fallback[Math.floor(Math.random() * fallback.length)].text;
  }

  return pool[Math.floor(Math.random() * pool.length)].text;
}

function isMobile(): boolean {
  return window.innerWidth < 768;
}

// ─── Category Icon SVGs ──────────────────────────────────────────────────────
function CategoryIcon({ category }: { category: Category }) {
  const iconColor = "#E8339E";
  const size = 18;

  switch (category) {
    case "appointment":
      // Calendar icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="16" r="1.5" fill={iconColor} stroke="none" />
        </svg>
      );
    case "trust":
      // Heart icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A5.3 5.3 0 0 0 2 7c0 5 7 9.5 10 11.5C14.5 16.5 22 12 22 7a5.3 5.3 0 0 0-9.8-2.8L12 5l-.2-.8A5.3 5.3 0 0 0 4.8 2.3z" />
        </svg>
      );
    case "scarcity":
      // Clock icon
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
  }
}

// ─── Determine category from message text ────────────────────────────────────
function getCategoryFromMessage(msg: string): Category {
  const scarcityKeywords = ["limits", "limited", "fill quickly", "intentionally"];
  const appointmentKeywords = ["booked", "scheduled", "reserved", "secured", "consultation", "appointment", "first step", "deposit"];

  if (scarcityKeywords.some((k) => msg.toLowerCase().includes(k))) return "scarcity";
  if (appointmentKeywords.some((k) => msg.toLowerCase().includes(k))) return "appointment";
  return "trust";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SocialProofNotificationsLP() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("appointment");
  const [stopped, setStopped] = useState(false);
  const countRef = useRef(0);
  const lastMessageRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNotification = useCallback(() => {
    if (stopped) return;

    const maxAllowed = isMobile() ? CONFIG.maxPerSessionMobile : CONFIG.maxPerSession;
    if (countRef.current >= maxAllowed) {
      setStopped(true);
      return;
    }

    let msg: string;
    if (countRef.current === 0) {
      msg = getFirstMessage();
    } else {
      msg = pickMessage(lastMessageRef.current);
    }

    lastMessageRef.current = msg;
    setMessage(msg);
    setActiveCategory(getCategoryFromMessage(msg));
    setVisible(true);
    countRef.current += 1;

    timeoutRef.current = setTimeout(() => {
      setVisible(false);

      const maxAllowedNow = isMobile() ? CONFIG.maxPerSessionMobile : CONFIG.maxPerSession;
      if (countRef.current < maxAllowedNow) {
        const nextDelay = randomBetween(CONFIG.intervalBetween.min, CONFIG.intervalBetween.max);
        timeoutRef.current = setTimeout(showNotification, nextDelay);
      }
    }, CONFIG.displayDuration);
  }, [stopped]);

  useEffect(() => {
    if (sessionStorage.getItem("mm_social_proof_stopped") === "true") {
      setStopped(true);
      return;
    }

    const firstDelay = randomBetween(CONFIG.firstDelay.min, CONFIG.firstDelay.max);
    timeoutRef.current = setTimeout(showNotification, firstDelay);

    const handleCtaClick = () => {
      setStopped(true);
      sessionStorage.setItem("mm_social_proof_stopped", "true");
      setVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-social-proof-cta]').forEach((el) => {
        el.removeEventListener("click", handleCtaClick);
        el.addEventListener("click", handleCtaClick);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      observer.disconnect();
    };
  }, [showNotification]);

  if (stopped) return null;

  return (
    <div
      className={`fixed z-[9999] pointer-events-none`}
      style={{
        bottom: isMobile() ? "16px" : "24px",
        left: isMobile() ? "5%" : "24px",
        width: isMobile() ? "90%" : "360px",
      }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          visible
            ? "opacity-100 translate-x-0 translate-y-0 pointer-events-auto"
            : isMobile()
              ? "opacity-0 translate-y-8 pointer-events-none"
              : "opacity-0 -translate-x-12 pointer-events-none"
        }`}
      >
        <div
          className="flex items-stretch rounded-xl overflow-hidden"
          style={{
            background: "rgba(255, 255, 255, 0.97)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(232,51,158,0.08)",
            border: "1px solid rgba(232,51,158,0.12)",
          }}
        >
          {/* Left accent bar */}
          <div
            className="w-1 flex-shrink-0"
            style={{ background: "linear-gradient(180deg, #E8339E 0%, #7A1E7E 100%)" }}
          />

          {/* Icon */}
          <div
            className="flex items-center justify-center px-3"
            style={{ background: "rgba(232,51,158,0.06)" }}
          >
            <CategoryIcon category={activeCategory} />
          </div>

          {/* Message */}
          <div className="flex-1 px-3 py-3 min-w-0">
            <p
              className="text-[13px] leading-snug text-gray-700"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 500 }}
            >
              {message}
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ fontFamily: "Montserrat, sans-serif", color: "#E8339E", fontWeight: 600 }}
            >
              MedMethod Direct
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
