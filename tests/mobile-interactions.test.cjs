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

test('scroll-to-top uses opposite bottom corners on tablet without changing the mobile dock', () => {
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
    /'@media \(min-width: 768px\) and \(max-width: 1199px\)': \{[\s\S]*right: `calc\(1rem \+ env\(safe-area-inset-right, 0px\)\)`[\s\S]*top: `auto`[\s\S]*bottom: `calc\(1rem \+ env\(safe-area-inset-bottom, 0px\)\)`[\s\S]*transform: `none`/
  )
  assert.match(
    scrollToTop,
    /position: `static`,[\s\S]*'@media \(max-width: 767px\)': \{\s*display: `flex`/
  )
})

test('mobile action dock uses a compact dark surface without Safari artifacts', () => {
  const dock = readSource('site/src/components/MobileActionDock.jsx')
  const contents = readSource('site/src/components/ArticleContents.jsx')
  const search = readSource('site/src/components/BlogSearch.jsx')
  const scrollToTop = readSource('site/src/components/ScrollToTop.jsx')

  assert.doesNotMatch(dock, /(?:Webkit)?BackdropFilter/)
  assert.match(dock, /width: `max-content`/)
  assert.match(dock, /maxWidth: `calc\(100vw - 2rem\)`/)
  assert.match(dock, /borderWidth: 1/)
  assert.match(dock, /borderStyle: `solid`/)
  assert.match(dock, /borderColor: `rgba\(255, 255, 255, 0\.14\)`/)
  assert.match(dock, /borderRadius: `full`/)
  assert.match(dock, /bg: `#0d1117`/)
  assert.match(dock, /boxShadow: `none`/)

  for (const action of [contents, search, scrollToTop]) {
    assert.match(action, /color: `white`/)
    assert.match(action, /'&:active': \{[\s\S]*transform: `scale\(0\.92\)`/)
    assert.match(action, /svg: \{\s*width: 24,\s*height: 24/)
  }
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
  const showcase = readSource('site/src/components/InstagramShowcase.jsx')
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
  assert.match(newsletter, /mt: `10px`/)
  assert.match(newsletter, /width: 36/)
  assert.match(newsletter, /height: 36/)
  assert.match(newsletter, /gridTemplateColumns: `1fr`/)
  assert.match(
    newsletter,
    /min-width: 1200px[\s\S]*gridTemplateColumns: `minmax\(0, 1fr\) minmax\(22rem, 0\.8fr\)`/
  )
  assert.match(newsletter, /<NewsletterForm[\s\S]*compact/)
  assert.match(form, /fontSize: `16px`/)
  assert.match(form, /borderWidth: 1/)
  assert.match(form, /borderColor: `omega`/)
  assert.match(form, /bg: `contentBg`/)
  assert.match(form, /color: `heading`/)
  assert.match(form, /'&::placeholder': \{[\s\S]*color: `text`/)
  assert.match(form, /'&:focus': \{[\s\S]*borderColor: `alpha`/)
  assert.match(form, /gridTemplateColumns: \[`1fr`, `minmax\(0, 1fr\) auto`\]/)
  assert.match(form, /minWidth: \[`100%`, `7\.5rem`\]/)
  assert.match(showcase, /aspectRatio: `1 \/ 1`/)
  assert.match(showcase, /borderRadius: \[`12px`, `16px`\]/)
  assert.match(showcase, /transform: `translateY\(-3px\)`/)
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
  const homepage = readSource(
    'site/src/@elegantstack/gatsby-theme-flexiblog-agency/containers/Posts.jsx'
  )
  const profileCard = readSource(
    'site/src/@elegantstack/flow-ui-widgets/BannerVertical/BannerVertical.jsx'
  )
  const stack = readSource('packages/flow-ui/flow-ui-layout/src/Stack/Stack.jsx')
  const portrait = path.resolve(
    __dirname,
    '..',
    'site/content/assets/bu-adam-kim.jpeg'
  )

  assert.equal(fs.existsSync(portrait), true)
  assert.match(stack, /contentSx/)
  assert.match(homepage, /direction='column'/)
  assert.match(
    homepage,
    /contentSx=\{\{[\s\S]*min-width: 1200px[\s\S]*flexDirection: `row`/
  )
  assert.match(
    profileCard,
    /import \{ StaticImage \} from 'gatsby-plugin-image'/
  )
  assert.match(
    profileCard,
    /src='\.\.\/\.\.\/\.\.\/\.\.\/content\/assets\/bu-adam-kim\.jpeg'/
  )
  assert.match(profileCard, /alt='İbrahim Uylaş doğa yürüyüşünde'/)
  assert.match(
    profileCard,
    /min-width: 768px\) and \(max-width: 1199px\)[\s\S]*flexDirection: `row`/
  )
  assert.match(profileCard, /flex: `0 0 42%`/)
  assert.match(profileCard, /width: `42%`/)
  assert.match(profileCard, /height: `360px`/)
  assert.match(profileCard, /objectFit: `cover`, objectPosition: `50% 38%`/)
  assert.doesNotMatch(profileCard, /FaMountain|Merhaba,/)
})
