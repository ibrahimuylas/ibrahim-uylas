# Mobile profile sheet and immersive tree — 27 October 2026

- Mobile (up to 1024px): dog/gallery-label/candidate taps push one profile overlay history entry. No inspector is mounted below the tree. Desktop selection remains a sidebar inspection; full profile remains a right drawer.
- Native dialog bottom sheet: 92dvh, rounded top, visible grip, transform-only entry/exit, scrollable content, close button, backdrop dismissal, Escape and reduced-motion support. Downward drag from header, or from non-interactive content when its scroll begins at zero, dismisses after sufficient distance or velocity. Horizontal gallery gestures, normal content scrolling, short drags and cancelled/multitouch gestures are preserved. Close timer is a fallback if animationend is interrupted.
- Expanded tree fills the complete CSS viewport with floating header/controls; no summary bar reduces canvas area. Initial focus uses larger photos. Touch browsers with Fullscreen API support request fullscreen on the expand tap; unsupported/rejected requests retain the immersive viewport. Owned native fullscreen is exited on close; asynchronous cancellation is handled.
- Added web manifest, app icons and Apple standalone metadata. No service worker or automatic reload/caching introduced. iPhone Safari's general-element fullscreen limitation is tracked at https://bugs.webkit.org/show_bug.cgi?id=206854 ; Home Screen launch is the supported route to browser-chrome-free use there.

## Validation
- Actual pointer drag in browser at 430×932: 29px drag snaps back, 224px drag dismisses. Header is visible at y=74.56; bottom remains y=932.
- Expanded -> Puppy 01 -> Billie -> Back -> swipe dismiss: tree stays expanded and its camera transform is byte-identical before and after; no tree CSS animation or transition is enabled.
- Desktop at 1440×1000: clicking Zane shows sidebar with no dialog; View full profile opens right drawer with profile-slide-in, no grip or mobile-sheet class.
- 20 app tests + 4 packaging tests and build required before publish. New tests cover gesture thresholds, scroll/interactive exemptions, horizontal gestures, cancel/reset/cleanup and enlarged camera bounds.
- Fullscreen native API is feature-detected; iPhone browser chrome cannot be removed programmatically. Physical-device swipe validation remains a useful final user check. No native fullscreen success is claimed from desktop viewport emulation.

## Published validation
- 20 app tests and 4 packaging tests passed; production build succeeded (existing chunk size advisory only).
- Production deploy `6ae0f8091a5baadb1785decd`: https://xx.uylas.net. Live HTML references `index-D8Kmi2Fz.js` / `index-CNfPlgXQ.css`.
- Live 430×932: canvas occupies (0,0) to (430,932), no inspector mounted, Puppy 01 opens mobile-sheet.
- 320×568 and 932×430: dialog remains within viewport, scroll content has no horizontal overflow.
- Exact iOS 27.0 iPhone 15 Pro Max simulator opens the immutable deployment successfully. Physical-device gestures still need real-device confirmation.
- Screenshots: fullscreen-live.png, sheet-live.png; combined mobile-preview.jpg.
