# Replace homepage YouTube embeds with an Instagram showcase

## Goal

Replace the outdated homepage YouTube block with a compact, automatically
updated Instagram showcase that helps visitors discover, follow, and message
`@uylasonwheels` without making the homepage longer or visually heavier.

## Background

The active homepage renders two fixed-height YouTube iframes between the
`Kampçılık` and `Doğa Yürüyüşleri` article sections. Together they consume more
than 600 pixels of vertical space on narrow screens, expose stale content, and
do not support the author's current social-publishing behavior.

The Instagram account is a Creator or Business account. The approved approach
uses the official Instagram API with Instagram Login and the
`instagram_business_basic` permission. The selected visual direction is stored
at `specs/assets/004-instagram-showcase-selected.png`.

## User Stories

- As a homepage visitor, I want to see recent outdoor and travel posts without
  leaving a large gap between article sections.
- As a prospective follower, I want a clear route to the Instagram profile.
- As a visitor who wants to make contact, I want to open a direct Instagram
  message conversation.
- As a reader on mobile, I want to browse recent posts with a natural
  horizontal gesture without creating page-level overflow.
- As the site owner, I want new Instagram posts to appear automatically without
  editing the Gatsby site after every post.

## Functional Requirements

1. Remove the two homepage YouTube iframes and render the new Instagram
   showcase in the same position after the `Kampçılık` group.
2. Follow the selected visual target:
   - use a lightweight, pale-indigo section integrated into the page rather
     than a large nested card;
   - use the existing left-accent section language and Theme UI tokens;
   - show the heading `Yolda beni takip et`;
   - show the profile photo, `İbrahim Uylaş`, `@uylasonwheels`, and
     `Londra’dan vahşi doğaya`;
   - show primary `Takip et` and secondary `Mesaj at` actions;
   - show the label `Son 6 paylaşım`.
3. Display exactly six newest supported feed items. Use `thumbnail_url` for
   Reels or videos and `media_url` for images or carousel covers. Link every
   item to its Instagram `permalink`.
4. At desktop widths, show all six square thumbnails in one row. At mobile and
   tablet widths, show approximately 2.4 thumbnails and allow horizontal
   scroll-snap navigation without arrows, pagination dots, or page-level
   horizontal overflow.
5. Link `Takip et` to
   `https://www.instagram.com/uylasonwheels/` and `Mesaj at` to
   `https://ig.me/m/uylasonwheels`. The site must not claim to follow or send a
   message automatically.
