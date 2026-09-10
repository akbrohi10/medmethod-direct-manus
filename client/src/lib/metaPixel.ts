type MetaPixelWindow = typeof window & {
  fbq?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
};

const pendingMetaEvents = new Set<string>();

type TrackMetaEventWhenReadyOptions = {
  eventName: string;
  expectedPath: string;
  storageKey: string;
  parameters?: Record<string, unknown>;
  retryIntervalMs?: number;
  timeoutMs?: number;
};

/**
 * Sends one conversion event after the GTM-managed Meta Pixel becomes ready.
 * The event remains pending long enough for delayed consent/tag initialization,
 * aborts if the visitor leaves the confirmation route, and records completion
 * only after fbq accepted the event.
 */
export function trackMetaEventWhenReadyOnce({
  eventName,
  expectedPath,
  storageKey,
  parameters,
  retryIntervalMs = 250,
  timeoutMs = 60_000,
}: TrackMetaEventWhenReadyOptions) {
  if (typeof window === "undefined" || window.location.pathname !== expectedPath) return;

  try {
    if (window.sessionStorage.getItem(storageKey) === "1") return;
  } catch {
    // Continue with the in-memory guard when session storage is unavailable.
  }

  if (pendingMetaEvents.has(storageKey)) return;
  pendingMetaEvents.add(storageKey);
  const startedAt = Date.now();

  const attemptDelivery = () => {
    if (window.location.pathname !== expectedPath) {
      pendingMetaEvents.delete(storageKey);
      return;
    }

    const fbq = (window as MetaPixelWindow).fbq;
    if (typeof fbq === "function") {
      fbq("track", eventName, parameters);
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // The in-memory guard still prevents duplicates during this page visit.
      }
      pendingMetaEvents.delete(storageKey);
      return;
    }

    if (Date.now() - startedAt < timeoutMs) {
      window.setTimeout(attemptDelivery, retryIntervalMs);
      return;
    }

    pendingMetaEvents.delete(storageKey);
  };

  attemptDelivery();
}
