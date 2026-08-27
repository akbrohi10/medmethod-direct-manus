export const STANDARD_CONSULTATION_PRICING = {
  consultationTotalAmount: 19_900,
  depositAmount: 5_000,
  remainingAmount: 14_900,
  referralCreditAmount: 0,
} as const;

export const LECTURE50_REFERRAL_CREDIT = {
  code: "LECTURE50",
  allowedLandingPage: "/",
  consultationTotalAmount: 14_900,
  depositAmount: 5_000,
  remainingAmount: 9_900,
  referralCreditAmount: 5_000,
} as const;

export function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

export function resolveReferralCredit(code: string, landingPage: string) {
  const normalizedCode = normalizeReferralCode(code);
  const isLecture50 =
    normalizedCode === LECTURE50_REFERRAL_CREDIT.code &&
    landingPage === LECTURE50_REFERRAL_CREDIT.allowedLandingPage;

  if (!isLecture50) {
    return {
      applied: false as const,
      code: normalizedCode,
      ...STANDARD_CONSULTATION_PRICING,
    };
  }

  return {
    applied: true as const,
    ...LECTURE50_REFERRAL_CREDIT,
  };
}

export function formatUsdFromCents(amount: number): string {
  return (amount / 100).toFixed(2);
}
