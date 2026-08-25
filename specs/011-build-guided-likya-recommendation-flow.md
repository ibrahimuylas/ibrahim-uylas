# Build the guided Likya route recommendation flow

**Type:** Feature

**Priority:** P1 — visitors who do not know the route need a confident starting point

**Risk:** Medium

## Goal

Guide a visitor from an imprecise intention such as “önümüzdeki ay 5 günüm var” to one clear, editorially authored route plan. The flow must feel faster than researching route names and must explain the limits of the recommendation.

## Recommendation Model

- Use deterministic matching against the verified route-plan records in Spec 017.
- Do not use an LLM, opaque ranking model or live-generation service for MVP.
- Return one primary plan and at most two alternatives.
- Show why the primary plan fits and why an alternative is meaningfully different.
- If no plan satisfies hard constraints, say so and propose which answer to relax; never fabricate a plan.

## Entry Points

- Main hero CTA on `/likya-yolu-rotasi/`.
- “Karar vermeme yardım et” decision card.
- Links from 3/5/7-day cards with duration preselected.
- Updated Likya CTA on `/category/rotalar/` targeting `/likya-yolu-rotasi/#planlayici`.
- Optional “Bu etap bana uygun mu?” link on stage pages that preselects relevant attributes without hiding the full planner.

## Question Flow

Keep the flow to four short steps. Each step shows why the question matters.

### Step 1 — When?

Options:

- exact approximate start date;
- month;
- “henüz bilmiyorum.”

The UI converts the answer to a season band for matching. An exact date is used only for display and share state; it does not imply that the system knows future weather or closures.

Show a concise note: “Bu seçim mevsim uygunluğunu değerlendirir; yola çıkmadan hemen önce hava ve resmî kısıtlamaları ayrıca kontrol et.”

### Step 2 — How many walking days?

Primary choices:

- 3 days;
- 5 days;
- 7 days;
- 10+ days;
- full route.

Allow a custom number only if the authored plan catalog supports it. Travel days should be distinguished from walking days in the result.

### Step 3 — Experience and daily load

Ask two compact questions:

- experience: first multi-day walk / some multi-day experience / experienced;
- preferred load: shorter and comfortable / balanced / long and demanding days.

Include an explanation based on walking time, elevation, terrain and pack type—not distance alone.

### Step 4 — Stay and trip character

Required:

- camp / pension-business / mixed;
- trip priority: sea views / ancient sites / quieter nature / balanced.

Optional, only when it changes a recommendation:

- solo or group;
- public transport or private vehicle.

Do not ask profile questions that do not affect the result.

## Form Behavior

- Each step uses a labelled `fieldset` and real radio/checkbox controls styled with existing card patterns.
- One answer may be preselected only when the visitor entered from a specific 3/5/7 link; otherwise do not bias the result.
- `Geri` preserves prior answers. `Devam et` remains disabled until required answers are complete and explains missing input accessibly.
- Show “Adım 2 / 4” as text and an accessible progress indicator.
- The browser back button must not unexpectedly leave the page after every answer. Update the URL only on result generation or explicit share action.
- “Baştan başla” clears planner state without resetting site theme or unrelated page state.

## Matching Rules

Each route plan declares:

- supported duration;
- recommended and excluded season bands;
- minimum experience;
- daily-load band;
- available lodging modes;
- trip-character tags;
- transport compatibility;
- solo suitability note;
- hard exclusions and editorial cautions.

Matching order:

1. Exclude plans that fail duration, season exclusion, minimum experience or required lodging.
2. Score remaining plans using explicit documented weights for preferred load, trip character and transport.
3. Use editorial priority as the final tie-breaker.
4. Never use popularity as a proxy for safety or suitability.

Store the rules beside the route-plan data and test them with table-driven cases. UI components must not contain business-rule conditionals for individual route IDs.

## Result Screen

### Primary recommendation

Show, in this order:

1. Plan name, duration, start/end and region.
2. `Neden sana uygun?` with three short reasons tied to the user's answers.
3. `Ne zaman uygun değil?` with hard cautions and seasonal exclusions.
4. Day-by-day summary with distance, expected effort, overnight location and exit option.
5. Accommodation mode and transport summary.
6. GPS/map coverage with source and variant label.
7. “Bugün kontrol et” list from Spec 019.
8. `Planı ayrıntılı incele` primary action.

### Alternatives

Show a maximum of two collapsed cards. Each must state the tradeoff, for example more sea views but longer days, or easier logistics but less solitude. Do not repeat nearly identical variants.

### Result actions

- `Cevaplarımı değiştir`.
- `Bağlantıyı kopyala` using a canonical query string with stable IDs.
- `Telefon/çıktı özeti` using print CSS; no PDF service is required.
- `Tüm rotaları keşfet` as a persistent secondary path.

## URL and Privacy

- Encode only non-sensitive categorical selections and the stable plan ID.
- If an exact date was entered, prefer month/season in analytics; the shared URL may contain the date only after an explicit share action.
- All planner-result URLs canonicalize to `/likya-yolu-rotasi/`.
- Invalid or retired plan IDs fall back to the planner with a clear message.

## Empty and Edge States

- Unsupported month/route combination: explain the seasonal conflict and show supported months, not a blank result.
- First-time walker plus demanding full-route request: do not block exploration, but recommend preparation and a shorter trial plan before showing the full-route guide.
- Camp-only plan with uncertain camp legality/services: mark uncertainty and offer a mixed/pension alternative.
- Missing current condition: retain the route recommendation but make the unresolved check prominent.
- JavaScript unavailable: show direct links to the authored 3/5/7/full plans and atlas.

## Responsive Behavior

### Mobile

- One question per visual section; options stack vertically.
- Navigation buttons appear after the options and remain in normal document flow.
- Result metadata wraps into two-column definition rows only when readable; otherwise one column.
- Day cards use a vertical sequence, not a compressed table.
- Alternative cards are collapsed by default with accessible disclosure buttons.

### Tablet

- Option cards may use two columns.
- Result reasons and cautions may sit side by side; day sequence remains full width.

### Desktop

- Question explanation may use a bounded side column.
- Result can use a main day-plan column plus a sticky, in-content summary/source column.
- The form never stretches controls across the full wide guide container.

## Analytics

Track start, step completion, validation failure category, result completion, result plan ID, alternative open and result action. Do not send free-text notes or exact dates to analytics.

## Acceptance Criteria

1. A visitor can complete the planner in four short steps using keyboard, touch or screen reader controls.
2. Every supported answer combination returns either one sourced primary plan with no more than two distinct alternatives or a clear no-match recovery.
3. Matching rules are deterministic, documented and covered by tests independent of the UI.
4. The result explains fit, exclusions, day-by-day plan, logistics, GPS source and current checks without claiming real-time safety.
5. Result state can be shared with stable query parameters and restored without Gatsby hydration warnings.
6. Users can switch to the full atlas at every major state.
7. Mobile results remain readable without horizontal scrolling or dense tables.

## Out of Scope

- Free-form chatbot recommendations.
- Live weather-based automatic rerouting.
- Generating arbitrary itineraries not reviewed in Spec 017.
- Saving plans to a user account.
