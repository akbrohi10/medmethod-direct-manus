# Live Webinar 2 Public Subtitle Verification

## Initial Public Check

On September 8, 2026, the live public `/live-webinar2` page contained the deployed English subtitle track with 12 timed cues, `readyState: 2`, and `trackMode: showing`. The active live cue matched the expected spoken content.

The native browser caption control is present but easy to miss in the video-control interface. A branded in-video overlay with a separate **CC On / CC Off** control has therefore been added in preview; its cue-state update is being verified after seek completion before release.

## Preview Overlay Check

The branded caption overlay displayed the active 00:02.5 cue inside the video boundary with **CC On**. The overlay rendered the expected two-line subtitle and the control reported `aria-pressed="true"`. Selecting the same control changed its label to **CC Off**, hid the overlay, and retained the timed source track in hidden mode for immediate reactivation.

When **CC On** was restored, the timed caption text was visibly present on the video again in the preview. This overlay makes the captions conspicuous independently of the browser's less-visible native captions menu.
