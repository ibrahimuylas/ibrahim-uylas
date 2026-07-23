# Add a responsive scroll-to-top button

## Goal

Help readers return to the beginning of long pages by providing an accessible
scroll-to-top control that works consistently across public pages and device
sizes.

## Background

The site contains long-form articles and collection pages. Returning to the
header currently requires substantial manual scrolling, particularly on mobile
devices. The active Gatsby site uses React, Theme UI, shared layout components,
dark mode, and Gatsby server-side rendering.

## User Stories

- As a reader who has scrolled down a long page, I want a visible shortcut to
  the top so that I can return to the navigation quickly.
- As a mobile or tablet reader, I want the shortcut to remain easy to tap
  without overlapping device safe areas.
- As a keyboard or assistive-technology user, I want the control to have a clear
  name and predictable native button behavior.
- As a reader who prefers reduced motion, I want the page to return to the top
  without forced smooth animation.

## Functional Requirements

1. Add one reusable scroll-to-top React component to the active site.
2. Render the component on every public page through the shared site layout,
   without changing every page individually.
3. Keep the control hidden while the vertical scroll position is 400 pixels or
   less and show it after the page is scrolled more than 400 pixels.
4. Position the visible control at the bottom-right of the viewport.
5. When activated, scroll the window to the top.
6. Use smooth scrolling by default and immediate scrolling when
   `prefers-reduced-motion: reduce` matches.
7. Use a simple upward-arrow icon and the Turkish accessible label
   `Sayfanın başına dön`.
8. Support the site's existing light and dark color modes.

## Non-Functional Requirements

- The component must be safe during Gatsby server-side rendering and must not
  access browser globals before they are available.
- Scroll observation must clean up after itself and must not introduce
  noticeable scrolling performance degradation.
- The interactive target must be at least 48 by 48 pixels.
- Bottom and right spacing must account for mobile safe-area insets.
- The control must have sufficient contrast and a visible keyboard focus state.
- A hidden control must not be focusable or intercept pointer input.
- The component must work at mobile, tablet, and desktop viewport widths.
- Prefer existing React, Theme UI, icon, and layout conventions; do not add a
  dependency unless repository evidence shows it is necessary.

## Acceptance Criteria

1. On every public page, the button is not interactive at scroll positions from
   0 through 400 pixels and becomes visible after the vertical scroll position
   exceeds 400 pixels.
2. Activating the button with mouse, touch, Enter, or Space returns the page to
   scroll position 0.
3. Activation uses smooth scrolling under normal motion preferences and
   immediate scrolling when the operating system or browser requests reduced
   motion.
4. At representative mobile, tablet, and desktop widths, the button remains
   fixed at the bottom-right, has a target of at least 48 by 48 pixels, respects
   safe-area insets, and does not create horizontal overflow.
5. The native control exposes the accessible name `Sayfanın başına dön`, has a
   visible focus state, and cannot receive focus or clicks while hidden.
6. The button remains legible in the site's light and dark modes.
7. The site production build succeeds without browser-global or Gatsby SSR
   errors.

## Applicable Rules

- Follow the repository guidance in `AGENTS.md`.
- Preserve unrelated and user-owned working-tree changes.
- Keep the implementation site-specific; do not broaden it to every reusable
  starter or upstream theme in the monorepo.
- Validate the behavior in proportion to risk and report any pre-existing
  warnings separately.

## Out of Scope

- Scroll progress indicators.
- Usage analytics.
- CMS configuration for the threshold or appearance.
- Header or footer redesign.
- Changes to unrelated starter sites or reusable upstream themes.
- Deployment, publication, Git commits, pushes, or pull requests.

## Open Questions

None. The 400-pixel threshold, site-wide public-page scope, upward-arrow design,
and existing theme colors are the approved implementation defaults.
