# Add Turkish full-text search to the blog

## Goal

Help readers find published blog articles by searching titles, categories, and
article body content from an accessible responsive control in the site header.

## Background

The active Gatsby site contains 173 local MDX articles but exposes no public
search control. The reusable theme still contains an inactive Algolia-oriented
search shell, while the active site configuration does not enable Algolia or
provide indexing credentials.

The approved approach is Pagefind: generate a static search index from the
finished Gatsby HTML, keep the implementation site-specific, and load the
browser search runtime only when a reader activates search. This avoids a
hosted search account, API keys, quotas, and a new server-side service.

## User Stories

- As a reader, I want to search article titles and full article text so that I
  can find information without knowing its category or URL.
- As a mobile reader, I want a compact search trigger that opens a usable
  results panel without navigating away from the current page.
- As a keyboard or assistive-technology user, I want search to have clear
  labels, predictable focus, and standard dismissal behavior.
- As the site owner, I want search terms and result selections measured through
  the existing GA4 integration so that content gaps can be identified.
- As the site owner, I want the index rebuilt automatically on every production
  build without maintaining credentials or an external search service.

## Functional Requirements

1. Add Pagefind to the active site and run it automatically after the Gatsby
   production build against `site/public`.
2. Index only published, non-private article pages. Within each article, index
   the article title, category, and article body. Do not index navigation,
   tables of contents, tags/share controls, comments, related articles,
   newsletters, or other repeated page chrome.
3. Preserve the current Turkish document language so Pagefind uses its Turkish
   language handling. Expose article category as result metadata.
4. Add a site-specific search control to the shared site header without
   enabling or repurposing the inactive Algolia service flag and without
   modifying reusable packages or starter sites.
5. On desktop, show a visible header search field. On mobile and narrow
   viewports, show a search icon with the Turkish accessible name `Arama`.
6. Activating search opens a full-screen overlay below 768 px and a
   full-viewport-height right drawer at 768 px and wider. The drawer width
   adapts to the viewport; its heading, search input, and status remain fixed
   while only the results region scrolls. Opening search focuses the input,
   prevents background scrolling, and retains the element that opened search
   so focus can be restored on dismissal.
7. Close search with its visible close button, Escape, or the backdrop. Restore
   document scrolling and invoking-control focus after ordinary dismissal and
   clean up safely on route changes or unmount.
8. Start searching only after at least two non-whitespace characters. Debounce
   input by 300 milliseconds and prevent stale asynchronous responses from
   replacing newer results.
9. Load Pagefind's browser module and index metadata only when search is first
   activated. Gatsby server rendering and the initial page load must not depend
   on browser globals or the generated Pagefind bundle.
10. Display the total result count and ranked results with article title,
    category, and a safely highlighted excerpt centered on the reader's search
    term, including ASCII spellings of Turkish characters. Make the whole
    result card activate its article without preventing touch scrolling. Show
    the first 10 results and a `Daha fazla göster` action that reveals results
    in increments of 10.
11. Provide Turkish states for the initial prompt, minimum query length,
    loading, no results, and unavailable index. A Pagefind load or query failure
    must remain contained within the search panel and must not break navigation
    or the current page.
12. Track a completed valid query once per normalized term per open search
    session through the existing analytics helper using the GA4 `search` event
    with `search_term`, `result_count`, and `source_path`.
13. Track a selected result once through `search_result_click` with
    `search_term`, `result_url`, `result_position`, `result_category`, and
    `source_path`. Do not send excerpts, article bodies, visitor identifiers,
    or other page content.
14. Document the new analytics events and the build/index behavior. Search must
    remain functional when GA4 is unavailable.

## Non-Functional Requirements

- Keep the implementation site-specific under `site/`; do not change reusable
  packages or starter applications.
- Do not add Algolia credentials, Pagefind credentials, a search API endpoint,
  or any new environment variable.
- Preserve Gatsby server rendering and avoid hydration mismatches.
- Use the existing React, Theme UI, Gatsby navigation, icons, layout tokens,
  color modes, and analytics helper.
