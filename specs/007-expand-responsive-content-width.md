# Expand the public site layout for wide screens without regressing mobile and iPad

**Type:** Improvement
**Priority:** P2
**Risk:** Medium

## Problem / Opportunity

The public homepage and article pages currently inherit the shared Theme UI
`container` size of 1140 px. On 16-inch laptops and larger desktop displays,
this leaves substantial unused space on both sides of the page and makes the
homepage card layout and article hero feel smaller than the available canvas.

GA4 data for 11 August 2024 through 10 August 2026 supports using more of that
space:

- 65.05% of active users are on mobile and 34.98% are on desktop.
- 32.12% of recorded screen-width rows are at least 1280 px wide.
- 23.74% are at least 1440 px wide.
- Common desktop resolutions include 1920x1080, 1536x864 and 1366x768.

The opportunity is therefore not to make every element universally wider. It
is to introduce a site-specific responsive shell that can grow on large
screens while preserving readable article line lengths and the current
phone/tablet experience. Physical screen size must not be used as a breakpoint;
all decisions use CSS viewport width and input capabilities.

## Proposed Solution

Introduce a site-specific public-page container policy with a maximum outer
content width of 1520 px. The shell grows fluidly with the viewport, retains
responsive side gutters, and stops growing once it reaches that maximum.

Use the wider shell selectively:

- Align the public header, homepage sections, article shell and footer to the
  same responsive horizontal grid.
- Let homepage categories, featured content, post grids, article hero media
  and related-content areas use the wider shell.
- Keep long-form article text and reading controls in a centred readable
  column, targeted at 720-820 px and never wider than 820 px.
- Keep article hero media at its natural aspect ratio. It may use the wider
  article shell, but it must not be stretched, distorted or given a forced
  crop that changes the source composition.
- Keep the implementation under `site/`. Do not change the shared
  `packages/flow-ui/flow-ui-theme` container size for every starter and theme.

The responsive policy is:

| Viewport | Required layout behaviour |
| --- | --- |
| Below 768 px | Preserve the phone layout, use one-column content and at least 16 px side gutters. Only explicitly scrollable components may scroll horizontally. |
| 768-1023 px | Preserve an iPad/tablet-first single-column reading layout with at least 24 px side gutters. Do not enable a desktop sidebar merely because more width is available. |
| 1024-1279 px | Allow a two-column homepage composition only where the main and aside columns retain usable minimum widths; otherwise keep them stacked. Article prose remains one centred column. |
| 1280-1439 px | Grow the outer shell fluidly and use the additional width for media, card grids and spacing without widening prose beyond 820 px. |
| 1440 px and above | Continue growing the shell up to 1520 px, then centre it and leave the remaining space as outer margin. |

Responsive gutters should be expressed with shared site-level values or a
fluid CSS expression rather than duplicated one-off margins. The implementation
may adjust the exact gutter interpolation, but it must satisfy the viewport
matrix and acceptance criteria below.

## Scope

### Homepage

- Apply the wider shell to the homepage title, category navigation, featured
  story area, recent-post cards, category post groups and newsletter section.
- At wide desktop sizes, use the available space to improve card and media
  proportions without making headings or excerpts excessively long.
- Show all five category cards without horizontal scrolling when the viewport
  and translated labels provide enough room.
- Retain intentional horizontal category scrolling on narrow screens. Hide its
  visual scrollbar without hiding or clipping the final category and without
  creating page-level overflow.
- Keep the main/author-aside composition stacked on phones and portrait
  tablets. At wider tablet and desktop sizes, enforce minimum usable column
  widths before switching to a row.

### Article pages

- Apply the wider shell to the article card, hero image and related-content
  sections.
- Centre the article heading, metadata, inline table of contents, prose, tags,
  reactions and comments in a reading column no wider than 820 px.
- Allow intentional full-width article elements such as hero media or a
  responsive comparison table to opt out of the prose width only when their
  own component already supports responsive overflow.
- Keep headings, lists, code blocks, tables, embeds and images within their
  owning container. Long URLs, code and captions must not force page-level
  horizontal scrolling.
- Preserve the existing article-contents sheet, desktop contents rail,
  scroll-to-top button and mobile action dock positions and safe-area handling.

### Shared public chrome

- Align header and footer content with the same site-specific shell used by the
  page body.
- Preserve the current responsive header modes: compact controls on phones and
  the full search/menu presentation only where it fits without wrapping or
  collision.
- Keep touch targets, focus indicators, colour modes and keyboard behaviour
  unchanged or improved.

### Responsive validation

Validate both portrait and landscape orientations where applicable:

