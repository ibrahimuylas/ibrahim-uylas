# iPhone Safari startup crash investigation

Reported device: iPhone 15 Pro Max, iOS 27.0. Safari and Chrome both fail.
User recording: `ScreenRecording_10-27-2026 17-57-12_1.mp4`, 330 frames, 5.55 seconds.

Observed video sequence:
- 2.1–2.7s: initial page, ancestor cards and main puppy photograph render.
- 2.8s: candidate-group background appears; candidate cards have not appeared.
- 2.9–3.0s: white page / restart.
- 3.1–3.5s: second startup repeats the same ancestor view.
- 3.6s: candidate-group background appears again.
- 3.7s onward: Safari says “A problem repeatedly occurred”.

This is consistent with browser page-process recovery, but the video alone does not prove the native crash trigger. The previous viewport-loop hypothesis was not reproduced and must not be presented as a confirmed cause.

Baseline on installed iOS 26.5 simulator (iPhone 17): production deployment opens and remains usable; cannot substitute for iOS 27.0. Primary domain DNS failed in simulator, so the identical immutable Netlify deployment was opened instead.

Installed iOS 27.0 runtime (24A434) using Xcode 27.1 (27A9275), then created and booted a dedicated iPhone 15 Pro Max simulator:
`E0BABABA-7BC7-430F-B639-67352FE04726` / `XX Safari iPhone 15 Pro Max`.

## Matching simulator observations

- Current production snapshot `https://6ae0e531092e03aab6d9827d--xx-uylas.netlify.app/` rendered the complete tree and stayed open, including a second navigation with `?repeat=1`.
- Local development baseline `http://localhost:4173/` also stayed open.
- Local A/B variant disabled only `.family-tree` descendant CSS animations and transitions; this also stayed open. Since the baseline did not fail, this comparison does **not** establish an animation cause.
- Filtered native logs contained no `processDidTerminate`, `didCrash`, `exceededMemory`, or `web process crash` entries for WebKit/MobileSafari. This narrow query cannot prove the absence of every possible native error.
- Direct `xx.uylas.net` navigation failed DNS in the local environment. Fetching HTTPS with the authoritative IP returned the current JS/CSS hashes, identical to the immutable deployment. The user's video shows a rendered page, so this local DNS issue does not explain the reported failure.
- Production bundle: `/assets/index--em3YoZ8.js`; stylesheet `/assets/index-xEPG8a7l.css`.
- No fix is confirmed. Simulator OS/device type match, but physical-device rendering/resource conditions may differ.

## Evidence

- `reported-video-opening.jpg`: frame-by-frame user recording excerpt.
- `simulator-production.png`: current production fully rendered on iOS 27.0.
- `simulator-production-reopen.png`: second production navigation.
- `simulator-tree-motion-off.png`: local motion isolation variant.
- `simulator-crash-filter.log`: bounded native log query, header only.
- Local simulator recording: `/tmp/xx-ios27-reopen.mp4`.

## Next discriminating observation

Asked the user to open the exact immutable production URL on the affected physical phone, to distinguish deployment/cache differences from a device-specific failure. A separate draft preview disables only tree CSS motion, with the same application JS and media, for a controlled follow-up if the baseline still fails.

`create-motion-preview.mjs` copies the existing `dist/client` to a temporary directory and injects one CSS override into its HTML. Run a **draft** Netlify deploy from that directory (no `--prod`). The temporary dev-only code was removed; `src/FamilyTree.jsx` is byte-identical to the pre-investigation backup. Production has not been changed by this investigation.


Draft motion-isolation preview: https://6ae0e8eaea17e9a388857faf--xx-uylas.netlify.app/ (deploy `6ae0e8eaea17e9a388857faf`). Confirmed HTTP 200, identical production JS/CSS hashes, CSS override present; matching iOS 27.0 simulator screenshot saved. Primary-domain HTML checked afterward: unchanged, no diagnostic CSS. No commit or push made.


## Physical-device A/B result and fix

The user retried both immutable links and confirmed: the baseline repeatedly reloads/crashes; the motion-isolation preview works. This establishes tree CSS animations/transitions as the differentiating trigger on the affected iPhone 15 Pro Max / iOS 27.0. It does not isolate a particular keyframe, transition, GPU fault, or WebKit defect.

Applied the exact tested tree descendant/pseudo-element `animation:none!important; transition:none!important` override under `(max-width:760px),(hover:none),(pointer:coarse)`. Touch landscape/tablet layouts are covered by input capabilities, not only portrait width. Desktop mouse/trackpad layouts retain existing animation. JavaScript camera movement and event handlers are unchanged.

Verification: 17 application tests, 4 packaging tests, production build passed. In-browser computed-style audit at 430px checked all 385 tree elements and their before/after pseudo-elements: zero animated/transitioning entries. All 17 dogs render. Zoom, Fit, puppy selection, real-to-AI carousel navigation and full profile opening/closing passed. At 1440px with fine pointer/hover, the mobile rule is false, photo animation remains `photo-arrive` and connector transitions remain `0.3s, 0.3s`. No browser console errors observed. Physical-device A/B is the regression reproduction; simulator alone did not reproduce the crash.

Published to https://xx.uylas.net as production deploy `6ae0ecf31d3e603ff2caccac`. Live page loads CSS `index-Cmv8i6n5.css` and JS `index-DPtxXrnN.js`. Production browser at 430px: 17 dogs, no broken images, no tree descendant/pseudo-element CSS motion. Production snapshot opened in matching iOS 27.0 simulator; screenshot saved at `qa/ios27/simulator-production-motion-fix.png`. No Git commit/push; unrelated root changes preserved. Final primary-domain physical-device retest remains with the user.
