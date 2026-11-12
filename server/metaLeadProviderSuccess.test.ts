import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  armExternalMetaLead,
  CARE_TEAM_CALENDAR_ID,
  isExternalMetaLeadExcludedContext,
  isVerifiedCareTeamBookingSuccess,
  isWebinarRegistrationNavigationMessage,
  WEBINAR_META_LEAD_BLOCKED_REASON,
  WEBINAR_REGISTRATION_FORM_ID,
  type ExternalMetaLeadWindow,
} from "../client/src/lib/metaLeadProviderSuccess";

const frame = {} as Window;
const anotherFrame = {} as Window;
const origin = "https://link.sendmeapro.com";
const success = ["msgsndr-booking-complete", {
  calendarId: CARE_TEAM_CALENDAR_ID,
  fingerprint: "synthetic-provider-receipt",
}];
const message = (data: unknown, source: MessageEventSource | null = frame, providerOrigin = origin) => ({
  data, source, origin: providerOrigin,
});
const location = (pathname = "/care-team-booking", search = "", hash = "") => ({ pathname, search, hash });

function host(context = location(), arm = vi.fn()) {
  return { location: context, MmdMetaLead: { arm } } as unknown as ExternalMetaLeadWindow;
}

describe("verified external Meta Lead completion", () => {
  it("accepts only the exact deployed calendar's documented completed-booking array", () => {
    expect(isVerifiedCareTeamBookingSuccess(message(success), frame)).toBe(true);
  });

  it.each([
    "https://untrusted.invalid",
    "https://link.sendmeapro.com.untrusted.invalid",
    "http://link.sendmeapro.com",
    "null",
    "https://app.gohighlevel.com",
  ])("rejects wrong provider origin %s", providerOrigin => {
    expect(isVerifiedCareTeamBookingSuccess(message(success, frame, providerOrigin), frame)).toBe(false);
  });

  it("rejects unrelated, missing, and unmounted iframe sources", () => {
    expect(isVerifiedCareTeamBookingSuccess(message(success, anotherFrame), frame)).toBe(false);
    expect(isVerifiedCareTeamBookingSuccess(message(success, null), frame)).toBe(false);
    expect(isVerifiedCareTeamBookingSuccess(message(success), null)).toBe(false);
    expect(isVerifiedCareTeamBookingSuccess(message(success), undefined)).toBe(false);
  });

  it.each([
    null,
    [],
    ["msgsndr-booking-complete"],
    ["msgsndr-booking-complete", null],
    ["msgsndr-booking-complete", []],
    ["msgsndr-booking-complete", {}],
    ["msgsndr-booking-complete", { calendarId: "another-calendar", fingerprint: "synthetic" }],
    ["msgsndr-booking-complete", { calendarId: CARE_TEAM_CALENDAR_ID }],
    ["msgsndr-booking-complete", { calendarId: CARE_TEAM_CALENDAR_ID, fingerprint: " " }],
    ["msgsndr-booking-complete", { calendarId: CARE_TEAM_CALENDAR_ID, fingerprint: 123 }],
    [...success, "unexpected"],
    JSON.stringify(success),
    { type: "calendarBooked", calendarId: CARE_TEAM_CALENDAR_ID },
    { type: "formSubmit", formId: WEBINAR_REGISTRATION_FORM_ID },
    ["modify-parent-url", "/care-team-booking-confirmed"],
    ["modify-parent-url", "/care-team-booking-confirmed?receipt=synthetic#confirmed"],
    ["formSubmit", WEBINAR_REGISTRATION_FORM_ID, "{}"],
    ["highlevel.setHeight", { height: 900 }],
    ["set-sticky-contacts", "_ud", "{}", "synthetic-location", "synthetic"],
  ])("never authorizes navigation/click/load/alias/nonreceipt data %#", data => {
    expect(isVerifiedCareTeamBookingSuccess(message(data), frame)).toBe(false);
  });

  it("does not return or forward provider contact/receipt data", () => {
    const arm = vi.fn();
    const data = ["msgsndr-booking-complete", {
      calendarId: CARE_TEAM_CALENDAR_ID,
      fingerprint: "synthetic-private-receipt",
      contact: { email: "synthetic@example.invalid" },
    }];
    if (isVerifiedCareTeamBookingSuccess(message(data), frame)) {
      armExternalMetaLead("/care-team-booking-confirmed", {}, host(location(), arm));
    }
    expect(arm.mock.calls).toEqual([["/care-team-booking-confirmed", { excluded: false }]]);
    expect(JSON.stringify(arm.mock.calls)).not.toMatch(/fingerprint|contact|email|synthetic/);
  });

  it("arms synchronously before the existing canonical navigation", () => {
    const operations: unknown[] = [];
    const arm = vi.fn((...args: unknown[]) => operations.push(["arm", ...args]));
    armExternalMetaLead("/care-team-booking-confirmed", {}, host(location(), arm));
    operations.push(["assign", "/care-team-booking-confirmed"]);
    expect(operations).toEqual([
      ["arm", "/care-team-booking-confirmed", { excluded: false }],
      ["assign", "/care-team-booking-confirmed"],
    ]);
  });

  it.each([
    "/unknown-confirmation", "/care-team-booking-confirmed?receipt=synthetic",
    "/care-team-booking-confirmed#completed", "https://medmethoddirect.com/care-team-booking-confirmed",
  ])("will not arm an arbitrary destination %s", destination => {
    const arm = vi.fn();
    armExternalMetaLead(destination, {}, host(location(), arm));
    expect(arm).not.toHaveBeenCalled();
  });

  it("preserves navigation when the helper is absent or throws", () => {
    expect(() => armExternalMetaLead("/care-team-booking-confirmed", {}, { location: location() } as unknown as ExternalMetaLeadWindow)).not.toThrow();
    expect(() => armExternalMetaLead("/care-team-booking-confirmed", {}, host(location(), vi.fn(() => { throw new Error("synthetic"); })))).not.toThrow();
  });

  it.each([
    location("/care-team-booking", "?test=1"),
    location("/care-team-booking", "?utm_source=synthetic"),
    location("/care-team-booking", "?source=admin"),
    location("/care-team-booking", "", "#demo"),
    location("/admin/care-team-booking"),
    location("/test/care-team-booking"),
    location("/demo/care-team-booking"),
  ])("excludes query/hash/test/demo/admin contexts %#", context => {
    const arm = vi.fn();
    armExternalMetaLead("/care-team-booking-confirmed", {}, host(context, arm));
    expect(arm).toHaveBeenCalledWith("/care-team-booking-confirmed", { excluded: true });
  });

  it("supports explicit exclusion for a source already identified by the caller", () => {
    const arm = vi.fn();
    expect(isExternalMetaLeadExcludedContext(location(), "webinar_live-webinar3")).toBe(false);
    for (const source of ["admin", "webinar_demo", "qa-test", "PREVIEW"]) {
      expect(isExternalMetaLeadExcludedContext(location(), source)).toBe(true);
    }
    armExternalMetaLead("/care-team-booking-confirmed", { excluded: true }, host(location(), arm));
    expect(arm).toHaveBeenCalledWith("/care-team-booking-confirmed", { excluded: true });
  });
});

