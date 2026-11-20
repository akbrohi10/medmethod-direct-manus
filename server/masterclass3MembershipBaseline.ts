import { beforeMasterclass3Hero } from "./masterclass3HeroBaseline";

export const MEMBERSHIP_ADDITION = `                <p data-masterclass3-membership-benefits className="mt-3 text-sm leading-relaxed text-[#443b43] sm:text-base"><strong className="font-bold">Membership includes:</strong> Direct secure messaging with Dr. Al-Deek, medication and dosing management, prescription refills, and lab review.</p>
                <p data-masterclass3-membership-video className="mt-2 text-sm leading-relaxed text-[#443b43] sm:text-base"><strong className="font-bold">Additional video visits for members: $50 each</strong>, charged separately.</p>
                <p data-masterclass3-membership-cancellation className="mt-2 text-xs leading-relaxed text-[#766d75]">Cancel anytime with 30 days’ notice.</p>
`;

export function beforeMasterclass3Membership(path: string, source: string): string {
  source = beforeMasterclass3Hero(path, source);
  if (path !== "client/src/pages/Masterclass3.tsx" || !source.includes("data-masterclass3-membership-")) return source;
  if (source.split(MEMBERSHIP_ADDITION).length !== 2 || (source.match(/data-masterclass3-membership-/g) ?? []).length !== 3) {
    throw new Error("V3 membership inverse requires exactly the three approved paragraphs");
  }
  return source.replace(MEMBERSHIP_ADDITION, "");
}
