# Build the Likya preparation center and first-hand archive

**Type:** Content and feature

**Priority:** P1 — a route recommendation is incomplete without readiness, equipment and field-use guidance

**Risk:** Medium

## Goal

Create a concise preparation system that answers “Nasıl hazırlanmalıyım?” and “Yanıma ne almalıyım?” while preserving the site's valuable 2014 personal articles as a clearly dated first-hand archive.

## Information Layers

Every preparation topic uses the same three-layer pattern:

1. **Hızlı cevap:** the five to eight points needed for a decision.
2. **Uygula:** checklist, thresholds or route-specific choices.
3. **Derine in:** supporting explanation, sources and related first-hand article.

Avoid repeating the same generic hiking advice across stage pages and plans. Link to the preparation center and show only route-specific exceptions in those screens.

## Required Preparation Topics

### 1. Readiness and training

- Distinguish fitness from multi-day readiness.
- Provide a progressive test-walk checklist using time on feet, elevation, consecutive days and intended pack weight.
- Explain warning signs for choosing a shorter plan.
- Do not prescribe medical training or diagnose suitability.

### 2. Equipment and pack weight

- Separate essentials, conditional items and common unnecessary weight.
- Provide camp, pension and mixed-mode lists.
- Explain carried water as variable weight.
- Show İbrahim's 2014 backpack as a dated real example, not the universal packing list.
- Avoid unsourced “ideal pack weight” rules; explain tradeoffs and test the actual pack.

### 3. Footwear, heat/rain and sleep system

- Connect choices to terrain, season band and accommodation mode.
- Emphasize tested equipment and blister prevention without product endorsement.
- Keep high-stakes medical content limited and source-backed.

### 4. GPS and navigation

- How to compare official route source, signs and third-party tracks.
- How to download/use an external track legally through its provider.
- Offline map, phone power, backup and route-variant checks.
- What a GPS track cannot prove about current access or safety.

### 5. Water and food

- Planning method based on distance, heat, elevation and known refill uncertainty.
- How freshness labels work.
- Backup strategy and why old water reports are not guarantees.
- Food/resupply planning by lodging mode without promising businesses are open.

### 6. Camping, pension and mixed stays

- Decision comparison, daily load implications and reservation/check workflow.
- Legal/land-access uncertainty and Leave No Trace behavior.
- No price lists presented as stable facts.

### 7. Transport and route exits

- Start/end planning, car recovery, public-transport research and missed-connection buffer.
- Difference between planned endpoint and emergency exit.
- Link to plan-specific transport summaries.

### 8. Solo walking and companions

- Risk assessment, communication plan, check-in protocol and turnaround rules.
- How experience, remoteness and season change the decision.
- Connect to İbrahim's personal “neden tek gidiyorum?” article without treating one experience as universal permission.

### 9. Emergencies and trail responsibility

- Carry/share route plan, offline contacts and exit information.
- Explain the limits of phone coverage and external help without inventing emergency capabilities.
- Trail ethics, waste, fire, water-source and cultural-site responsibility.
- Point to current official emergency guidance during implementation research.

## Interactive Checklist

Provide a lightweight checklist customized by:

- camp / pension / mixed;
- 3 / 5 / 7 / full duration band;
- season band;
- solo / group.

Requirements:

- Built from editorially maintained checklist rules, not generated prose.
- Works without an account.
- May persist locally on the device only after the visitor uses it.
- Includes `Tümünü temizle`, print and copy-friendly output.
- Never hides universal essentials because of a selection.
- Does not collect health data or exact travel dates.
- JavaScript-free fallback shows the universal essentials and links to the three lodging-mode lists.

## Existing Page Changes

### `/likya-yolu-hazirliklari/`

- Add a 2014 historical-experience label and link to the modern readiness section.
- Keep the original narrative and date.
- Move unsupported current-sounding advice into dated context or annotate it.

### `/likya-parkuru-sirt-cantam/`

- Add a compact 2014 pack summary and explicit link to the modern equipment checklist.
- Preserve original item/account details as historical evidence.
- Do not silently recalculate old weights or recommend old products.

### `/likya-yoluna-neden-tek-gidiyorsun/`

- Add a personal-perspective label and link to current solo-risk planning.
- Preserve voice; do not rewrite it as general safety advice.

### `/likyaya-1-kala/`, 11-day itinerary and daily journals

- Add consistent archive labels and links back to current preparation/plan pages.
- Keep canonical URLs and chronology.
- Provide previous/index/next navigation and matching practical-stage link where applicable.

## Guide-Shell Integration

- The main page shows a preparation index, not every full article body.
- Planner results preselect relevant checklist modes but do not force the user to use the checklist.
- Stage pages deep-link to only the relevant topic, such as navigation or water planning.
- The historical archive remains visually separate from evergreen preparation content.

## Responsive and Accessibility Requirements

- Mobile topic cards stack and show the short answer before disclosures.
- Comparison content uses responsive cards or the existing `comparison-table` wrapper only when a real matrix is clearer.
- Checklist rows have 48 px controls, persistent text labels and clear checked state beyond color.
- Print output preserves checked/unchecked state with text or symbols supported by print fonts.
- No disclosure contains the only link to a critical source/status.

## Acceptance Criteria

1. All nine preparation topics are reachable in one hop from the guide and provide short answer, actionable layer and deeper source material.
2. Camp, pension and mixed visitors receive distinct equipment/lodging guidance without losing universal essentials.
3. The customized checklist works locally, prints cleanly and has a no-JavaScript fallback.
4. Existing preparation and journey pages retain their voice, URL and dates while clearly linking to modern guidance.
5. Historical equipment, water, price, business and solo-walking claims are never presented as current universal advice.
6. Preparation content is responsive, accessible, source-backed where high stakes and visually consistent with the route guide.

## Out of Scope

- Medical clearance or diagnosis.
- Product affiliate catalog or live prices.
- Cloud-synced packing lists.
- A discussion forum or companion-matching service.
