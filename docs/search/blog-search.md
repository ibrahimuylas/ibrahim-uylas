# Turkish blog search

The blog uses Pagefind 1.5.2 to build a static, Turkish full-text index from
Gatsby's finished HTML. It does not use Algolia, an API endpoint, credentials,
or a search-specific environment variable.

## Build and index lifecycle

The root `npm run build` command delegates to the site workspace. The site
build runs these steps in order:

1. `gatsby build` generates `site/public`.
2. The generated-HTML sanitizer removes the known deterministic NUL bytes from
   generated `.html` files and verifies that none remain.
3. Pagefind indexes `site/public`.

Pagefind must stay after Gatsby and the sanitizer. It cannot index source MDX or
an incomplete output directory. The generated browser module, Turkish metadata,
index chunks, and result fragments are written under `site/public/pagefind`.
The repository's `public` ignore rule keeps all of these build artifacts out of
Git.

Netlify uses the same path. Its build command cleans the site and calls the
root build before publishing `site/public`; there is no separate hosted-index
job.

For a repeatable local production check:

```sh
npm run clean --workspace site
npm run build
npm run validate:html
npm run serve --workspace site
```

The generated-output validator derives the current article inventory from
fresh Gatsby `page-data.json` files. It verifies public/private eligibility,
article metadata, repeated-chrome exclusions, the Turkish Pagefind artifacts,
and Pagefind's reported indexed-page count. Do not replace this with a
hard-coded article count.

## Index boundary

Only local, non-private article renders receive `data-pagefind-body`. The
boundary contains the visible article title, category metadata, and rendered
MDX body. Private articles still render normally but have no body marker.
Homepage, category, contact, author, tag, and other non-article pages are
unmarked.

The title is visible `title` metadata and the visible category is `category`
metadata. Author, publication/update dates, reading time, article contents,
deferred embed controls, hero media, tags/share controls, comments, related
cards, newsletters, header, and footer are outside the searchable text or
explicitly ignored. Generated documents retain `lang="tr"` so Pagefind selects
its Turkish language data and stemming behavior.

## Browser behavior

Gatsby SSR and the initial page load contain the responsive header trigger but
not the dialog or Pagefind runtime. Opening search creates the client-only
dialog and dynamically imports `/pagefind/pagefind.js`; Pagefind then requests
its Turkish metadata and only the chunks needed for the current query. A
successful module is reused across later openings.

Below 768 px the dialog fills the viewport. At 768 px and wider it becomes a
full-height right drawer whose width scales with the viewport. The heading,
search input, and status stay fixed while only the results region scrolls, so
the search surface does not change height as results arrive.

Production builds therefore search entirely from same-origin static files. In
`gatsby develop`, no Pagefind bundle is generated. Opening search in that mode
shows the contained Turkish unavailable state; it does not call a remote
service. Missing assets, initialization failures, query failures, and malformed
result details remain inside the dialog so the current page and navigation
continue to work.

## Deployment smoke

After a production deployment:

1. Open the homepage with the browser network panel recording and disable its
   cache. Confirm no request path begins with `/pagefind/` before activation.
2. Open `Arama`. Confirm `pagefind.js`, `pagefind-entry.json`, Turkish metadata
   and Wasm load on demand. Enter a valid query and confirm only required index
   and fragment chunks follow.
3. Search for `uyku tulumu`, `Likya`, and `çadır`. Confirm relevant local
   articles, category labels, highlighted excerpts, ten initial cards, and
   ten-at-a-time pagination.
4. Confirm private routes and homepage/category/contact content do not appear.
5. Repeat at mobile and desktop widths with keyboard and touch/pointer input.
   Check focus containment, Escape/backdrop/close dismissal, focus return,
   scroll restoration, route navigation, and the absence of horizontal
   overflow or console errors.
6. Temporarily block `/pagefind/pagefind.js` and reopen search. Confirm the
   unavailable state is contained and a later unblocked opening retries.

No secret, Pagefind account, or search service is needed for this smoke. GA4
event verification is documented in
[`docs/analytics/measurement-plan.md`](../analytics/measurement-plan.md).
