# Add persistent article contents navigation

## Goal

Help readers of long articles reopen the existing “Bu yazıda” section
navigation after the inline contents table has scrolled above the viewport on
mobile, tablet, and desktop devices.

## Background

Article pages already render an inline `ArticleContents` navigation when Gatsby
provides at least two table-of-contents entries. That navigation scrolls away
while the reader moves through the article, forcing them to scroll back toward
the beginning before selecting another section.

The site also has a bottom-right scroll-to-top control. The new article
contents control must complement it without competing for the same position.

## User Stories

- As a mobile or tablet reader, I want to reopen the article contents from a
  later section so that I can move directly to another section.
- As a desktop reader, I want a compact edge navigator that previews and opens
  sections directly without interrupting the article while I read.
- As a reader, I want the floating control to appear only after the original
  contents table is behind me so that the opening is not cluttered.
- As a keyboard or assistive-technology user, I want the sheet and its section
  links to have predictable dialog, focus, and navigation behaviour.

## Functional Requirements

1. Keep the current inline “Bu yazıda” navigation as the primary article
   contents presentation.
2. Render the persistent control only on article pages with at least two
   table-of-contents entries.
3. Show a persistent “Bu yazıda” control only after the inline navigation has
   passed above the viewport. Hide it again when the inline navigation returns
   to or below the viewport.
4. On viewports below 1200 pixels, use the existing fixed bottom-left pill. On
   desktop and wide tablet viewports at least 1200 pixels wide, use a vertically
   centred series of horizontal section marks on the left edge.
5. Activating the pill below 1200 pixels opens the existing modal sheet.
   Hovering or focusing a desktop or wide-tablet section mark shows a non-modal
   preview with the section title and the first meaningful paragraph on one
   line. Leaving the mark, moving focus outside the navigator, or pressing
   Escape hides it.
6. Use a full-width sheet on phones and a centred, constrained-width sheet on
   tablets. Preserve the existing one-column phone and two-column tablet list
   layout, and allow long entries to wrap without crossing columns. Desktop
   previews truncate long titles and details without causing horizontal
   overflow.
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
10. Keep the sub-1200-pixel pill at the bottom-left and the existing
    scroll-to-top control at the bottom-right. Keep the desktop and wide-tablet
    marks vertically centred on the left edge.
11. Desktop and wide-tablet mark lengths use three title-length-based sizes and
    expand to the longest size on hover or focus. Mouse and keyboard selection
    navigate immediately without opening a modal or drawer. On touch devices,
    the first tap opens the selected mark's preview, dragging within the rail
    moves the preview between marks without scrolling the page, and a second
    tap on the selected mark navigates to the section. Tapping outside the rail
    dismisses the preview. A hover-capable iPad pointer or stylus must open and
    update previews on its first movement without requiring an activation tap.

## Non-Functional Requirements

- Keep the implementation site-specific; do not modify reusable packages or
  starter sites.
- Reuse the existing contents data, Theme UI tokens, and installed icon
  library. Do not add a dependency unless repository evidence proves it is
  necessary.
- Keep browser-global access out of Gatsby server rendering.
- Use observation that cleans up after itself and does not introduce
  noticeable scroll performance degradation.
- Give the sub-1200-pixel pill and sheet controls at least 48 by 48 pixel
  targets. Give desktop and wide-tablet marks at least 24 pixels of clickable
  height, visible keyboard focus, sufficient light/dark contrast, and
  appropriate safe-area spacing.
- Prevent background interaction and scrolling while the modal sheet is open.
- Avoid new horizontal overflow at representative mobile, tablet, and desktop
  widths.

## Acceptance Criteria

1. Eligible article pages show no persistent contents control before the
   inline table has passed above the viewport, show the device-appropriate
   control after it has passed, and hide it again when the table returns.
2. Articles with fewer than two contents entries never expose a persistent
   contents control.
3. The sheet and edge navigator present exactly the same ordered sections as
   the inline table. The sheet uses one column on phones and two non-overlapping
   columns below the wide-tablet breakpoint.
4. The controls remain inside safe viewport bounds, use targets of at least 48
   by 48 pixels, support light and dark modes, and do not overlap the
   bottom-right scroll-to-top control.
5. Mouse, touch, Enter, and Space open the sheet; its close button, Escape, and
   backdrop dismiss it; focus remains contained while open and returns to the
   invoking control after ordinary dismissal. Desktop previews open with hover
   or focus, close predictably, and mark selection navigates with mouse, Enter,
   or Space. On a touch-capable wide tablet, touching or dragging within the
   rail opens and updates the preview without moving the page; a second tap on
   the selected mark navigates, while tapping outside dismisses the preview.
   Hover-capable tablet pointers show previews on their first movement even
   when the rail appeared beneath an already-positioned pointer.
6. Selecting a section from either contents navigation changes the URL
   fragment, scrolls to the matching heading, and places keyboard focus on that
   heading without changing the contents order or destination. Sheet selection
   closes the sheet. Repeated section selections do not add browser-history
   entries, so Back leaves the article for the previously visited page.
7. The Gatsby production build succeeds without hydration or browser-global
   errors, and focused mobile, tablet, and desktop browser review finds no new
   horizontal overflow.

## Applicable Rules

- Follow `AGENTS.md` and preserve unrelated or user-owned changes.
- Follow the existing site-specific shadowing pattern under
  `site/src/@elegantstack/`.
- Keep this feature compatible with the existing
  `specs/002-add-scroll-to-top-button.md` implementation.
- Validate accessibility behaviour with native semantic controls and
  observable keyboard/focus evidence.

## Out of Scope

- Highlighting the currently active article section.
- Contents-navigation analytics or CMS configuration.
- Changing heading generation, article prose, or contents ordering.
- Redesigning the inline contents table or scroll-to-top control.
- Deployment, commits, pushes, pull requests, or publication.

## Open Questions

None. Placement, responsive scope, trigger timing, sheet pattern, and MVP
boundaries were approved in the preceding clarification.
