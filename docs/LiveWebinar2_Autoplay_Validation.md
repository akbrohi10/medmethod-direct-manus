# Live Webinar 2 Autoplay Validation

## Result

On September 8, 2026, the `/live-webinar2` preview loaded the visible speaking-event video with `paused: false`, `muted: true`, `readyState: 4`, and a progressing `currentTime`, confirming browser-compatible muted autoplay.

The visible **Turn Sound On** control unmuted the still-playing video without restarting it. After the video was scrolled out of view, it reported `paused: true`. When the video was returned to view, the sound control returned, confirming that the established view-based pause and muted-resume behavior remain active.

The user should perform a final live-domain check after publishing because device/browser autoplay preferences can vary.
