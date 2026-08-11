# Supabase comments operations

The native comments implementation is controlled by
`GATSBY_NATIVE_COMMENTS_ENABLED`. Production currently enables it. Setting the
flag to `false` and rebuilding hides the comment UI without removing comment
data; there is no third-party comment fallback.

## Services

- Supabase project `ibrahimuylas` stores threads, public comments, private
  contacts, the email outbox, and moderation audit events.
- Netlify Functions are the only comments data API. The browser never receives
  the Supabase secret key or queries comment tables directly.
- Resend sends mail from the verified `uylas.net` domain.
- Cloudflare Turnstile protects public submissions. Netlify also applies a
  per-IP submit rate limit and the form includes a honeypot.

Copy the variable names from `.env.example` into Netlify. Scope the public
Gatsby variables to Builds and the server-only variables to Functions. Enable
the native feature flag only in deploy contexts that have matching Supabase,
Resend, and Turnstile configuration.

## Local Turnstile testing

Use Cloudflare's matching, always-successful dummy key pair on localhost. The
browser site key and Function secret must both be test keys; a dummy browser
token is rejected when it is sent with a production or unrelated secret.

```dotenv
GATSBY_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

Never use these dummy keys in Production. Configure the real site key and its
matching secret in Netlify for production deploys.

## Local admin testing

Build the site, then run these commands from the repository root in two
terminals:

```bash
npx --yes decap-server
```

```bash
COMMENTS_PROJECT_ROOT=$(pwd)
npx netlify dev \
  --filter site \
  --framework '#static' \
  --dir "$COMMENTS_PROJECT_ROOT/site/public" \
  --functions "$COMMENTS_PROJECT_ROOT/netlify/functions" \
  --port 8888 \
  --context dev
```

Open `http://localhost:8888/admin/#/comments-management`. Decap's local
backend shows its own single Login button and then opens the normal admin
shell. The local-only moderation token is accepted only when Netlify is in the
`dev` context and the request host is `localhost` or `127.0.0.1`; production
continues to verify the real Decap OAuth token with GitHub.

## Database deployment

The canonical schema is the timestamped file under `supabase/migrations`.
Apply it with the Supabase CLI, then run the database lint/advisor checks. All
five tables must have RLS enabled and no `anon` or ordinary `authenticated`
policies/grants. Only `service_role` can invoke the internal RPC functions.

No Supabase Auth provider is required for moderation. The management view is a
custom module inside the existing Decap CMS and reuses the GitHub OAuth token
already stored by Decap. Set `COMMENTS_ADMIN_GITHUB_LOGIN=ibrahimuylas` (or the
intended owner login) in Netlify Functions. On every management request the
Function asks GitHub for the authenticated user and requires an exact login
match before calling a Supabase RPC.

## Email outbox

Submission attempts an immediate asynchronous drain. A scheduled function runs
every 15 minutes on published Netlify deploys to retry due jobs. Resend receives
the outbox idempotency key. Jobs use exponential backoff, stop after eight
attempts, and are no longer claimed after 24 hours.

## Moderation and privacy

The owner view is `/admin/#/comments-management`, beside Decap's Contents and
Media navigation. There is no separate login page: when Decap is signed out,
its existing GitHub login is the only login shown. Hide/restore/edit/reply
operations require a valid Decap GitHub token for the allowlisted account.
Hiding retains the row and records an audit event. Public JSON contains only
names, comment text, status, and timestamps; email addresses appear only inside
the authenticated Decap view.

Rotate any database password that has ever been pasted into chat or another
non-secret channel after the schema has been applied.