6. Add a read-only Netlify function at
   `/.netlify/functions/instagram-feed`. It must:
   - accept only `GET`;
   - call the official `graph.instagram.com` API with a server-side bearer
     token;
   - read `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, and
     `INSTAGRAM_API_VERSION` from the environment;
   - request enough media to return six usable items;
   - sort normalized media by descending timestamp;
   - return only the public fields required by the component;
   - never expose access tokens, upstream URLs containing tokens, or raw Meta
     error bodies.
7. Use this successful response contract:

   ```json
   {
     "ok": true,
     "profile": {
       "name": "İbrahim Uylaş",
       "username": "uylasonwheels",
       "biography": "Londra’dan vahşi doğaya",
       "profileImageUrl": "https://..."
     },
     "posts": [
       {
         "id": "...",
         "type": "IMAGE",
         "imageUrl": "https://...",
         "permalink": "https://www.instagram.com/...",
         "caption": "...",
         "timestamp": "2026-07-27T12:00:00+0000"
       }
     ]
   }
   ```

   Unsupported methods return `405`. Configuration and upstream failures
   return a sanitized non-success response.

8. Cache successful responses for five minutes in the browser-facing cache and
   one hour in Netlify's CDN, with stale-while-revalidate support for up to 24
   hours.
9. Reserve the gallery footprint while loading. If no current or stale feed is
   available, remove the loading placeholders and retain the profile text and
   two working actions without broken thumbnails or an intrusive error panel.
10. Track the following GA4 events through the existing analytics helper:
    - `instagram_profile_click`;
    - `instagram_message_click`;
    - `instagram_post_click`.

    Parameters may include `source_path`, `post_position`, and `media_type`.
    Captions, visitor information, and access-token data must not be sent.

11. Document the non-secret environment variable names, Meta app permission,
    token provisioning, manual renewal responsibility, and a production smoke
    check. Do not commit a real token.

## Non-Functional Requirements

- Keep implementation site-specific. Do not modify reusable packages, starter
  sites, or unrelated homepage sections.
- Preserve Gatsby server rendering: do not access browser globals during
  render, and keep the static profile copy and actions available before the
  client request completes.
- Reuse React, Theme UI, the installed icon library, existing color tokens,
  radii, breakpoints, and analytics helper. Do not add a UI or Instagram-widget
  dependency.
- Use native links with visible keyboard focus and descriptive accessible
  names. Decorative icons must be hidden from assistive technology.
- Derive post alternative text from a bounded caption summary, falling back to
  `Instagram paylaşımı N`; never expose an empty or unbounded caption as UI.
- Use square aspect-ratio boxes, explicit dimensions, and lazy-loaded images to
  limit layout shift and unnecessary network work.
- Support the site's existing light and dark modes.
- The implementation must remain useful when JavaScript, the Instagram API, or
  the access token is unavailable.
- Keep the access token and upstream failures out of browser bundles, logs, and
  public responses.

## Acceptance Criteria

1. The built homepage contains no iframe in the former horizontal banner slot
   and visibly renders the Instagram section between `Kampçılık` and
   `Doğa Yürüyüşleri`.
2. The section matches
   `specs/assets/004-instagram-showcase-selected.png` in hierarchy, integrated
   indigo treatment, profile content, CTA emphasis, and compact mobile density.
   It shows six thumbnails in one desktop row and a touch-scrollable 2.4-card
   mobile rail without adding page-level horizontal overflow.
3. A successful normalized API response renders exactly the six newest usable
   posts. Image, carousel, Reel, and video fixtures use the correct display
   image and every tile opens its matching Instagram permalink.
4. `Takip et` and `Mesaj at` expose descriptive accessible names and open the
   approved profile and DM destinations. Profile, message, and post activations
   emit exactly one corresponding GA4 event without personal data.
5. The browser bundle and function response contain no Instagram access token.
   Missing configuration, non-GET requests, malformed Meta data, timeouts, and
   upstream failures return sanitized results and never produce an unhandled
   page error.
6. Loading reserves the rail's layout. With a failed feed request, the
   placeholders are removed, the profile text and both CTAs remain usable, no
   broken image is rendered, and no intrusive error message is shown.
7. Automated tests cover method handling, configuration failure, successful
   normalization and ordering, six-item limiting, Reel/video thumbnails,
   malformed media, sanitized upstream failure, and analytics-safe component
   behavior. The repository test suite, Gatsby production build, generated
   HTML validation, and focused light/dark responsive browser review pass.

## Applicable Rules

- Follow `AGENTS.md`.
- Preserve unrelated and user-owned working-tree changes.
- Follow the site-specific shadowing pattern under `site/src/@elegantstack/`.
- Follow the privacy rules in `docs/analytics/measurement-plan.md`.
- Treat `specs/assets/004-instagram-showcase-selected.png` as the visual source
  of truth and record the final comparison in `design-qa.md`.
- Do not commit, push, deploy, publish, or alter Git history unless separately
  requested.

## Out of Scope

- Removing YouTube links from site metadata, the footer, or author profiles.
- Instagram scraping, Instagram embed scripts, or third-party feed widgets.
- Automatically following the account or sending a message for the visitor.
- Displaying follower, following, like, view, or comment counts.
- A CMS for profile copy, post count, or gallery ordering.
- Redesigning article cards, category sections, the header, or the footer.
- Automatic storage or rotation of Meta access tokens.
- Production deployment or publication.

## Open Questions

None. The account type, official automatic feed, six-post limit, selected
visual direction, position, CTAs, analytics events, and fallback behavior are
approved implementation defaults. Production activation depends on the site
owner provisioning the Meta app token and Netlify environment variables.
