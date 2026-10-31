# Obi · Family archive

An English, responsive archive for Obi and her family. Her name is Obi; none of the three merle candidates has been selected. Built from the approved family-tree design in `../design/mockups/02-family-tree-en-v2.png`.

## Run and build

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 4173
npm test
npm run build
npm run test:sites
```

The static website is emitted to `dist/client`. The bundled template also emits a Sites worker and hosting metadata. No hosting account, backend or API key is required for local use.

## Production

Live at **https://obi.uylas.net**, on the separate Netlify project `xx-uylas` (site ID `7cba6e48-7c53-4928-a35c-98b464d0532f`). First published 27 October 2026, deploy `6ae0ddadd2f28c0c4a8fe5a9`. The managed `obi.uylas.net` DNS record points to the existing Netlify project; the wildcard certificate covers HTTPS.

For an explicitly authorised future publication, run `npm run deploy:production` from this folder with an authenticated Netlify CLI. It tests and builds the app, then deploys only `dist/client` from an isolated staging directory using this app's `netlify.toml`. The site ID is pinned so the root blog cannot accidentally be overwritten. Local `.netlify` state is ignored by Git. This is a manual deployment; Git continuous deployment is not connected, and no repository push is required.

## What works

- A data-driven four-generation tree showing all 17 recorded profiles, with initial fit, zoom buttons, Cmd/Ctrl + wheel, touch pinch, drag-to-pan, fit reset and expanded view.
- Independent photo galleries on family nodes, synchronized with the selected profile. Hover/focus arrows, touch controls, full-size viewing, keyboard navigation and original-image links.
- Full health tables, profile notes, links to parents, original source URLs and saved source text.
- Three puppy candidates, four sibling photographs, separately labelled English AI adult concepts, a filterable photo album and archive history.
- Desktop navigation and a compact mobile menu. Hash links preserve the selected section and family member.

## Content and provenance

`src/data/archive.json` holds the profiles, health results, relationships, photographs and saved page text. Breeder-source photos retain their original image URL, source page URL, archive date, local display image and saved original. User-provided photos retain their original bytes, receipt date and explicit upload provenance; no external URL, photographer or capture date is invented. Health entries retain a source page URL and archive date.

`public/media` contains optimized display photographs and the translated AI concepts. `public/archive/photos` keeps original source files. `public/archive/pages` contains safe text snapshots, rather than executable third-party HTML. The source manifest is at `public/archive/photo-manifest.json`; archival inputs and raw page snapshots remain in `../design/archive`.

There are 17 profiles: six parents/grandparents, four great-grandparents, three candidates and four siblings. Forty-four source files were retrieved from family profile pages and explicitly identified images elsewhere, including three pedigree documents. Some source files depict the same photograph; both versions are preserved but Billie’s duplicate is shown once. Seven earlier puppy photographs are retained separately. Shared unlabelled galleries are inventoried without guessing the dogs’ identities; collection is not claimed to be an exhaustive identification of those galleries.

The puppy photographs were saved on 25 October 2026. Source-page snapshots were saved on 27 October 2026, after some puppy photographs had been removed. These are archive dates, not birth or examination dates.

Source exceptions are deliberately preserved: Billie’s NAD result is `+/− (carrier)` and Zane’s hip result is `B/C (FCI)`. Puppy results are not inferred. An eye examination marked “clear” is not an eye colour. Each candidate gallery contains the latest real portrait, previous real photographs, then one current speculative AI adult concept. Concepts have explicit AI labels and never receive breeder-photo attribution. Original source records remain separate from generated assets.

To regenerate content from the existing archive, `scripts/import-archive.py` requires Python, Pillow and BeautifulSoup. It copies originals, creates display derivatives and rebuilds the JSON; it does not crawl the live website. The English AI assets are maintained separately. Refreshing the source archive requires reviewing new photo identities and source evidence first.

## Verification

See `design-qa.md` and `qa/` for rendered desktop/mobile comparisons and interaction checks. `npm test` validates source references, lineage integrity, important health exceptions, candidate gallery order and AI provenance and modifier-wheel zoom behaviour. The template’s four hosting tests check its static routing and packaging.

### Mobile Safari rendering follow-up (27 October 2026)

The reported iPhone "A problem repeatedly occurred" crash could not be reproduced in macOS Safari 27.0.1, including its 390 × 844 responsive view. The affected physical phone/iOS version and crash log remain unavailable; this is a rendering-load mitigation, not a confirmed root-cause fix.

- Tree cards and thumbnail grids use separate, maximum 384 × 384 WebP copies. Original photographs and full gallery images remain unchanged.
- Initial tree image pixel storage falls from approximately 40.7 MiB to 6.9 MiB (RGBA estimate, not total browser/process memory).
- Backdrop blur is disabled inside the scaled tree and on mobile/touch gallery controls and profile backdrops.
- Regenerate the checked-in thumbnails after new media with `python3 scripts/prepare-thumbnails.py` (Pillow required).
- Validation: 14 app tests, 4 packaging tests, production build; macOS Safari responsive opening, zoom/fit and AI-photo carousel. Physical iPhone retest is still required.
- An accidental root-repository test run exposed unrelated existing guide-count/mobile-hover failures; the root site was not changed by this fix.
- Published mitigation: Netlify deploy `6ae0e2656e88d55e5c17a15e`. Verified all 17 thumbnail loads in the production deployment and no tree backdrop filters. Primary-domain HTTPS returned 200 with the new bundle using the IP returned by authoritative DNS; the local default resolver temporarily failed for the new subdomain, while authoritative DNS and Cloudflare DNS resolved it correctly.

### Viewport feedback investigation (27 October 2026)

User reports repeated reloads before failure on iPhone 15 Pro Max / iOS 27.0 in both Safari and Chrome. The app has no automatic reload, refresh meta tag or service worker. Before this change, a temporary local probe in desktop Safari's mobile view recorded 4 explicit fit requests, 1 container resize and 2 camera moves at startup (14 React renders under development StrictMode); these counts settled. The physical-device failure is not reproduced by that probe.

Removed the three overlapping auto-fit entry points (React Flow's initial `fitView`, an initialization/breakpoint effect and a resize effect). One coalescing, size-deduplicating observer now applies an idempotent viewport calculation from the known pedigree dimensions directly via `setViewport`, without enqueueing node updates through `fitView`. The absolutely positioned graph cannot influence its own size-contained parent. Repeated/subpixel resize notifications and camera feedback are covered by regression tests. Manual zoom, pan, Fit and expanded mode remain supported. Temporary diagnostics were removed.

This removes the identified feedback path, but confirming the reported iOS 27.0 failure requires a retest on that device; do not represent the desktop checks as an iPhone reproduction.

Viewport update published as Netlify deploy `6ae0e531092e03aab6d9827d`. Primary-domain browser verification loaded `/assets/index--em3YoZ8.js`, all images loaded, 430 px viewport / 340 px canvas, with a stable fitted transform. Passed 17 application tests, 4 packaging tests and production build. Manual zoom survives browser-height changes; Fit restores the initial transform and expand/collapse works. No commit or push was made.


### Confirmed mobile motion workaround (27 October 2026)

Physical iPhone 15 Pro Max / iOS 27.0 A/B: user confirmed that the unchanged production snapshot repeatedly crashes, while the identical JS/media with only tree CSS animation/transition disabled stays open. The matching iOS simulator did not reproduce the crash. See `qa/ios27/investigation.md` for exact deployments and evidence.

`polish.css` now applies the tested static-tree rule on small screens and devices with no hover or a coarse pointer, including touch landscape. Desktop motion and all tree interactions remain. The individual animation or underlying WebKit fault is not isolated. Keep this regression check: affected physical phone startup must remain stable; all tree descendant/pseudo-element animations/transitions must compute to none/zero on touch, with zoom, selection and carousels working. Validation: 21 existing tests, build, computed-style and interaction checks passed.

Published to https://xx.uylas.net as production deploy `6ae0ecf31d3e603ff2caccac`. Live page loads CSS `index-Cmv8i6n5.css` and JS `index-DPtxXrnN.js`. Production browser at 430px: 17 dogs, no broken images, no tree descendant/pseudo-element CSS motion. Production snapshot opened in matching iOS 27.0 simulator; screenshot saved at `qa/ios27/simulator-production-motion-fix.png`. No Git commit/push; unrelated root changes preserved. Final primary-domain physical-device retest remains with the user.

### Mobile layout refinement (27 October 2026)

All four pages and profile/photo/source overlays use the mobile composition through 1024px, including landscape phones. Expanded tree uses a body portal, explicit Done control, focused initial camera and selected-profile summary; Fit restores the overview. Candidate shortcuts and a heading-first inspector improve navigation below the tree. Touch motion mitigation remains. See `qa/mobile/verification.md` and screenshot evidence. 22 tests and build passed; published deploy `6ae0f0dbe42f3ea3687289b3`.

## Obi address — 27 October 2026
Primary custom domain: https://obi.uylas.net. The former `xx.uylas.net` domain was subsequently removed at the user’s explicit request. The Obi DNS record targets the existing `xx-uylas.netlify.app` project; its stable site ID and deploy history are unchanged. The existing wildcard certificate covers the new address.

Address migration deployed as `6ae10db26ec4c6bb45cb20de`. Verified valid HTTPS/HTTP 200 at obi.uylas.net and HTTP 301 from xx.uylas.net with query strings intact. Browser reload of `https://xx.uylas.net/#family?dog=billie` resolves to `https://obi.uylas.net/#family?dog=billie` and still displays Billie. 21 application tests, 4 packaging tests and production build passed. No Git commit or push.

