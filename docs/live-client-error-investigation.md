# Live Client Error Investigation

## Diagnosis

The September 10 screenshot shows the application-level `ErrorBoundary` with the message **“An unexpected error occurred.”** Its stack-trace panel is blank, so the screenshot does not identify a specific throwing component. Fresh cache-busted requests to `https://medmethoddirect.com/` render the complete homepage with no console error, while the production server returns valid HTML and JavaScript assets. This rules out a persistent backend outage and makes a deterministic homepage rendering defect unlikely.

| Evidence | Finding | Significance |
|---|---|---|
| User screenshot | React reached the global error boundary, but no usable stack was displayed | Consistent with a rejected lazy route module or browser-hidden module-load error |
| Live cache-busted load | Homepage renders normally with a clean console | Current production assets are coherent for a fresh browser session |
| Live cache headers | HTML is not cached; hashed JavaScript assets are cached long-term | An already-open browser tab can retain an old entry bundle while a deployment replaces its lazy route chunks |
| Application routing | The homepage and all major routes use `React.lazy` dynamic imports | A stale hashed chunk request is capable of reaching the existing error boundary |
| Historical development logs | `main.tsx` temporarily imported `metaPixelBootstrap.ts` before that module existed | Rapid Pixel edits created an actual incomplete-module window during the same deployment period |
| Stable-to-current comparison | The principal later startup change is the synchronous route-aware Pixel bootstrap import | The recent Pixel work increased deployment churn and startup-module coupling, even though ordinary homepage requests do not execute a Pixel event |

The most likely cause is therefore a **deployment-transition asset mismatch in an existing browser tab**, made more likely by the rapid sequence of Pixel deployments and an interrupted module edit. The Meta event logic itself is route-gated and does not run on the homepage, so there is no evidence that the PageView, Lead, Schedule, or CompleteRegistration calls directly crashed the homepage.

## Recovery Decision

A broad rollback is not the safer choice because the latest feature-complete source builds cleanly, all 234 tests pass, every critical route returns HTTP 200, and desktop/mobile renders are healthy. Rolling back would remove approved homepage, booking, webinar, confirmation-page, and Pixel work without correcting the underlying stale-tab failure mode for future deployments.

The selected repair wraps every lazy route import with a one-time stale-asset recovery. When the browser reports a recognized dynamic-module or chunk-load failure, the app performs one cache-busting full navigation while preserving the current path, query string, and hash. A URL marker prevents reload loops, and ordinary component exceptions continue to reach the visible error boundary. The marker is removed after the route module loads successfully.