- Phones: 320, 360, 375, 390 and 430 px widths.
- iPad/tablet portrait: 768x1024, 810x1080, 820x1180 and 834x1194.
- iPad/tablet landscape: 1024x768, 1080x810, 1180x820 and 1194x834.
- Desktop/laptop: 1280, 1366, 1440, 1512, 1536, 1728 and 1920 px widths.

The matrix must cover the homepage and at least one representative long
article containing a hero image, table of contents, headings, lists, an embed,
a responsive table, reactions/comments and related posts.

## Acceptance Criteria

1. At viewport widths of 1440 px and above, the homepage and article outer
   shell use materially more horizontal space than the current 1140 px
   container. The shell grows fluidly, never exceeds 1520 px, remains centred,
   and aligns the header, body and footer to one horizontal grid.
2. Article prose, metadata, inline contents, tags, reactions and comments
   remain in a centred reading column no wider than 820 px at every desktop
   width. Increasing the viewport does not produce excessively long text lines.
3. Hero images and other expanded media preserve their source aspect ratio,
   remain sharp at their rendered size, and introduce no stretching,
   unintended cropping or cumulative layout shift attributable to the new
   shell.
4. At every phone width in the validation matrix, the layout remains a usable
   single column with at least 16 px gutters. Header controls do not wrap or
   overlap, text and controls are not clipped, and fixed controls remain inside
   the safe viewport.
5. At every iPad/tablet portrait width, article reading remains single-column
   with at least 24 px gutters. Homepage sections stack in a logical order,
   cards retain usable dimensions, and no desktop sidebar or rail compresses
   the main content.
6. At every iPad/tablet landscape width, any multi-column homepage layout meets
   explicit minimum widths for both main and aside content; otherwise it stays
   stacked. Rotating between portrait and landscape without reloading does not
   leave stale widths, clipped overlays, misplaced fixed controls or broken
   scrolling.
7. No tested viewport has page-level horizontal overflow in light or dark
   mode, at normal size or 200% browser zoom. Horizontal scrolling is limited
   to components intentionally designed for it, such as the narrow-screen
   category strip, code blocks and responsive tables.
8. The homepage category strip shows every category and remains touch
   scrollable on phones and tablets. Hover transforms run only on hover-capable
   fine pointers and never reveal a scrollbar, clip a card or change the page
   width.
9. Search, navigation, article contents, comments, action docks and
   scroll-to-top interactions retain their existing mouse, touch, keyboard and
   focus behaviour across the complete viewport matrix. Pointer hover is not
   required to discover or operate an action on iPad or phone.
10. Responsive images declare suitable rendered sizes so widening the shell
    does not make small-screen visitors download the largest desktop asset by
    default. The production build introduces no new hydration warnings,
    feature-attributable console errors or material layout shift.
11. Focused layout tests, the complete root test suite and the Gatsby
    production build pass. A browser review of the full viewport matrix records
    no regression in content order, legibility, touch target size, focus
    visibility, overlay positioning or vertical scrolling.

## Out of Scope

- Redesigning the visual identity, typography, navigation model or article
  content.
- Changing reusable theme packages, starter sites, CMS/admin pages or comment
  moderation pages.
- Choosing breakpoints from physical device inches or user-agent detection.
- Adding new homepage sections, new sidebar content or a new card design.
- Re-cropping source article/banner images or replacing media assets.
- Changing analytics tracking, SEO metadata, routes or article markup solely
  for this layout improvement.
- Deployment, commit, push, pull request or publication.

## Open Questions

None required for implementation planning. The 1520 px outer maximum and 820
px prose maximum are approved defaults derived from the current layout and the
reviewed GA4 distribution. Small gutter adjustments are allowed during visual
QA if all acceptance criteria remain satisfied.

## Suggested Next Step

Inspect the rendered homepage and representative article at each breakpoint,
then create a small implementation plan covering the site-specific theme
override, homepage composition, article inner reading column, responsive image
sizes and automated/browser validation. Implement the shell first, verify phone
and iPad behaviour, and only then tune wide-desktop card and media proportions.

## Applicable Rules

- Follow `AGENTS.md` and preserve unrelated or user-owned changes.
- Keep layout changes site-specific under `site/`; do not widen shared theme
  packages or starter applications.
- Preserve source-image aspect ratios as required by the project banner
  workflow.
- Keep this change compatible with the responsive search, persistent article
  contents navigation, mobile action dock, scroll-to-top control, comments and
  responsive blog-table implementations.
- Do not commit, push, deploy, publish or alter Git history unless separately
  requested.
