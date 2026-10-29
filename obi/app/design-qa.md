# XX family archive — design QA

final result: passed

Date: 27 October 2026. Browser: the user's confirmed personal Chrome profile, DuniaOps. Implementation: http://localhost:4173/.

## Visual truth and evidence

- Source: `/Users/uylas/Projects/ibrahim-uylas/obi/design/mockups/02-family-tree-en-v2.png` (1536 × 1024 composite board).
- Desktop capture: `qa/desktop-pass.png`, actual CSS viewport and capture 1440 × 1240.
- Mobile capture: `qa/mobile-pass.png`, actual CSS viewport and capture 390 × 1200.
- The board contains two scaled viewports. Desktop crop `(12,12)-(1174,1014)` is 1162 × 1002; the browser capture was normalized to that size. Mobile crop `(1198,12)-(1524,1014)` is 326 × 1002 and was normalized to 390 × 1200. Captures are one image pixel per CSS pixel; no device bezel is included. These are board-scale comparisons, not claims of identical original CSS dimensions.
- Combined comparison inputs, opened and inspected: `qa/compare-desktop-pass.png`, `qa/compare-mobile-pass.png`.
- Focused profile comparison, opened and inspected: `qa/compare-profile-pass.png`. Health values, typography, source URL and controls are legible at this scale.
- State: family tree fitted to the viewport, Billie selected, first photo, Health tab. The source shows hover arrows; final captures show the resting state. Hover/focus visibility and arrow operation were separately tested.
- Approved change: Kira → XX, including page title, masthead and English body copy. Real source photographs intentionally replace the generative approximations in the mockup.

## Comparison history and fixes

1. P1 interaction: stationary React Flow nodes inherited non-interactive pointer behaviour, so node gallery arrows did not receive clicks. Added explicit pointer events to dog nodes. Retested the node arrow: Billie changed to photo 3 in both node and inspector without changing the selected dog.
2. P2 image cropping: portrait dogs and puppies lost part of the head in the initial crops. Adjusted focal position for puppy portraits and Not An Illusion. Final captures show faces intact; the full-size viewer preserves the whole source image.
3. P2 diagram geometry: overlapping parent/litter elbows obscured the family connection. Added a central parent junction and a separate litter branch; final desktop/mobile comparisons show one shared descent into three candidates.
4. P2 viewport: initial tree height put the toolbar beyond a 1024px viewport. Recalculated available height and kept toolbar outside the transformed canvas. The expanded-view test recorded toolbar bottom at 990px in a 1024px viewport. Fit controls remain within the responsive tree region.
5. P2 typography: initial normalized desktop comparison showed profile and navigation text smaller than the selected board. Increased desktop headline, profile, health and source sizes. Final combined/focused comparisons preserve the same hierarchy with readable text.
6. P2 mobile spacing/source access: initial mobile tree rows were overly compact and the duplicate thumbnail strip plus primary button pushed provenance too low. Restored consistent generation spacing, removed the inspector thumbnail strip on mobile, and placed source information before the full-profile button. Recaptured and inspected `mobile-pass.png` and the combined mobile comparison.

Earlier evidence is retained in `desktop-initial.png`, `desktop-v3.png`, `mobile-final.png`, `mobile-v2.png`, and the first `compare-*.png` files. An intermediate font-subset import caused a Vite overlay; the import was corrected to the installed font package. A fresh final browser tab has no application errors or warnings. A Chrome extension emits its own location-patching warning; this is external to the app.

## Required fidelity surfaces

- **Fonts / typography:** locally packaged variable Inter, navy headings, subdued supporting text, restrained weight/spacing, legible tables. The generated board's letterforms are approximated by the real font. Current hierarchy passes; minor exact letterform differences are P3.
- **Spacing / layout:** desktop tree and divided inspector, three clearly aligned generations, source provenance below the profile, and mobile overview followed by details. No horizontal page overflow at 320, 390 or 1440 CSS pixels. Mobile initial fit includes all nine visible dog nodes.
- **Colours / tokens:** cool near-white surface, navy text, muted blue labels/lines, blue selection and controls, amber carrier status. No invented decorative art or dashboard panels.
- **Images / assets:** real local photographs for every dog, no placeholders. Full-size originals remain linked. Parent photo identities are verified; AI concepts are labelled and translated into English. Different crops from the generated board are intentional to preserve real source imagery. Phosphor library icons and React Flow connectors are used.
- **Copy / content:** all authored UI is English and uses XX. Actual breeder results, source URLs and archive dates remain visible. Missing tests stay missing; source text and photo attribution are retained. The full profile is available from mobile even though the mock omits that button.