## Turkish version
`/tr` (also `/tr/`) serves Turkish UI, profile narratives, health reading aids and dates. `/` remains English. Header language links preserve the current page/profile hash. Archived source transcripts and original documents remain verbatim and are clearly labelled as original English source text. The shared archive, source URLs, pedigree IDs and exact medical grades do not change between languages. Static Turkish HTML metadata and a localized manifest are produced by `scripts/localize-build.mjs`.

## Project location

The project directory is `obi/`, with the app in `obi/app/` and design originals in `obi/design/`. Renamed from `kira/` on 29 October 2026. Historical design prompts and archived breeder source text retain their original wording. The Netlify project identity and historical deploy URLs are unchanged.

## Updated concepts and directory rename — 29 October 2026

Replaced both older AI variants for each candidate with its updated 29 October concept; original puppy photos remain. Shared tree/profile galleries now contain two items per candidate. Removed the light/dark selector and superseded public assets. Production deploy: `6ae3467bf578c25ac3069a53`.

Validation from `obi/app`: 25 application tests and 4 packaging tests passed; production build passed (existing chunk-size warning). Live Turkish Puppies carousels loaded all three new WebP images. No filenames containing Kira or beginning `xx-` remain in the project outside dependencies. No commit or push performed.

A root-level blog test run was also triggered during the move; it failed on existing unrelated article-count expectations and Likya hover policies. No blog files were changed by this task.

