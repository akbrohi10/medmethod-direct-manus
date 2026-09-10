type MetaPixelWindow = typeof window & {
  fbq?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
};

const pendingMetaEvents = new Set<string>();
const deliveredMetaEvents = new Set<string>();

type TrackMetaEventWhenReadyOptions = {
  eventName: string;
  expectedPath: string;
  dedupeKey: string;
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
  dedupeKey,
  parameters,
  retryIntervalMs = 250,
  timeoutMs = 60_000,
}: TrackMetaEventWhenReadyOptions) {
  if (typeof window === "undefined" || window.location.pathname !== expectedPath) return;
  if (pendingMetaEvents.has(dedupeKey) || deliveredMetaEvents.has(dedupeKey)) return;
  pendingMetaEvents.add(dedupeKey);
  const startedAt = Date.now();

  const attemptDelivery = () => {
    if (window.location.pathname !== expectedPath) {
      pendingMetaEvents.delete(dedupeKey);
      return;
    }

    const fbq = (window as MetaPixelWindow).fbq;
    if (typeof fbq === "function") {
      fbq("track", eventName, parameters);
      deliveredMetaEvents.add(dedupeKey);
      pendingMetaEvents.delete(dedupeKey);
      return;
    }

    if (Date.now() - startedAt < timeoutMs) {
      window.setTimeout(attemptDelivery, retryIntervalMs);
      return;
    }

    pendingMetaEvents.delete(dedupeKey);
  };

  attemptDelivery();
}