## Interaction and data checks

Browser verified:
- Small-node gallery next arrow and synchronized inspector, plus profile selection (Zane showed B/C hips and his own source URL).
- Zoom buttons and fit reset; expanded tree and exit.
- Full profile with all health rows and source links; saved-source dialog with archived breeder text.
- Large photo viewer, ArrowRight navigation and Escape dismissal.
- Adult-concept view and switching to Puppy 02; original and AI images both load.
- Photos filter: Ryder exposes 21 gallery entries, no broken loaded images.
- Sources index: 10 source-page records and three pedigree links.
- Mobile menu and Puppies view: three candidates, four siblings.
- 320px and 390px layouts without horizontal overflow; all nine nodes within the mobile canvas after initial fit.
- Fresh final tab: zero broken loaded images and no application-origin console errors/warnings.

Automated checks:
- Six app tests pass: source/file integrity, acyclic relationships, health exceptions, no inferred puppy results, original/light/dark gallery order and honest AI provenance, pointer-anchored zoom limits, Cmd/Ctrl event handling, ordinary-scroll preservation and listener cleanup.
- Production Vite build passes.
- Four template hosting tests pass.

Physical multi-touch pinch and a real modifier-wheel gesture were not injected by the browser automation API. Wheel event handling and point anchoring are covered by unit tests; pinch is supplied by React Flow. This is a test-coverage limit, not a known failure.

## Follow-up polish

- P3: original-image crops and exact font shapes differ slightly from the generated board; preserving the real dogs and readable text takes precedence.
- P3: shared unlabelled site galleries may contain further family photos. They remain unassigned rather than being guessed.

No actionable P0/P1/P2 findings remain. Publication and domain configuration have not been performed.


## User-requested refinements — 27 October

The earlier unit-only wheel check was insufficient: the rendered tree never attached its wheel listener because the node-readiness hook remained false. Initialization now follows React Flow viewport readiness. `qa/zoom-regression.html` mounts the real App and dispatches bubbling, cancelable browser wheel events from its visible test button. Before the fix: unchanged transform, defaultPrevented false. After the fix: Cmd in 0.917895→1.23903, Cmd out back to 0.917895, Ctrl over a photograph to 1.23903, ordinary wheel unchanged and not prevented. All four checks pass. This verifies the component lifecycle as well as the handler, while retaining the physical-input limitation above.

- Replaced automatic curved/elbow routing with shared orthogonal junctions. The desktop screenshot shows a continuous litter bus and straight central descent, without the tiny steps in the user's report. Comparison: `qa/compare-connectors-fix.png`.
- Candidate node carousels and profile viewers now contain original → light AI → dark AI. Clicked next on all three candidates and verified both variants; enlarged Puppy 01 light concept shows AI attribution and a local concept link, with no breeder-photo attribution. Both diptych panels remain visible via contain sizing. Evidence: `qa/fixes-light-gallery.png`.
- Full profiles slide in from the right and slide out on dismissal; Escape restores the trigger. Desktop bounds: x832, width640, height1634 in a1472×1634 viewport. Mobile bounds: x0,y0,width390,height844 in a390×844 viewport. Evidence: `qa/fixes-drawer-desktop.png`, `qa/fixes-drawer-mobile.png`. Native dialog semantics retain keyboard focus management; the presentation is a drawer, not a centered card.
- No app-origin console errors; only the existing unrelated browser-extension warning.
- Six app tests and production build pass. No publication performed.


## Premium finish and motion — 27 October

User requested refinement of the approved design across all pages, plus animated tree drawing, navigation and selection. Added `src/polish.css` with shared slate-blue/ivory colours, lighter editorial headings, consistent radii, fine borders, restrained shadows, segmented controls and album/card treatments. Existing content and page structure are preserved.

