export type Masterclass3VideoEvent =
  | "masterclass_video_start"
  | "masterclass_video_25"
  | "masterclass_video_50"
  | "masterclass_video_75"
  | "masterclass_video_90"
  | "masterclass_video_complete";

export interface YouTubePlayer {
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

export type Masterclass3YouTubePlayer = YouTubePlayer;

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

export interface YouTubeStateChangeEvent extends YouTubePlayerEvent {
  data: number;
}

export interface YouTubeAPI {
  Player: new (
    element: string | HTMLElement,
    options?: {
      events?: {
        onReady?: (event: YouTubePlayerEvent) => void;
        onStateChange?: (event: YouTubeStateChangeEvent) => void;
      };
    }
  ) => YouTubePlayer;
}

export interface Masterclass3TrackingTarget {
  gtag?: (command: "event", event: Masterclass3VideoEvent) => void;
  dataLayer?: { push: (payload: { event: Masterclass3VideoEvent }) => unknown };
  hj?: (command: "event", event: Masterclass3VideoEvent) => void;
}

/** Event names only; injected targets bypass the real-window preview guard. */
export function emitMasterclass3VideoEvent(
  event: Masterclass3VideoEvent,
  target?: Masterclass3TrackingTarget
): void {
  if (!target) {
    if (typeof window === "undefined") return;
    if (
      /(?:^|[\/_-])(?:demo|test|preview|admin)(?:[\/_-]|$)/i.test(
        window.location.pathname
      )
    )
      return;
    target = window as unknown as Masterclass3TrackingTarget;
  }

  // Choose exactly one Google transport, even if that transport throws.
  try {
    if (typeof target.gtag === "function") {
      target.gtag("event", event);
    } else {
      const queue =
        target.dataLayer ??
        (target.dataLayer = [] as { event: Masterclass3VideoEvent }[]);
      queue.push({ event });
    }
  } catch {
    // Analytics must not interrupt playback or the independent Hotjar event.
  }
  try {
    if (typeof target.hj === "function") target.hj("event", event);
  } catch {
    // An unavailable analytics provider must not interrupt playback.
  }
}

export interface Masterclass3VideoTracker {
  onStateChange(state: number, player: YouTubePlayer): void;
  poll(player: YouTubePlayer): void;
  dispose(): void;
}

const milestones = [
  [25, "masterclass_video_25"],
  [50, "masterclass_video_50"],
  [75, "masterclass_video_75"],
  [90, "masterclass_video_90"],
] as const;

/** Create one controller per page player; replay does not reset its event set. */
export function createMasterclass3VideoTracker(
  emit: (event: Masterclass3VideoEvent) => void = emitMasterclass3VideoEvent
): Masterclass3VideoTracker {
  const sent = new Set<Masterclass3VideoEvent>();
  let playing = false;
  let disposed = false;
  let timer: ReturnType<typeof setInterval> | undefined;
  let activePlayer: YouTubePlayer | undefined;

  function sendOnce(event: Masterclass3VideoEvent) {
    if (sent.has(event)) return;
    sent.add(event);
    try {
      emit(event);
    } catch {
      // A custom analytics sink must not break tracking or playback.
    }
  }

  function stopPolling() {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  }

  function poll(player: YouTubePlayer) {
    if (disposed || !playing) return;
    let current: number;
    let duration: number;
    try {
      current = player.getCurrentTime();
      duration = player.getDuration();
    } catch {
      return; // The iframe may be unavailable or already destroyed.
    }
    if (
      !Number.isFinite(current) ||
      current <= 0 ||
      !Number.isFinite(duration) ||
      duration <= 0
    )
      return;
    for (const [percentage, event] of milestones) {
      if (current >= (duration * percentage) / 100) sendOnce(event);
    }
  }

  return {
    onStateChange(state, player) {
      if (disposed) return;
      playing = state === 1; // YouTube PLAYING; all other states stop polling.
      activePlayer = player;
      if (playing) {
        sendOnce("masterclass_video_start");
        if (timer === undefined) {
          timer = setInterval(() => {
            if (activePlayer) poll(activePlayer);
          }, 1000);
        }
      } else {
        stopPolling();
        if (state === 0 && sent.has("masterclass_video_start")) {
          sendOnce("masterclass_video_complete"); // ENDED only, never a percentage.
        }
      }
    },
    poll,
    dispose() {
      disposed = true;
      playing = false;
      activePlayer = undefined;
      stopPolling();
    },
  };
}

// Local structural types avoid merging or conflicting with existing Window types.
type YouTubeWindow = {
  YT?: YouTubeAPI;
  onYouTubeIframeAPIReady?: () => void;
};
const apiURL = "https://www.youtube.com/iframe_api";
let apiPromise: Promise<YouTubeAPI> | undefined;

/** Load the API, not a video. No player creation or autoplay happens here. */
export function loadMasterclass3YouTubeAPI(): Promise<YouTubeAPI> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("YouTube API requires a browser"));
  }
  if (apiPromise) return apiPromise;
  const browser = window as unknown as YouTubeWindow;
  if (typeof browser.YT?.Player === "function") {
    apiPromise = Promise.resolve(browser.YT);
    return apiPromise;
  }

  apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const previousReady = browser.onYouTubeIframeAPIReady;
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${apiURL}"]`
    );
    const script = existing ?? document.createElement("script");

    function cleanup() {
      script.removeEventListener("error", failed);
      script.removeEventListener("load", loaded);
      if (browser.onYouTubeIframeAPIReady === ready) {
        browser.onYouTubeIframeAPIReady = previousReady;
      }
    }
    function resolveIfReady() {
      if (typeof browser.YT?.Player !== "function") return;
      cleanup();
      resolve(browser.YT);
    }
    function ready() {
      try {
        previousReady?.call(window);
      } catch {
        // Preserve the existing callback without letting its failure block us.
      } finally {
        resolveIfReady();
      }
    }
    function loaded() {
      resolveIfReady();
    }
    function failed() {
      cleanup();
      script.remove(); // Remove a failed tag so a later call can retry.
      reject(new Error("Unable to load YouTube IFrame API"));
    }

    browser.onYouTubeIframeAPIReady = ready;
    script.addEventListener("error", failed);
    script.addEventListener("load", loaded);
    if (!existing) {
      script.src = apiURL;
      script.async = true;
      try {
        document.head.appendChild(script);
      } catch {
        failed();
      }
    }
  }).catch(error => {
    apiPromise = undefined;
    throw error;
  });
  return apiPromise;
}
