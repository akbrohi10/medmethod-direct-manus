/* =============================================================================
   SocialProofNotifications.tsx — Subtle FOMO / social proof notification system
   Premium, healthcare-appropriate design. No database, pre-written messages only.
   Brand: Montserrat, Medical Pink #E8339E, Deep Purple #7A1E7E
   ============================================================================= */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Configuration ────────────────────────────────────────────────────────────
const CONFIG = {
  firstDelay: { min: 18000, max: 25000 },       // 18–25 seconds before first
  displayDuration: 6000,                          // 6 seconds visible
  intervalBetween: { min: 45000, max: 60000 },   // 45–60 seconds between
  maxPerSession: 4,                               // max 4 notifications
  maxPerSessionMobile: 3,                         // max 3 on mobile
  dismissCooldown: 90000,                         // 90s after manual dismiss
};

// ─── Location pool (all 17 licensed states) ───────────────────────────────────
const LOCATIONS = [
  "Florida",
  "Virginia",
  "Maryland",
  "Colorado",
  "North Carolina",
  "Pennsylvania",
  "Arizona",
  "Texas",
  "Georgia",
  "South Carolina",
  "Tennessee",
  "New Jersey",
  "Ohio",
  "Michigan",
  "Illinois",
  "Indiana",
  "Washington",
];

// ─── Message categories with weights ─────────────────────────────────────────
type Category = "discovery" | "membership" | "trust" | "scarcity";

interface NotificationMessage {
  category: Category;
  text: string;
}

const MESSAGES: NotificationMessage[] = [
  // CATEGORY 1: Discovery Call Activity (55%)
  { category: "discovery", text: "Someone recently scheduled a free discovery call." },
  { category: "discovery", text: "A new discovery call was booked today." },
  { category: "discovery", text: "Someone just took the next step with Med Method Direct." },
  { category: "discovery", text: "A visitor recently requested more information." },
  { category: "discovery", text: "A new patient inquiry was received today." },
  { category: "discovery", text: "Someone is exploring physician-led care." },
  { category: "discovery", text: `Someone from ${pickLocation()} recently scheduled a discovery call.` },
  { category: "discovery", text: `A ${pickLocation()} resident recently requested more information.` },
  { category: "discovery", text: `Someone from ${pickLocation()} is exploring physician-led care.` },
  { category: "discovery", text: `A ${pickLocation()} resident recently took the next step.` },

  // CATEGORY 2: Membership Interest (20%)
  { category: "membership", text: "Transformation is currently our most selected membership." },
  { category: "membership", text: "Someone recently joined Med Method Direct." },
  { category: "membership", text: "A new member recently selected the Transformation membership." },
  { category: "membership", text: "More patients are choosing physician-led care." },
  { category: "membership", text: "Transformation remains our most requested option." },
  { category: "membership", text: "A new member recently joined one of our care memberships." },
  { category: "membership", text: "Members across multiple states are choosing Med Method Direct." },

  // CATEGORY 3: Physician Authority / Trust (20%)
  { category: "trust", text: "Same physician every visit." },
  { category: "trust", text: "Direct access to Dr. Al-Deek." },
  { category: "trust", text: "100% virtual care from the comfort of home." },
  { category: "trust", text: "Physician-led weight loss and menopause care." },
  { category: "trust", text: "Personalized care designed around long-term success." },
  { category: "trust", text: "No rotating providers. One physician-led care team." },
  { category: "trust", text: "Care built around continuity, coaching, and accountability." },

  // CATEGORY 4: Limited Onboarding / Quality Care (5%)
  { category: "scarcity", text: "Dr. Al-Deek limits onboarding to maintain personalized care." },
  { category: "scarcity", text: "New patient enrollment is managed to protect quality of care." },
  { category: "scarcity", text: "Personalized physician-led care requires limited onboarding." },
  { category: "scarcity", text: "Med Method Direct intentionally limits patient volume." },
  { category: "scarcity", text: "Discovery calls help determine if the program is a good fit." },
];