Tree reveals run once per mount: grandparents, parent connections, parents and litter. The initial animation class is removed after 1.35 seconds so re-rendered paths cannot replay during selection. Selected nodes and their immediate connectors receive a transitioning accent. Page, photo, profile and tab content transitions are short and non-looping. Fit and zoom buttons interpolate their viewport movements; direct dragging and wheel handling remain immediate. CSS reduced-motion overrides remove animation and transitions; the programmatic fit/zoom durations also become zero.

Visually inspected all four desktop pages, mobile tree/puppies/source layouts and the mobile drawer in the in-app browser. Mobile width390 has no page overflow or broken loaded images; drawer bounds0,0,390,844. Verified Puppy02 selection updates the inspector and its active connector. Browser console is clear. Browser wheel regression passes Cmd in/out, Ctrl over a photo and normal-scroll preservation after the styling changes. Six unit tests and final production build pass.

Evidence: `qa/polish-puppies.png`, `qa/polish-tree.png`, `qa/polish-mobile.png`. Reduced-motion is verified by source inspection; no OS preference was changed. Preview remains local; no publication or Git commit.


## Drawer history and compact collections — 27 October

Added in-drawer profile history with a labelled Back action. The dialog stays mounted while changing dogs; content transitions and scroll/focus reset to its header. Closing discards history. Verified Puppy02→Billie→Jay→Billie→Puppy02, no Back at the first entry, and a fresh open after closing starts without history. Desktop drawer max width increases640→760px; mobile remains390px full width, with no internal horizontal overflow and working Back.

Puppies/Photos now use28px desktop top padding, tighter heading/control spacing, and a smaller maximum title size. Adult-concept candidate and coat selectors share a wrapping row. At1280px desktop, concept images begin around427px and the album grid around313px. Mobile Photos has no horizontal overflow. Build passes. Evidence: `qa/drawer-back.png`, `qa/compact-concepts.png`. No publication or Git commit.


## Health completeness and AI-assisted reading aid — 27 October

Compared the live Billie and Zane breeder pages with the archive:11 results each, no missing entries. Verification metadata and exact checked test-name lists live in `src/data/health-review.json`. Full profiles already rendered all results; added visible result counts and source-check date, plus a compact-panel4-of11 note. All11 source links and rows verified in Zane's rendered drawer, including CDDY/IVDD, LTV and PRCD-PRA; Billie also renders11 rows.

Added a local AI-authored reading aid below the transcription note for profiles with results. It draws on the stored fields and cites FCI hip grading and GenSol NAD interpretation. NAD carrier status stays distinct from disease; B/C is never described as clear. Genetic notation remains as reported, no certificates are claimed verified, and no puppy test results or overall health score are inferred. Empty profiles get no AI health summary. These are deterministic local explanations, with no external AI request or new service dependency.

Eight tests pass, including source-check completeness and safeguards for carrier/hip/empty records. Production build passes with the existing bundle-size warning. Browser checks pass for both parents; mobile390px drawer has no internal horizontal overflow. No application console errors. Evidence: `qa/health-summary-billie.png`.

Interpretation references checked27 October2026:
- https://www.fci.be/medias/SCI-DYS-HAN-CLA-en-15522.pdf
- https://www.gensoldx.com/tests/neuroaxonal-dystrophy-shepherd-type-nad-shep/


## Candidate group clarity — 27 October

Grouped Puppy01/02/03 in one pale-blue framed area inside the transformed tree, labelled “Our three candidates” and “Not chosen yet”. The background moves/zooms with the nodes and is non-interactive so it cannot block gallery controls. Shifted the litter bus and puppy positions together to preserve shared orthogonal connectors. Updated the opening copy to explicitly state one highlighted puppy will be XX, with parents/grandparents above. Root URL now initially inspects Puppy01; existing dog deep-links are respected. Candidate profiles explicitly say that no puppy is chosen.

Browser verified that the group is within initial-fit canvas bounds at320px and390px, with no horizontal page overflow. Puppy02 next-photo control inside the group still changes to its light AI concept. Desktop opening view, connectors, candidate note and clear selection-pending status visually inspected. No console errors. Eight tests and production build pass (existing bundle-size advisory remains). Evidence: `qa/candidate-group-desktop.png`. No publication or Git commit.
# Gallery and field notes drawer + page rhythm — 27 October 2026

Source visual truth: `../design/mockups/profile-drawer/03-gallery-and-field-notes.png` (third displayed mockup, 1024 × 1792 source request; saved image 948 × 1659). User additionally requested explicit Mother/Father parent labels and home-page typography/layout refinements.

