# Turkish version and old-domain removal — 27 October 2026

Production deploy: 6ae11033b12ed8a2415b6899.

- https://obi.uylas.net/tr resolves to /tr/ with Turkish static HTML, lang=tr, Turkish title/description/canonical, localized manifest and working assets.
- Mobile browser verified all four pages, adult concept controls, profile fields, health tables and AI reading notes, parent navigation and Back. English source transcripts remain verbatim under an explicit original-English heading.
- 320px and 430px layouts have no horizontal document overflow. Language navigation preserves the active page hash in both directions; default root remains English.
- 25 application tests and 4 packaging tests passed; production build passed. Localization tests cover source URL/medical notation preservation, profile narrative and health-summary coverage, nested image labels, deep links and route boundaries.
- Removed xx.uylas.net from site domain aliases; its managed DNS record was automatically removed. Authoritative DNS reports NXDOMAIN; direct Netlify request with the previous address returns 404. Removed old-address redirects from netlify.toml. Obi remains the primary custom domain.
- No Git commit/push; unrelated root changes preserved.