- Use native semantic controls, visible focus styles, live status
  announcements, sufficient contrast, and touch targets of at least 48 by 48
  pixels where the control is icon-only.
- Keep the initial page payload free of the Pagefind runtime and search index;
  load the index in chunks through Pagefind after activation.
- Render Pagefind's escaped highlighted excerpts without allowing arbitrary
  result HTML or metadata to become executable markup. When Pagefind does not
  locate an ASCII-spelled Turkish query in the body, derive a bounded plain-text
  excerpt around the equivalent Turkish spelling and render its highlight as
  React text elements rather than raw HTML.
- Prevent background interaction and scrolling while the search overlay is
  active, and restore pre-existing document state exactly on every cleanup
  path.
- Do not introduce horizontal page overflow at representative mobile, tablet,
  or desktop widths.
- Generated `site/public/pagefind` files remain ignored build artifacts and are
  not committed.

## Acceptance Criteria

1. The active site's production build completes Gatsby generation and then
   creates a working `site/public/pagefind` bundle without credentials; the
   generated index contains published articles and excludes draft/private
   articles and non-article pages.
2. At desktop widths the header exposes a visible search field, while mobile
   and narrow layouts expose a named search icon. Mouse, touch, Enter, and Space
   activation open the same search experience without page navigation.
3. Queries such as `uyku tulumu`, `Likya`, `çadır`, and `cadir` return relevant
   articles from titles or body content. The visible excerpt includes and
   highlights the matched phrase, title matches rank ahead of otherwise
   comparable body-only matches, and category metadata is shown for each
   result. Activating any non-dragged point in a result card opens its article
   while touch-dragging the card continues to scroll the results region.
4. Queries shorter than two trimmed characters do not execute. Valid queries
   show loading, total count, and at most 10 initially loaded result cards;
   repeated `Daha fazla göster` activation reveals the remaining results in
   10-item increments without changing ranking or duplicating results.
5. Initial, loading, empty, no-result, and failure states are understandable in
   Turkish. A missing or failed Pagefind bundle produces a contained unavailable
   state and leaves the current page and site navigation usable.
6. The overlay has a visible close control, closes with Escape and backdrop,
   manages background scroll and interaction, moves focus into search, and
   restores focus and the exact pre-open document state on close, route change,
   resize cleanup, and unmount.
7. The production homepage does not request `/pagefind/` resources before
   search activation. Activating search loads Pagefind without Gatsby SSR,
   hydration, browser-global, or route-transition errors.
8. Each completed normalized term emits at most one `search` event per open
   session with only the approved parameters. Selecting a result emits exactly
   one `search_result_click` with only the approved parameters. Both behaviors
   remain inert when `window.gtag` is unavailable.
9. Focused unit tests, the complete root test suite, Gatsby production build,
   generated HTML/index validation, and responsive light/dark browser review
   pass without new horizontal overflow or feature-attributable console errors.

## Applicable Rules

- Follow `AGENTS.md` and preserve unrelated or user-owned changes.
- Follow the site-specific Gatsby shadowing pattern under
  `site/src/@elegantstack/`.
- Follow the analytics privacy conventions in
  `docs/analytics/measurement-plan.md`.
- Keep the search implementation compatible with the existing scroll-to-top
  and persistent article-contents overlays and their document-state cleanup.
- Do not commit, push, deploy, publish, or alter Git history unless separately
  requested.

## Out of Scope

- Algolia or another hosted search provider.
- A dedicated or shareable `/arama/` results page.
- Category filters, autocomplete, query suggestions, saved searches, or search
  history.
- Indexing contact, category, author, tag, homepage, or other non-article
  pages.
- Rewriting article content, titles, categories, or slugs.
- Search-engine indexing of internal search results.
- Deployment, production GA4 configuration, commits, pushes, pull requests, or
  publication.

## Open Questions

None. Pagefind, full published-article text, the responsive header overlay,
10-result pagination, Turkish states, and search-term analytics are approved
implementation defaults. The existing production analytics configuration and
privacy policy are assumed to permit collection of reader-entered search terms.
