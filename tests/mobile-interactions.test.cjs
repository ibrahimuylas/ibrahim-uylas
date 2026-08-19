const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const parser = require('@babel/parser')

const readSource = relativePath =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8')

const getObjectKey = node => {
  if (node?.type === 'StringLiteral') return node.value
  if (node?.type === 'Identifier') return node.name
  return null
}

const findUngatedHoverStyles = (
  node,
  file,
  ancestors = [],
  violations = []
) => {
  if (!node || typeof node !== 'object') return violations

  if (node.type === 'ObjectProperty' || node.type === 'ObjectMethod') {
    const key = getObjectKey(node.key)
    const nextAncestors = key ? [...ancestors, key] : ancestors

    if (
      key?.includes(':hover') &&
      !ancestors.some(
        ancestor =>
          ancestor.includes('(hover: hover)') &&
          ancestor.includes('(pointer: fine)')
      )
    ) {
      violations.push(`${file}:${node.loc.start.line}:${key}`)
    }

    for (const [property, value] of Object.entries(node)) {
      if (['key', 'loc', 'start', 'end'].includes(property)) continue

      if (Array.isArray(value)) {
        value.forEach(child =>
          findUngatedHoverStyles(child, file, nextAncestors, violations)
        )
      } else {
        findUngatedHoverStyles(value, file, nextAncestors, violations)
      }
    }

    return violations
  }

  for (const [property, value] of Object.entries(node)) {
    if (['loc', 'start', 'end'].includes(property)) continue

    if (Array.isArray(value)) {
      value.forEach(child =>
        findUngatedHoverStyles(child, file, ancestors, violations)
      )
    } else {
      findUngatedHoverStyles(value, file, ancestors, violations)
    }
  }

  return violations
}

const listJavaScriptFiles = relativeDirectory => {
  const directory = path.resolve(__dirname, '..', relativeDirectory)

  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.jsx?$/.test(entry.name))
    .map(entry =>
      path
        .join(entry.parentPath || entry.path, entry.name)
        .replace(`${path.resolve(__dirname, '..')}${path.sep}`, '')
    )
}

test('interactive hover styles are limited to hover-capable fine pointers', () => {
  const files = [
    ...listJavaScriptFiles('site/src'),
    ...listJavaScriptFiles('packages/flow-ui')
  ]
  const violations = files.flatMap(file => {
    const ast = parser.parse(readSource(file), {
      plugins: ['jsx'],
      sourceType: 'module'
    })

    return findUngatedHoverStyles(ast, file)
  })

  assert.deepEqual(violations, [])
})

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

test('mobile action dock uses a compact translucent surface without Safari artifacts', () => {
  const dock = readSource('site/src/components/MobileActionDock.jsx')
  const contents = readSource('site/src/components/ArticleContents.jsx')
  const search = readSource('site/src/components/BlogSearch.jsx')
  const scrollToTop = readSource('site/src/components/ScrollToTop.jsx')

  assert.doesNotMatch(dock, /(?:Webkit)?BackdropFilter/)
  assert.match(dock, /width: `max-content`/)
  assert.match(dock, /maxWidth: `calc\(100vw - 2rem\)`/)
  assert.match(dock, /minHeight: 56/)
  assert.match(dock, /px: 2/)
  assert.match(dock, /py: 1/)
  assert.match(dock, /borderWidth: 1/)
  assert.match(dock, /borderStyle: `solid`/)
  assert.match(dock, /borderColor: `rgba\(255, 255, 255, 0\.18\)`/)
  assert.match(dock, /borderRadius: `full`/)
  assert.match(dock, /bg: `rgba\(29, 37, 51, 0\.68\)`/)
  assert.match(dock, /location\?\.pathname && location\.pathname !== `\/`/)
  assert.match(
    dock,
    /showHomeAction[\s\S]*as=\{GatsbyLink\}[\s\S]*to='\/'[\s\S]*aria-label='Ana sayfaya dön'/
  )
  assert.match(dock, /<FaHome aria-hidden='true' focusable='false' \/>/)
  assert.match(
    dock,
    /boxShadow: `inset 0 1px 0 rgba\(255, 255, 255, 0\.14\)`/
  )
  assert.doesNotMatch(dock, /boxShadow: `0 [^`]+rgba\(0, 0, 0/)

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

test('desktop header centers search and reuses the mobile theme icon button', () => {
  const header = readSource(
    'site/src/@elegantstack/flow-ui-layout/Header/Header.jsx'
  )
  const colorMode = readSource(
    'packages/flow-ui/flow-ui-layout/src/Header/Header.ColorMode.jsx'
  )

  assert.match(header, /position: \[`static`, null, `absolute`\]/)
  assert.match(header, /left: \[`auto`, null, `50%`\]/)
  assert.match(header, /transform: \[`none`, null, `translate\(-50%, -50%\)`\]/)
  assert.match(header, /ml: \[0, null, `auto`\]/)
  assert.match(header, /mr: \[`auto`, null, 0\]/)
  assert.match(header, /width: \[`120px !important`, `150px !important`\]/)
  assert.doesNotMatch(colorMode, /rc-switch|<Switch/)
  assert.match(colorMode, /width: 48/)
  assert.match(colorMode, /height: 48/)
  assert.match(colorMode, /boxSizing: `border-box`/)
  assert.match(colorMode, /<FaMoon aria-hidden='true' focusable='false' \/>/)
  assert.match(colorMode, /<FaSun aria-hidden='true' focusable='false' \/>/)
})

test('article links use dark-mode contrast without changing global links', () => {
  const styles = readSource(
    'packages/flow-ui/flow-ui-theme/src/theme/styles.js'
  )
  const postBody = readSource(
    'site/src/@elegantstack/flow-ui-widgets/Post/Post.Body.jsx'
  )
  const [rootStyles] = styles.split('/** MDX articles */')

  assert.doesNotMatch(rootStyles, /\ba:\s*\{/)
  assert.match(
    postBody,
    /const ArticleLink = props => <Link \{\.\.\.props\} sx=\{articleLinkStyles\} \/>/
  )
  assert.match(
    postBody,
    /components=\{\{ \.\.\.components, DeferredEmbed, a: ArticleLink \}\}/
  )
  assert.match(postBody, /color: `alphaDark`/)
  assert.match(
    postBody,
    /':visited': \{[\s\S]*color: `alphaDark`/
  )
  assert.match(
    postBody,
    /':hover': \{[\s\S]*color: `alphaDarker`/
  )
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