## New portraits and adult concepts — 31 October 2026

Archived the three user-provided JPEGs without changing their bytes and added WebP display copies. Photo 1 matches candidate 01 (Copper face), Photo 2 candidate 02 (Wide white blaze), and Photo 3 candidate 03 (Small white marking). Each gallery now shows the new portrait, previous real photograph and one redesigned AI adult diptych. New portraits have individual focal positions for cropped cards; full-size originals remain available. The comparison date follows the displayed photo instead of a hard-coded 25 October caption.

New uploads use explicit user-provided provenance, with no invented breeder URL or photographer credit. 31 October is their receipt/archive date; capture dates are unknown. Source originals and their hash manifest are in `../design/archive/puppies-2026-10-31/`; AI PNGs, reference mappings and built-in image generation prompts are in `../design/archive/ai-adult-concepts/2026-10-31/`. The current archive includes these reviewed additions; the initial-import script does not recreate subsequent curation.

Published to https://obi.uylas.net as deploy `6ae64be873d6cbdd90181644`. Validation: 25 app tests, 4 hosting tests and production build passed (existing chunk-size warning). Both English and Turkish routes returned HTTP 200 with the current bundle and all six new photo/AI references. All 15 new live display/original/thumbnail files matched local SHA-256 digests. Browser visual/interaction QA was unavailable because local browser access was disabled in Work settings; no mobile or desktop screenshot verification is claimed. No commit or push; existing unrelated root work was preserved.

### Fresh generation from real photographs only

Following the user's correction, all three adult concepts were generated again using exactly the two existing real photographs of each candidate. Previous AI images were excluded from every tool call. The current assets use the `real-only-v5` filename suffix; their original PNGs, complete prompts and input mappings are in `../design/archive/ai-adult-concepts/2026-10-31-real-only-v5/`. Both real-photo IDs and the `real-photos-only` policy are recorded on each active concept and checked by the archive tests. Earlier AI originals remain archived.

Each generated pair was visually compared with its two real references for facial white/copper patterns, eye appearance, nose, ears, chest, paw white and visible flank markings. Occluded body details remain plausible completion rather than verified patterns. Validation: 25 app tests, 4 hosting tests and production build passed; the existing bundle-size advisory remains.
