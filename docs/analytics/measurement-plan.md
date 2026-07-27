# Analytics measurement plan

This document defines the GA4 events used by ibrahimuylas.com. The production
property is `ibrahimuylas.com - GA4` (`395807433`) and the web stream uses
measurement ID `G-P1CM0RM05V`.

## Outcomes

The implementation should answer four questions:

1. Which articles attract qualified visitors?
2. Which articles lead readers to another guide?
3. Which visits produce a newsletter subscription?
4. Which search queries and landing pages are gaining or losing visibility?

## Events

| Event                     | Source                         | Parameters                                     | Key event |
| ------------------------- | ------------------------------ | ---------------------------------------------- | --------- |
| `page_view`               | GA4/Gatsby                     | GA4 defaults                                   | No        |
| `user_engagement`         | GA4 enhanced measurement       | GA4 defaults                                   | No        |
| `scroll`                  | GA4 enhanced measurement       | GA4 defaults                                   | No        |
| `click`                   | GA4 enhanced measurement       | GA4 defaults                                   | No        |
| `file_download`           | GA4 enhanced measurement       | GA4 defaults                                   | No        |
| `related_article_click`   | Related-post section           | `link_url`, `source_path`                      | No        |
| `category_hub_click`      | Category guide article links   | `hub`, `section_id`, `link_url`, `source_path` | No        |
| `newsletter_signup`       | Successful newsletter function | `form_name`, `page_path`                       | Yes       |
| `instagram_profile_click` | Homepage Instagram profile CTA | `source_path`                                  | No        |
| `instagram_message_click` | Homepage Instagram message CTA | `source_path`                                  | No        |
| `instagram_post_click`    | Homepage Instagram post tile   | `source_path`, `post_position`, `media_type`   | No        |

`contact_submit` remains reserved for a future working contact form. The current
contact form is a disabled demonstration and must not emit a successful outcome.

## Privacy rules

- Never send an email address, name, phone number, message, or Mailchimp response
  text to GA4.
- URL parameters must contain only public page paths or public destination URLs.
- Event parameters describe the UI interaction, not the visitor.
- Category-guide events contain only the public hub name, section identifier,
  destination path, and source path.
- Instagram events must not include captions, visitor identifiers or
  attributes, access-token data, image URLs, permalinks, or profile data.
  `post_position` is the one-based displayed position and `media_type` is only
  `image`, `carousel`, or `video`.
- The Mailchimp API key must remain in Netlify and must never be bundled into the
  browser application.
- The GA4 build plugin must run only when Netlify sets `CONTEXT=production`.

## Verification

For every deployment:

1. Confirm one `page_view` per route in GA4 DebugView or Realtime.
2. Follow a related-post link and confirm one `related_article_click`.
3. Follow one Kampçılık guide link and confirm one `category_hub_click` with
   only `hub`, `section_id`, `link_url`, and `source_path`.
4. Complete a test newsletter subscription and confirm one
   `newsletter_signup` without personal information in its parameters.
5. Confirm GA4 enhanced measurement supplies engagement, scroll, outbound-click,
   and download events where applicable.
6. On the deployed homepage, enable GA4 DebugView for the test device. Activate
   `Takip et`, `Mesaj at`, and one post once each. Confirm exactly one
   `instagram_profile_click`, one `instagram_message_click`, and one
   `instagram_post_click`.
7. In each DebugView event, confirm `source_path` is the public page path.
   Confirm only the post event also has a one-based `post_position` and a
   normalized `media_type`; verify that no caption, visitor, profile, URL, or
   token data is present.
8. Check that development and preview traffic is excluded from reporting when
   validating production trends.

## Initial reporting baseline

The pre-verification baseline for 23 June–20 July 2026 is 389 sessions, 42
engaged sessions, a 10.8% engagement rate, 3 seconds of average engagement per
session, 1.39 views per active user, and zero key events. Because the tag was
recently corrected, this is a directional baseline rather than a quality target.

The findings and recommended follow-up are recorded in the
[blog analytics review](./blog-analytics-review.md).