describe("webinar redirect compatibility is NOT Lead authorization", () => {
  it("requires exact form identity, origin and iframe even for existing legacy navigation aliases", () => {
    const data = { type: "formSubmit", formId: WEBINAR_REGISTRATION_FORM_ID };
    expect(isWebinarRegistrationNavigationMessage(message(data), frame)).toBe(true);
    expect(isWebinarRegistrationNavigationMessage(message(JSON.stringify(data)), frame)).toBe(true);
    expect(isWebinarRegistrationNavigationMessage(message(data, anotherFrame), frame)).toBe(false);
    expect(isWebinarRegistrationNavigationMessage(message(data, frame, "https://app.gohighlevel.com"), frame)).toBe(false);
    expect(isWebinarRegistrationNavigationMessage(message(data), null)).toBe(false);
  });

  it.each([
    null, [], "not-json", "{bad json",
    { type: "formSubmit" },
    { type: "formSubmit", formId: "another-form" },
    { type: "formSubmit", formId: WEBINAR_REGISTRATION_FORM_ID, form_id: "another-form" },
    { type: "formSubmit", formId: null },
    { type: "click", formId: WEBINAR_REGISTRATION_FORM_ID },
    ["formSubmit", WEBINAR_REGISTRATION_FORM_ID, "{}"],
    ["modify-parent-url", "/webinar-registration-confirmed"],
    ["set-sticky-contacts", "_ud", "{}", "synthetic-location", "synthetic"],
  ])("rejects missing/wrong form IDs and undocumented array/redirect/sticky messages %#", data => {
    expect(isWebinarRegistrationNavigationMessage(message(data), frame)).toBe(false);
  });

  it("does not arm either webinar completion from an alias, CTA flag, page visit or provider redirect", () => {
    const dialog = readFileSync(resolve(process.cwd(), "client/src/components/WebinarRegistrationDialog.tsx"), "utf8");
    const live3 = readFileSync(resolve(process.cwd(), "client/src/pages/LiveWebinar3.tsx"), "utf8");
    expect(dialog).not.toContain("isWebinarRegistrationNavigationMessage");
    expect(dialog).not.toContain("armExternalMetaLead(");
    expect(dialog).not.toContain("MmdMetaLead.arm");
    expect(live3).toContain('confirmationPath="/live-webinar3-confirmed"');
    expect(WEBINAR_META_LEAD_BLOCKED_REASON).toContain("no exact-form persisted-success postMessage");
  });

  it("the booking hook only arms inside verified success and leaves legacy redirect independent", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/CareTeamBooking.tsx"), "utf8");
    expect(page).toContain("isVerifiedCareTeamBookingSuccess(event, calendarRef.current.contentWindow)");
    expect(page).toContain('18sbmUpLKjc7pcLE8jdN?redirect=false');
    expect(page).toContain("if (bookingCompletedRef.current) return;");
    expect(page.indexOf("armExternalMetaLead(CARE_TEAM_BOOKING_CONFIRMATION_PATH)")).toBeLessThan(page.indexOf("window.location.assign(CARE_TEAM_BOOKING_CONFIRMATION_PATH)"));
    expect(page).toContain("getCareTeamConfirmationRedirectTarget(event.data)");
    expect(page).toContain("window.location.assign(confirmationTarget)");
  });
});
