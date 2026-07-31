# Disqus to Giscus migration

The site uses Giscus for new comments and GitHub Discussions in
`ibrahimuylas/ibrahim-uylas` as its storage.

## Before deployment

1. Enable Discussions for the public GitHub repository.
2. Install the Giscus GitHub App on the repository.
3. Create a `Blog Comments` category. An Announcements-style category is
   preferred so only maintainers and Giscus can create discussions.
4. Open [giscus.app](https://giscus.app/), select the repository and category,
   and record the generated repository and category IDs.
5. Add these Netlify environment variables for production and deploy previews:

   - `GATSBY_GISCUS_REPO`
   - `GATSBY_GISCUS_REPO_ID`
   - `GATSBY_GISCUS_CATEGORY`
   - `GATSBY_GISCUS_CATEGORY_ID`

The IDs are configuration identifiers, not secrets. The current branch includes
the IDs for the configured repository and category as defaults; Netlify
environment variables can override them for a future repository change.

## Historical comments

Export the Disqus forum from Disqus Admin → Moderation → Export and keep the
compressed XML export in secure storage outside the repository. Do not commit
the export because it may contain personal data.

Build an inventory from the export before creating GitHub Discussions. Match
each Disqus thread to the article's canonical pathname, including its trailing
slash. Verify migrated and legacy URLs separately so a redirect does not create
duplicate discussions.

Historical comments can be preserved as attributed archive content, but they
cannot be reassigned to the original Disqus identities or have their Disqus
reactions, subscriptions, notifications, or moderation history transferred.
Do not impersonate commenters with the migration account. Keep the original
Disqus forum and link to the original thread while the migration is being
verified.

## Staged cutover

1. Migrate a sample containing an empty thread, a single comment, a threaded
   discussion, and an article with a legacy URL.
2. Confirm every sample discussion is found using Giscus `pathname` mapping.
3. Confirm the lazy-loading button and near-viewport loading still work.
4. Migrate the remaining inventory and compare source and destination counts.
5. Deploy with the Disqus forum retained as an archive.
6. Announce that new comments require GitHub authentication.

Giscus uses GitHub Discussions and requires visitors to authorize the Giscus
app through GitHub before commenting. See the [Giscus configuration guide](https://giscus.app/)
and [Disqus export guidance](https://help.disqus.com/en/articles/1717199-importing-exporting).
