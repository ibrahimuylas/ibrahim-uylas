# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Obi family archive
- User selected `../design/mockups/02-family-tree-en-v2.png`; preserve that visual direction.
- The confirmed name is **Obi**. The default UI is English; `/tr` serves Turkish. Translate presentation, not stable record IDs, relationship keys, source URLs or medical grades. Preserve archived source text and documents in their original language and label them explicitly.
- Three merle puppies remain candidates; none is selected as Obi. Do not infer puppy test results or final eye colours.
- Use archived original photos for real dogs; clearly label speculative AI adult concepts. Candidate carousels include the real photograph followed by the single updated 29 October 2026 adult concept. Retire the earlier light/dark variants and their selector; preserve old originals only in the design archive.
- Do not overlay an "Original photo" badge on real photographs; only AI concepts need a badge.
- Every source/photo/health record retains its original URL and archive date. Do not conflate capture dates with birth or examination dates.
- Photo chevrons appear on hover/focus, work on touch, and must not pan the tree. Cmd+wheel zoom is confined to the tree. Initial view fits available width; Fit restores it.
- Keep this app isolated from the root Gatsby site and preserve unrelated repository changes.

- Keep the refined blue/ivory editorial styling consistent across all pages. Use restrained, non-looping reveal and selection animations; honour reduced motion, including programmatic tree navigation. Never animate the React Flow viewport transform with CSS (it must stay directly responsive to dragging and wheel input).

- Profile drawers are wider on desktop and full screen on mobile. Keep an in-drawer profile history with a Back action after following a relative; reset history when closed. Puppies and Photos use compact top spacing; adult-concept selectors share a row when space allows.

- Full profiles must show every archived health entry with source links. AI-assisted health explanations stay separate from reported results, cite interpretation references, preserve NAD carrier and hip-grade exceptions, and never infer puppy genotypes or an overall health score. Do not treat breeder web text as independently verified laboratory certificates.

- Make the three candidate puppies visually distinct from their ancestors as a shared highlighted group. Explain on first entry that one of these three will become Obi and none is chosen yet. Opening or selecting a profile is inspection, not a puppy-choice action.

- Profile redesigns must retain all existing profile information and all health rows. Include small parent portraits with their profile links to make relatives easier to recognise.
- Selected drawer design: `../design/mockups/profile-drawer/03-gallery-and-field-notes.png`. Use the name above the wide gallery, horizontal facts, circular parent portraits with explicit Mother/Father labels, and separate Screening/Genetic results columns (stacked on mobile). Preserve the complete AI reading notes and source records.
- Main page header is flush with the top edge; intro copy uses its available column width; footer sits at the document bottom, at least the viewport bottom. Keep typography restrained and consistently scaled.
- Wherever gallery thumbnails are shown, show the entire set in a wrapping grid on desktop and mobile; never hide remaining images in a horizontally scrolling strip.
- The main-page inspector has no thumbnail grid: retain the photo arrows and corner position/count. Show more recorded health entries there (eyes, spine/patella and CDDY/IVDD where available alongside hips, elbows, MDR1 and NAD). Full-profile drawers retain all thumbnails.
- Distinguish individual profile sources, litter-page sources and family references. A relative mentioned on another dog's page has no archived individual profile source; do not show the other dog's URL as its source in the inspector. Preserve that provenance under an explicitly labelled family-relationship source in the full profile and retain photo credits.
- Generate the family tree from every recorded parent relationship, including great-grandparents and all siblings. Preserve a distinct highlighted candidate group; do not invent missing ancestors.
- Profile, gallery and saved-source navigation share browser history. In-panel Back and browser Back/Forward must restore the previous screen without a page reload; closing the overlay returns to the underlying page.

- Mobile layouts cover every page and overlay, including landscape phones and small tablets up to 1024px. Expanded tree uses the viewport with a visible Done action, selected-profile summary and accessible controls; Fit returns to the full pedigree. Keep tree CSS motion disabled on touch/mobile because the physical iPhone A/B confirmed it triggers a crash.

- Mobile family-tree dog taps open a bottom profile sheet immediately; do not render an inspector below the tree on mobile. Sheets slide up, dismiss with a downward drag from the top or unscrolled content, and preserve the tree camera and profile/back history. Desktop keeps its sidebar and right drawer. Expanded mobile tree is edge-to-edge with floating controls and larger photos; iPhone browser chrome cannot be forcibly hidden, so provide standalone Home Screen metadata and use the Fullscreen API only where supported.

- Parent avatars use individually checked face framing keyed by photo ID; keep heads and ears visible instead of applying a uniform centre zoom. Preserve full gallery originals.

- Mobile navigation is always visible directly under the wordmark: four single-row pill links with a distinct active page. No hamburger or expanding menu. Keep the row horizontally scrollable on narrow screens and include its fixed height in the home canvas budget.

- The header wordmark shows only “Obi”, with no tagline or slash, in both languages and at every screen size. Mobile home removes the duplicate title/subtitle and post-controls helper/footer content, and gives the freed viewport height to the tree. Keep the three candidate shortcuts and Fit/Expand controls. Other pages retain source/footer access.

- Connect Billie and Zane’s litter junction to the top borders of the candidate and sibling groups only, not to individual puppies. Preserve individual pedigree data and all ancestor connections.

- Production address is https://obi.uylas.net. The old xx.uylas.net domain and redirect were explicitly removed at the user’s request; do not recreate them. Retain the existing Netlify site ID and project.

- Language links preserve the active page/profile hash. `/tr` and `/tr/` must load directly, retain Turkish during history navigation, and have Turkish document metadata and dates. Keep the language switch compact on mobile.

- Project files live under `obi/` (application: `obi/app/`, design archive: `obi/design/`). Use Obi for new file names and script prefixes. Preserve verbatim historical prompts and breeder source records.
