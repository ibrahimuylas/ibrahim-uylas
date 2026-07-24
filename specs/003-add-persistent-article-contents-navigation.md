# Add persistent mobile article contents navigation

## Goal

Help readers of long articles reopen the existing “Bu yazıda” section
navigation after the inline contents table has scrolled above the viewport.

## Background

Article pages already render an inline `ArticleContents` navigation when Gatsby
provides at least two table-of-contents entries. On mobile and tablet, that
navigation scrolls away while the reader moves through the article, forcing
them to scroll back toward the beginning before selecting another section.

The site also has a bottom-right scroll-to-top control. The new article
contents control must complement it without competing for the same position.

## User Stories

- As a mobile or tablet reader, I want to reopen the article contents from a
  later section so that I can move directly to another section.
- As a reader, I want the floating control to appear only after the original
  contents table is behind me so that the opening is not cluttered.
- As a keyboard or assistive-technology user, I want the sheet and its section
  links to have predictable dialog, focus, and navigation behaviour.

## Functional Requirements

1. Keep the current inline “Bu yazıda” navigation as the primary article
   contents presentation.
2. Render the persistent control only on article pages with at least two
   table-of-contents entries.
3. On mobile and tablet viewports, show a fixed “Bu yazıda” pill at the
   bottom-left only after the inline navigation has passed above the viewport.
   Hide it again when the inline navigation returns to or below the viewport.
4. Do not render the floating control on desktop viewports.
5. Activating the pill opens a modal bottom sheet containing the same ordered
   entries and URLs as the inline navigation.
6. Use a full-width sheet on phones and a centred, constrained-width sheet on
   tablets. Preserve the existing one-column phone and two-column tablet list
   layout.
7. Provide a visible close button and support closing with Escape and the
   backdrop. Dim and blur the page behind the sheet, with a usable translucent
   fallback when backdrop blur is unavailable.
8. Contain keyboard focus while the sheet is open. On ordinary dismissal,
   return focus to the invoking pill.
9. Selecting a contents entry from either the inline navigation or the sheet
   updates the URL fragment, scrolls to the target heading, and moves keyboard
   focus to that heading. Sheet selection also closes the sheet. Replace the
   article's current history entry so the browser Back action returns to the
   previous page instead of stepping through visited sections.
10. Keep the new pill at the bottom-left and the existing scroll-to-top control
    at the bottom-right.

## Non-Functional Requirements

- Keep the implementation site-specific; do not modify reusable packages or
  starter sites.
- Reuse the existing contents data, Theme UI tokens, and installed icon
  library. Do not add a dependency unless repository evidence proves it is
  necessary.
- Keep browser-global access out of Gatsby server rendering.
- Use observation that cleans up after itself and does not introduce
  noticeable scroll performance degradation.
- Give the pill and sheet controls at least 48 by 48 pixel touch targets,
  visible keyboard focus, sufficient light/dark contrast, and mobile safe-area
  spacing.
- Prevent background interaction and scrolling while the modal sheet is open.
- Avoid new horizontal overflow at representative mobile and tablet widths.

## Acceptance Criteria

1. Eligible article pages show no floating contents control before the inline
   table has passed above the viewport, show one bottom-left “Bu yazıda”
   control after it has passed, and hide it again when the table returns.
2. Articles with fewer than two contents entries and desktop viewports never
   expose the floating control.
3. The sheet presents exactly the same ordered section links as the inline
   table, using one column on phones and two columns on tablets.
4. The pill and sheet remain inside safe viewport bounds, use targets of at
   least 48 by 48 pixels, support light and dark modes, and do not overlap the
   bottom-right scroll-to-top control.
5. Mouse, touch, Enter, and Space open the sheet; its close button, Escape, and
   backdrop dismiss it; focus remains contained while open and returns to the
   pill after ordinary dismissal.
6. Selecting a section from either contents navigation changes the URL
   fragment, scrolls to the matching heading, and places keyboard focus on that
   heading without changing the contents order or destination. Sheet selection
   closes the sheet. Repeated section selections do not add browser-history
   entries, so Back leaves the article for the previously visited page.
7. The Gatsby production build succeeds without hydration or browser-global
   errors, and focused mobile/tablet browser review finds no new horizontal
   overflow.

## Applicable Rules

- Follow `AGENTS.md` and preserve unrelated or user-owned changes.
- Follow the existing site-specific shadowing pattern under
  `site/src/@elegantstack/`.
- Keep this feature compatible with the existing
  `specs/002-add-scroll-to-top-button.md` implementation.
- Validate accessibility behaviour with native semantic controls and
  observable keyboard/focus evidence.

## Out of Scope

- Desktop floating or sticky contents navigation.
- Highlighting the currently active article section.
- Contents-navigation analytics or CMS configuration.
- Changing heading generation, article prose, or contents ordering.
- Redesigning the inline contents table or scroll-to-top control.
- Deployment, commits, pushes, pull requests, or publication.

## Open Questions

None. Placement, responsive scope, trigger timing, sheet pattern, and MVP
boundaries were approved in the preceding clarification.