Implementation evidence: `qa/profile-gallery-desktop.png`, `qa/profile-gallery-mobile.png`, `qa/home-layout-refined.png`. Desktop browser viewport 1440 × 1792; drawer crop 920 CSS px wide including its scrollbar (905 content px). Mobile viewport 390 × 844, full-width drawer including scrollbar. Browser screenshots are CSS-pixel density. Comparison used the drawer content region, excluding the underlying app; the reference is slightly wider. No claim of pixel-identical rendering.

**Findings and fixes**
- Initial wide gallery cropped the real dog's head/paws. Fixed with contained original photographs in the same panoramic frame, then recaptured. Neutral side fill is an intentional adaptation: the mock's generated panoramic photograph cannot replace the archived original. Thumbnails likewise retain the full real photographs.
- Intro previously stopped at 660px; now uses all 893px available in the checked desktop layout. Header top is 0. Footer ends at viewport bottom (1792px) when content is short, and at document bottom when content is longer. No horizontal overflow.
- All profile facts and notes remain, with circular clickable parent portraits and explicit relative roles. Records are grouped without dropping or duplicating entries. Zane has four screening and seven genetic rows. Existing detailed AI explanations, references, photograph credits and source records remain below the main record; the drawer is intentionally longer than the mock's abbreviated reading aid.

**Fidelity surfaces**
- Typography: existing locally bundled Inter Variable retained; restrained 600-weight headings, consistent navy/slate text, compact labels and readable body rhythm. Parent names wrap rather than truncate.
- Spacing/layout: identity above wide gallery, three-thumbnail strip, horizontal desktop facts, parents row, two health ledgers. On mobile facts and ledgers stack; parent links remain side by side. Full-width mobile drawer does not overflow.
- Tokens: existing ivory surface, slate secondary copy, pale-blue group headings and thin separators retained. Carrier styling remains distinct from ordinary results.
- Assets: archived Zane and correct parent photographs, Phosphor icons; no generated replacement dog photography. Parent photo crops are intentional circular avatars.
- Content: 11 exact results/source links visible in the DOM; full explanations preserved. Mother/Father labels verified from archived source text, including Jay and Ryder's parents.

Focused review: desktop facts/parent row/health ledgers and mobile hero/parent labels were inspected at readable scale, alongside the full selected reference. P0/P1/P2 issues resolved; intentional original-photo and complete-summary deviations documented above.

**Verification**
- Browser: parent Halsey opens, Back returns to Zane, gallery Next changes 1/6 to 2/6, mobile groups stack, header/intro/footer measurements pass. No captured console errors. Temporary viewport overrides reset; preview kept open.
- Nine tests pass, including exact result preservation and parent-role mapping. Production build passes; existing >500kB bundle warning remains.
- No publish, commit or push performed. Changes isolated to `obi/`.

final result: passed

# Complete pedigree and shared navigation history — 27 October 2026

Replaced the fixed nine-dog tree with a data-driven pedigree containing all 17 archived profiles over four generations. Jay and Ryder's four parents appear in their recorded branches; all seven littermates appear, with the three candidates highlighted separately. Shared orthogonal family buses preserve every recorded parent-child relationship. Initial fit adapts to graph dimensions, and zoom minimum now permits the full pedigree at mobile width.

Verification: all 17 dog cards fit within the tree canvas at 390 × 844 (343px-wide canvas); desktop visually inspected at 1440 × 1100. Evidence: `qa/complete-family-tree.png`. Large pedigree labels are naturally smaller at overview zoom; existing zoom and expand controls provide close inspection.

Navigation uses pushState/popstate without document navigation. Browser checks passed for Billie → Jay → Basileas American Journey → drawer Back to Jay → browser Back to Billie → Forward to Jay. Gallery Back and saved-source Back return to Jay; the selected second photo remains selected. Closing returns to the underlying family view and removes the dialog. No browser console errors. Temporary viewport override reset and local preview retained.

Twelve tests pass, including all-dog/all-relationship inclusion, correct generation ordering, non-overlapping cards, automatic inclusion of a newly recorded ancestor, orthogonal routing and overlay history trails. Production build passes (existing bundle-size advisory unchanged).

final result: passed
