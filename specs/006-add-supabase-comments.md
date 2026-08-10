# Add first-party comments with Supabase

## Goal

Replace the long-term dependency on Giscus with a first-party comment system
that auto-publishes valid reader comments, keeps email addresses private,
supports reversible moderation, and sends reply notifications.

## Rollout

The implementation is controlled by `GATSBY_NATIVE_COMMENTS_ENABLED`.
Production enables the native system after the empty-state, submission,
moderation, notification, and rollback paths have been verified. Historical
Disqus/Giscus data can be imported afterward; setting the flag to `false`
restores Giscus as the operational fallback.

## Functional requirements

1. A reader submits a name, email address, and plain-text comment for the
   current article. Name and comment are public; email is never returned by a
   public API.
2. Valid submissions auto-publish after Cloudflare Turnstile, a honeypot, input
   validation, and rate limiting succeed.
3. Conversations support top-level comments and one visual reply level. A
   reply may target any visible comment, but is displayed beneath its root.
4. The default order is newest root conversation first. Readers can switch to
   oldest first. Return 20 root conversations at a time with cursor pagination.
5. A commenter may explicitly opt into reply notifications. The address must
   be verified before notifications are sent. Only the author of the directly
   replied-to comment is notified.
6. The site owner receives an email for every reader comment with a signed-in
   moderation-page link. Email delivery uses a retrying outbox and idempotency
   keys, with at most eight attempts over 24 hours.
7. Comment management is available inside the existing Decap CMS at
   `/admin/#/comments-management`. It reuses Decap's GitHub session instead of
   introducing a second login screen. The server accepts only the configured
   GitHub account.
8. An administrator can hide, restore, edit, and reply publicly. Comments are
   never physically deleted by moderation. Every change is recorded in an
   audit table.
9. Hiding a root removes the entire conversation from public responses while
   preserving the root and every reply for later review or restoration.
10. Verification and unsubscribe links reveal no email address and use
    single-purpose random tokens stored as hashes.

## Security and privacy requirements

- Enable RLS on every comments table and expose no table policy to `anon` or
  ordinary `authenticated` users.
- Revoke direct table and function access from `PUBLIC`, `anon`, and
  `authenticated`. Netlify Functions use the Supabase secret key; the browser
  never receives a Supabase credential.
- Verify the Decap OAuth token with GitHub's authenticated-user endpoint on
  every moderation API request and match the returned login to the exact
  `COMMENTS_ADMIN_GITHUB_LOGIN` allowlist value.
- Keep comments plain text. Bound names, emails, paths, titles, and bodies;
  normalize paths; return generic errors; never log credentials or addresses.
- Keep Resend, Turnstile, and Supabase secret keys in Netlify environment
  variables, not source control or `netlify.toml`.

## Data model

- `comment_threads`: canonical article path and title.
- `comments`: public text, status, threading, import provenance, timestamps.
- `comment_contacts`: private address, verification, opt-in, unsubscribe token.
- `comment_email_outbox`: retryable owner, verification, and reply mail jobs.
- `comment_moderation_events`: append-only administrative audit trail.

The schema reserves `source` and `source_id` for a later idempotent Disqus and
Giscus import. Reactions and historical import are intentionally outside this
phase.

## External configuration

- Supabase URL and secret key.
- The existing Decap CMS GitHub OAuth configuration and the allowed owner login
  in `COMMENTS_ADMIN_GITHUB_LOGIN`.
- Resend API key, verified sender `ibrahim@uylas.net`, and owner recipient
  `ibrahim@uylas.net`.
- Cloudflare Turnstile site and secret keys.
- `SITE_URL` and the native-comments feature flag.

## Acceptance criteria

1. Public readers can submit and immediately read valid comments without an
   account, choose newest/oldest order, reply, and paginate.
2. Public API/browser payloads never contain email addresses, hashes, tokens,
   outbox rows, or moderation audit data.
3. Reply opt-in remains inactive until verification; verified direct-parent
   authors receive a reply email and can unsubscribe.
4. Owner notification, hide, restore, edit, owner reply, hidden-conversation
   behavior, and audit records work end to end.
5. Failed email jobs retry safely without duplicate provider sends and stop
   after eight attempts or 24 hours.
6. RLS, grants, focused tests, the root test suite, and the Gatsby production
   build pass. Production configuration includes matching Supabase, Resend,
   and Turnstile values and retains the Giscus feature-flag fallback.

## Out of scope

- Importing historical Disqus or Giscus comments and reactions.
- Public reactions, commenter accounts, rich text, Markdown, image uploads,
  comment editing by readers, and permanent deletion.
- Importing historical data as a prerequisite for enabling the native system.

## Open questions

None. The rollout, moderation, privacy, notification, and threading behavior
above are approved.
