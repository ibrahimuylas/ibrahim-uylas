# Evaluate automated Likya condition-source monitoring

**Type:** Spike

**Priority:** P2 — useful after the manual freshness workflow is stable, not required for MVP

**Risk:** High

## Goal

Determine whether selected official weather, forest/fire, closure and transport sources can be monitored reliably enough to notify an editor about changes. The system may detect and queue review; it must never automatically publish safety advice.

## Questions to Answer

1. Which official sources provide stable APIs, feeds or consistently structured pages?
2. What reuse, access and rate-limit terms apply?
3. Can the system identify a relevant content change instead of any page-layout change?
4. How quickly and clearly can a human map a detected change to affected route sections?
5. What happens when a source is unavailable, redesigned or contradictory?
6. Is the maintenance burden lower than the manual workflow in Spec 019?

## Candidate Scope

Evaluate source categories, not assumed vendor implementations:

- official meteorological warnings/forecast links;
- official forest/fire access or prohibition notices;
- governorship/municipality/protected-area closure notices;
- official transport operator disruption notices.

Do not scrape Facebook groups, personal posts, books, Wikiloc activity or accommodation businesses for automated safety status.

## Prototype Behavior

For no more than three representative official sources:

1. Fetch only at a permitted low frequency.
2. Store source URL, fetch time, response status and a content fingerprint/extract.
3. Compare with the previous successful fetch.
4. Create an editor notification or review artifact containing the old/new relevant text, source link and possible affected region.
5. Leave all public condition records unchanged.
6. Require a human to create, update or dismiss a Spec 019 condition record.

The prototype must not need production credentials committed to the repository.

## Failure and Safety Rules

- A failed fetch is `monitor unavailable`, not “no warning.”
- A changed page layout creates a technical review, not a public notice.
- Machine keyword matching may prioritize review but cannot determine route safety or legal applicability.
- Keep a visible audit trail of fetched source, time and editor decision.
- Apply bounded retries and rate limits; no aggressive crawling.
- Disable a broken source without disabling the manual status panel.

## Deliverables

- Source feasibility matrix: authority, access method, stability, terms, data granularity, likely route mapping and maintenance risk.
- Small proof of concept for up to three sources if permitted.
- False-positive/false-negative examples.
- Estimated operating and maintenance cost.
- Go/no-go decision for each source category.
- Recommended notification channel and ownership, without provisioning it unless separately authorized.
- ADR or decision note if automation is adopted.

## Go Criteria

Adopt monitoring for a source only when:

- access is permitted and stable;
- relevant changes can be isolated with acceptable false alerts;
- failures are observable;
- a named human review path exists;
- manual Spec 019 operation continues when monitoring fails;
- the monitor demonstrably reduces review effort.

Otherwise document the source as manual-only.

## Acceptance Criteria

1. The feasibility matrix covers all candidate categories and names the authoritative source and access limitations found.
2. Any proof of concept only creates internal review signals and cannot mutate public guide data.
3. Fetch failure, layout change and conflicting-source scenarios are tested and never render a public “all clear.”
4. Each source receives a documented go/no-go decision with maintenance reasoning.
5. The manual freshness workflow remains the production fallback and MVP launch is not blocked by this spike.

## Out of Scope

- Automatic route closure/opening publication.
- Predicting fires, flash floods or route danger.
- Scraping logged-in community groups.
- User push notifications or emergency alerts.
