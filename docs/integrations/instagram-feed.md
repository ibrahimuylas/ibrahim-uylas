# Instagram feed provisioning and production smoke check

The homepage and contact-page feeds use the official Instagram API with
**Instagram Login** for the approved `@uylasonwheels` Creator or Business
account. Provisioning and deployment are owner-run operations; no production
credential is stored in this repository.

## Meta and Netlify setup

1. In the owner-controlled Meta app, configure Instagram Login for the
   professional account and grant `instagram_business_basic`.
2. Obtain the professional account's numeric user ID and a long-lived access
   token through Meta's owner-authorized flow.
3. In the production site's Netlify environment, set:
   - `INSTAGRAM_ACCESS_TOKEN` — secret, server-only bearer token;
   - `INSTAGRAM_USER_ID` — numeric professional-account ID;
   - `INSTAGRAM_API_VERSION` — explicit `v<major>.<minor>` API version.
4. Restrict the variables to the production context as appropriate and trigger
   a new production deploy. None of these names should use the `GATSBY_`
   prefix. Only `GATSBY_GA_MEASUREMENT_ID` is a public build variable.

The site owner is responsible for monitoring expiry and manually renewing the
long-lived token before it expires. Automatic token storage or rotation is not
part of this integration. Never paste the token into source files, browser
tools, screenshots, support messages, command history, URLs, or logs.

## Local development

`gatsby serve` only serves the generated `site/public` directory. It does not
run the Netlify Functions in `netlify/functions`, so
`/.netlify/functions/instagram-feed` returns the Gatsby 404 HTML and the live
Instagram details stay hidden by design. The newsletter strip remains visible.

Use Netlify Dev from the linked project when testing the real feed locally, and
make the three `INSTAGRAM_*` variables above available to that local Netlify
environment. Do not copy the access token into Gatsby client variables or any
checked-in file. The newsletter submission endpoint follows the same rule:
`gatsby serve` can render its form, but a real local submission also requires
the Netlify function runtime and its server-only Mailchimp variables.

## Public function contract

`GET /.netlify/functions/instagram-feed` returns a sanitized JSON object with
`ok: true`, public profile fields, and exactly six supported posts ordered
newest first. Each post contains only `id`, `type`, `imageUrl`, `permalink`,
`caption`, and `timestamp`. The token is sent upstream only as a bearer header.

Successful responses use:

- `Cache-Control: public, max-age=300, stale-while-revalidate=86400`
- `Netlify-CDN-Cache-Control: public, max-age=3600, stale-while-revalidate=86400`

Unsupported methods return `405` with `Allow: GET`. Configuration, timeout,
network, upstream, and malformed-data failures return a fixed `{ "ok": false }`
response with `Cache-Control: no-store`; they do not expose upstream bodies,
URLs, captions, or credentials.

## Production smoke check (owner action; pending provisioning and deployment)

Perform these checks without printing the access token or copying raw response
captions:

1. Open the deployed homepage in a private browser session. Confirm the
   Instagram section and compact newsletter strip appear after the featured
   articles, and that
   `Takip et` opens `https://www.instagram.com/uylasonwheels/` while `Mesaj at`
   opens `https://ig.me/m/uylasonwheels`.
2. Inspect the feed request in the browser Network panel. Confirm `GET` returns
   `200`, `ok: true`, the expected public username, and six posts in descending
   timestamp order. Compare timestamps only; do not copy captions into notes.
3. Confirm the response has the browser and Netlify CDN cache policies above.
   Send a credential-free `POST` request from the browser tooling and confirm
   `405`, `Allow: GET`, `{ "ok": false }`, and `Cache-Control: no-store`.
4. Temporarily test a controlled preview with the function unavailable or its
   response blocked. Confirm the skeleton disappears, no default Instagram
   profile data is exposed, and the compact newsletter strip remains available
   without a broken gallery or error panel.
5. With GA4 DebugView enabled for the smoke session, activate the profile,
   message, and one post link once each. Confirm exactly one
   `instagram_profile_click`, `instagram_message_click`, and
   `instagram_post_click`; inspect parameters using the rules below.
6. Confirm the six posts are current for the account and note only the check
   time, status, item count, newest/oldest timestamps, and cache-header values.
   Do not record response bodies or captions.

If any check fails, remove or correct the Netlify configuration rather than
placing credentials in client code. A previously cached successful response may
remain available during a transient upstream failure.
