const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const readSource = relativePath =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8')

test('mobile search keeps iOS controls tappable and focuses the query input', () => {
  const trigger = readSource('site/src/components/BlogSearch.jsx')
  const dialog = readSource('site/src/components/BlogSearchDialog.jsx')

  assert.match(trigger, /document\.documentElement\.appendChild\(host\)/)
  assert.match(dialog, /touchAction: `auto`/)
  assert.match(dialog, /fontSize: `16px`/)
  assert.match(dialog, /type='search'[\s\S]*autoFocus/)
  assert.match(dialog, /WebkitOverflowScrolling: `touch`/)
  assert.doesNotMatch(
    dialog,
    /addEventListener\(`scroll`, maintainPagePosition/
  )
})

test('page contents navigation uses page wording outside article contents', () => {
  const contents = readSource('site/src/components/ArticleContents.jsx')
  const sheet = readSource('site/src/components/ArticleContentsSheet.jsx')

  assert.match(
    contents,
    /const navigationLabel = showInlineNavigation \? `Bu yazıda` : `Bu sayfada`/
  )
  assert.match(contents, /label=\{navigationLabel\}/)
  assert.match(sheet, /label,/)
  assert.match(sheet, /\{label\}/)
})

test('scroll-to-top aligns with the desktop body without changing the mobile dock', () => {
  const scrollToTop = readSource('site/src/components/ScrollToTop.jsx')

  assert.match(
    scrollToTop,
    /right: `max\(calc\(1\.5rem \+ env\(safe-area-inset-right, 0px\)\), calc\(\(100vw - 1140px\) \/ 2 - 5rem\)\)`/
  )
  assert.match(
    scrollToTop,
    /'@media \(max-width: 767px\)': \{\s*display: `none`/
  )
  assert.match(
    scrollToTop,
    /position: `static`,[\s\S]*'@media \(max-width: 767px\)': \{\s*display: `flex`/
  )
})

test('Instagram waits for live data and keeps its heading on one line', () => {
  const showcase = readSource('site/src/components/InstagramShowcase.jsx')

  assert.match(showcase, /useState\('loading'\)/)
  assert.match(showcase, /status === 'loading'/)
  assert.match(showcase, /<InstagramSkeleton \/>/)
  assert.match(showcase, /<Box sx=\{\{ width: `100%`, minWidth: 0 \}\}>/)
  assert.match(
    showcase,
    /status !== 'ready' \|\| !feed[\s\S]*<InstagramNewsletter \/>/
  )
  assert.match(showcase, /data-instagram-state='loading'/)
  assert.match(showcase, /aria-label='Instagram bölümü yükleniyor'/)
  assert.match(showcase, /Yoldaki hikâyeleri kaçırma/)
  assert.match(showcase, /whiteSpace: `nowrap`/)
  assert.doesNotMatch(showcase, /FALLBACK_PROFILE|localPortrait/)
})

test('Instagram and newsletter share a compact responsive homepage section', () => {
  const homepage = readSource(
    'site/src/@elegantstack/gatsby-theme-flexiblog-agency/containers/Posts.jsx'
  )
  const newsletter = readSource('site/src/components/InstagramNewsletter.jsx')
  const form = readSource(
    'site/src/@elegantstack/flow-ui-components/NewsletterForm/NewsletterForm.jsx'
  )

  assert.match(
    homepage,
    /<InstagramShowcase showNewsletter=\{services\.mailchimp\} \/>/
  )
  assert.doesNotMatch(homepage, /NewsletterExpanded/)
  assert.match(newsletter, /data-instagram-newsletter/)
  assert.match(newsletter, /width: 36/)
  assert.match(newsletter, /height: 36/)
  assert.match(newsletter, /<NewsletterForm[\s\S]*compact/)
  assert.match(form, /fontSize: `16px`/)
  assert.match(form, /gridTemplateColumns: \[`1fr`, `minmax\(0, 1fr\) auto`\]/)
  assert.match(form, /minWidth: \[`100%`, `7\.5rem`\]/)
})

test('homepage chrome includes the favicon and hides the category scrollbar', () => {
  const seo = readSource('site/src/@elegantstack/flow-ui-widgets/Seo/Seo.jsx')
  const categories = readSource('site/src/components/HomepageCategories.jsx')

  assert.match(seo, /import favicon from .*favicon\.png/)
  assert.match(seo, /<link rel='icon' type='image\/png' href=\{favicon\} \/>/)
  assert.match(categories, /scrollbarWidth: `none`/)
  assert.match(categories, /'&::\-webkit-scrollbar': \{[\s\S]*display: `none`/)
})

test('homepage profile card uses the responsive portrait instead of the greeting icon', () => {
  const profileCard = readSource(
    'site/src/@elegantstack/flow-ui-widgets/BannerVertical/BannerVertical.jsx'
  )
  const portrait = path.resolve(
    __dirname,
    '..',
    'site/content/assets/bu-adam-kim.jpeg'
  )

  assert.equal(fs.existsSync(portrait), true)
  assert.match(
    profileCard,
    /import \{ StaticImage \} from 'gatsby-plugin-image'/
  )
  assert.match(
    profileCard,
    /src='\.\.\/\.\.\/\.\.\/\.\.\/content\/assets\/bu-adam-kim\.jpeg'/
  )
  assert.match(profileCard, /alt='İbrahim Uylaş doğa yürüyüşünde'/)
  assert.match(profileCard, /height: \[`250px`, `320px`, null, `260px`\]/)
  assert.match(profileCard, /objectFit: `cover`, objectPosition: `50% 38%`/)
  assert.doesNotMatch(profileCard, /FaMountain|Merhaba,/)
})
