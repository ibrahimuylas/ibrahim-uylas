# Mobile layout refinement — 27 October 2026

## Changes
- Responsive composition through 1024px, covering portrait phones, landscape phones and small tablets; desktop two-column tree remains above this breakpoint.
- Expanded tree is portalled to the body so animated/overflowing page containers cannot clip its fixed viewport. Added Done, selected dog summary and View profile. Mobile opening focuses the selected card at readable scale; Fit restores all 17 records. Background is inert, body scroll is locked, Escape/Tab and focus restoration are handled; nested native profile dialogs retain their own interaction.
- Visible candidate shortcuts, compact bordered overview, named Expand control, heading-first inspector with bounded gallery and profile action before source details.
- Consistent touch targets and spacing throughout Puppies, concepts, Photos, Sources, profile drawer, photo viewer and saved-source viewer. Wider mobile layouts use additional gallery columns. Thumbnail sets still wrap fully.
- The confirmed iPhone CSS-motion workaround remains active for the whole tree, including the expanded portal. No content or source records removed.

## Verification
- All four pages at 320×740, 430×932 and 844×390: main/document scroll widths match available client width, no horizontal overflow.
- 390px profile drawer: Billie, complete thumbnail set, parent navigation, Back, close, and return to expanded tree work. Saved-source dialog at 320px has no horizontal overflow.
- Fullscreen at 430×932 and 844×390: viewport-sized frame, readable selected card, Done, Fit and selected-profile action. Closing restores original body scroll/inert state; Fit returns to full pedigree. Expanded tree CSS-motion audit: zero animation/transition entries.
- Puppy concepts: Puppy 03 + Darker coat resolves the correct archived AI image. Album filter + photo viewer tested with long name Not An Illusion.
- Desktop 1440px: two columns (878px + 435px), candidate shortcuts hidden, photo-arrive animation retained.
- iOS 27.0 / iPhone 15 Pro Max simulator: local main page renders and remains open. Screenshot ios27-simulator.png. This is not a physical-device interaction test.
- 18 application tests + 4 packaging tests and production build passed. Added regression for readable expanded viewport and bounds in portrait/landscape.
- Development hot reload emitted a dependency-array-size warning while editing the effect; final code has a fixed dependency array. Production checked separately after publish.
- An accidental root test invocation encountered known unrelated guide-count failures; no root changes were made.

## Evidence
family.png, expanded.png, landscape-tree.png, puppies.png, concepts.png, photos.png, sources.png, ios27-simulator.png; mobile-review.jpg is a contact sheet of five inspected screenshots.

## Production
Published https://xx.uylas.net, deploy `6ae0f0dbe42f3ea3687289b3`. Verified primary domain loads CSS `index-BdkZaT1V.css`. Fresh production browser at 430×932: expanded portal height 932, selected summary Puppy 01, all tree images loaded, zero animated/transitioning tree elements, zero console errors. Done returns to normal layout. Screenshot: production-expanded.png. No commit/push; task files remain under untracked obi/ on codex/likya-guide, unrelated root work untouched.