// First notification is always this:
const FIRST_MESSAGE = "Someone recently scheduled a free discovery call.";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pickLocation(): string {
  return LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeightedMessage(lastMessage: string): string {
  const rand = Math.random();
  let targetCategory: Category;

  if (rand < 0.55) targetCategory = "discovery";
  else if (rand < 0.75) targetCategory = "membership";
  else if (rand < 0.95) targetCategory = "trust";
  else targetCategory = "scarcity";

  const pool = MESSAGES.filter(
    (m) => m.category === targetCategory && m.text !== lastMessage
  );

  if (pool.length === 0) {
    // Fallback: pick any message that's not the last one
    const fallback = MESSAGES.filter((m) => m.text !== lastMessage);
    return fallback[Math.floor(Math.random() * fallback.length)].text;
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];

  // For location-based messages, regenerate with fresh location
  if (picked.text.includes("${pickLocation()}")) {
    return picked.text;
  }

  return picked.text;
}

function generateLocationMessage(): string {
  const location = pickLocation();
  const templates = [
    `Someone from ${location} recently scheduled a discovery call.`,
    `A ${location} resident recently requested more information.`,
    `Someone from ${location} is exploring physician-led care.`,
    `A ${location} resident recently took the next step.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function pickMessage(lastMessage: string): string {
  const rand = Math.random();
  let targetCategory: Category;

  if (rand < 0.55) targetCategory = "discovery";
  else if (rand < 0.75) targetCategory = "membership";
  else if (rand < 0.95) targetCategory = "trust";
  else targetCategory = "scarcity";

  // For discovery category, 40% chance of using a location-based message
  if (targetCategory === "discovery" && Math.random() < 0.4) {
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

// ─── Component ────────────────────────────────────────────────────────────────
export default function SocialProofNotifications() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
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

    // Pick message
    let msg: string;
    if (countRef.current === 0) {
      msg = FIRST_MESSAGE;
    } else {
      msg = pickMessage(lastMessageRef.current);
    }

    lastMessageRef.current = msg;
    setMessage(msg);
    setVisible(true);
    countRef.current += 1;

    // Auto-hide after display duration
    timeoutRef.current = setTimeout(() => {
      setVisible(false);

      // Schedule next notification
      const maxAllowedNow = isMobile() ? CONFIG.maxPerSessionMobile : CONFIG.maxPerSession;
      if (countRef.current < maxAllowedNow) {
        const nextDelay = randomBetween(CONFIG.intervalBetween.min, CONFIG.intervalBetween.max);
        timeoutRef.current = setTimeout(showNotification, nextDelay);
      }
    }, CONFIG.displayDuration);
  }, [stopped]);

  useEffect(() => {
    // Check if session already stopped (e.g., user clicked CTA)
    if (sessionStorage.getItem("mm_social_proof_stopped") === "true") {
      setStopped(true);
      return;
    }

    // Don't show on /discovery-call or /book pages
    if (
      window.location.pathname === "/discovery-call" ||
      window.location.pathname === "/book"
    ) {
      return;
    }

    // Start first notification after random delay
    const firstDelay = randomBetween(CONFIG.firstDelay.min, CONFIG.firstDelay.max);
    timeoutRef.current = setTimeout(showNotification, firstDelay);

    // Listen for CTA clicks to stop notifications
    const handleCtaClick = () => {
      setStopped(true);
      sessionStorage.setItem("mm_social_proof_stopped", "true");
      setVisible(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    // Attach to CTA buttons
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[data-social-proof-cta]').forEach((el) => {
        el.removeEventListener("click", handleCtaClick);
        el.addEventListener("click", handleCtaClick);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also listen for navigation to /discovery-call
    const handlePopState = () => {
      if (
        window.location.pathname === "/discovery-call" ||
        window.location.pathname === "/book"
      ) {
        setVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      observer.disconnect();
      window.removeEventListener("popstate", handlePopState);
    };
  }, [showNotification]);

  // Don't render if stopped or on booking pages
  if (stopped) return null;

  return (
    <div
      className={`fixed z-[9999] pointer-events-none`}
      style={{
        bottom: isMobile() ? "16px" : "24px",
        left: isMobile() ? "5%" : "24px",
        width: isMobile() ? "90%" : "340px",
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
        className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl"
        style={{
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow:
            "0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(232, 51, 158, 0.12)",
        }}
      >
        {/* Pulse dot indicator */}
        <div className="flex-shrink-0 relative">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #E8339E 0%, #7A1E7E 100%)" }}
          />
          <div
            className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
            style={{
              background: "rgba(232, 51, 158, 0.4)",
              animationDuration: "2s",
            }}
          />
        </div>

        {/* Message text */}
        <p
          className="text-[13px] md:text-[13.5px] leading-snug text-gray-700"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 450 }}
        >
          {message}
        </p>
      </div>
      </div>
    </div>
  );
}
