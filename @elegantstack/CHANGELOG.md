# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.9.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.8.0...v2.9.0) (2020-12-31)


### Features

* **core-blog:** add Strapi CMS support ([2761a9f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2761a9f331cfc719530ed3e051ba80cbeee2d1e5))


### Bug Fixes

* **core-blog:** include link property when indexing posts in algolia ([4b21d13](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4b21d13f3e4e388c968b70260de62d4faa952cbd))
* **core-blog:** prevent algolia to index private posts ([16951a2](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/16951a2f6dbaa7c0a7fba2af86307af18164ba18))


### Refactor

* **flow-ui-components:** improve styling of MDX headings ([8abe4a5](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/8abe4a573cb53d0fc7861f5e0d41e18287e45345))
* **gatsby-plugin-proxy-schema:** avoid overwriting cache and skip undefined typeDefsFallback ([c87bc33](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c87bc33d70d3bd37d421ef957bd331419df3bfef))




## [2.8.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.7.0...v2.8.0) (2020-12-15)


### Features

* add Article and Breadcrumb structured data (JSON-LD) ([d9f1347](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/d9f1347fbffd887affd3edd95b628edb3bb878b6))
* add fallback component for MDX CodeBlock ([eca12ee](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/eca12eea4049297a8a8603217a4407ac542eb51d))
* add Netlify CMS support ([e1583dd](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e1583dd43e76d0686f119ee6737accfde8cb2f16))
* Improve accessibility of header mobile buttons ([efcf565](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/efcf5653ee988ef1f9405845142e86f30e7545b5))


### Refactor

* change bg color of inline code in MDX ([b6f55c8](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/b6f55c8522bd66927f25d0b097fe951442c1b0b9))
* change Code Block default prism theme ([e273618](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e2736187993777f7cc619022e907283e3981417d))
* change how global styles are loaded ([92c076d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/92c076dd000bbd9557a70e16b0278e0aa05864fe))
* improve styling of MDX heading components ([be64917](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/be6491731614ef90b166f5d321180e6f4151e793))
* make minor adjustments to code block styling ([79f3014](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/79f30143e212d0572a4d05e381fac17858dc4533))
* modify styling of code blocks after heading ([7b0ccbe](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/7b0ccbe86e73e665c37f90f600bde547396d1a19))
* remove husky hooks ([5921681](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/592168137094d6ab91bb409f09eeacb0216d6153))
* remove unnecessary ci:build scripts from package.json files ([96ad28f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/96ad28f735145b1d75d13ab3c5eb69387236888d))
* remove unnecessary peerDependencies from plugins ([97adf0a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/97adf0afe8ccc8b19c774ae9cc2d0894f7b42779))
* remove unused theme/components file ([72781e1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/72781e18ea6ae327d39e1f6fd20aa7728d1314fe))
* update yarn.lock file ([410450a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/410450a1bf43c9d1a439266acefdd1057598962b))
* upgrade external dependency packages ([dcf1114](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/dcf1114436cb0f09f029dd4aed6d8a18715ef5a2))




# [2.7.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.6.2...v2.7.0) (2020-12-05)


### Bug Fixes

* fix invalid date in starter sample posts ([daa81db](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/daa81db1d901f7004bc218796e09fde76e8e5448))
* set PageTitle component default heading tag to h1 ([365afba](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/365afba1e2ac030d8bddf1180bd47bd2df3a7ca5))


### Features

* add ability to enable/disable dark mode from theme options ([366ad91](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/366ad911e950c05edc37cba88ab59f5073690c2f))
* add Theme-ui initialColorModeName file for shadowing ([9678958](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/96789580ef79f833edf447d879ec6393a8775dfa))
* increase Contentful default image quality ([f928840](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/f928840d890902de7a9c10e8f4a29da5129cdc4d))
* upgrade theme-ui and gatsby-plugin-theme-ui packages ([59e2401](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/59e2401727f3a2f2a06fb7cd66890ec151aaf658))






## [2.6.2](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.6.1...v2.6.2) (2020-10-24)


### Bug Fixes

* fix react warning for case style for button common styles ([07519d8](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/07519d8e3cef3e2ad994a0873944a5072cddda81))
* fix React warning from gatsby-image in Card Image ([e0cd1b2](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e0cd1b207579dff28b3e0a01dd8cf97f6fb1bd3a))
* fix search button functionality on Safari iOS ([2d0f514](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2d0f514cc154772001868e202f81f3e3cbe053cc))






## [2.6.1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.6.0...v2.6.1) (2020-10-03)


### Bug Fixes

* disable user-select (highlighting) from all buttons ([259bd8a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/259bd8afe49c75da605b0711e6b3b0b6a1e8ad09))
* fix issue with color mode button in mobile ([beb35ae](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/beb35aee90105037ac99526db7c75bdc5cab8fbf))





# [2.6.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.5.0...v2.6.0) (2020-10-03)


### Bug Fixes

* fix post body not revealing in post pages for smaller screens ([2521026](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2521026bb2002f496c75ae3b1438e94c33ee97e0))


### Features

* add search lazy-loading fallback in header for mobile ([780ddd4](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/780ddd4fcfd15fe37b3877d66de978c2c9603708))
* put all Reveal related props in Stack component under effectProps ([346ac29](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/346ac29d10d2d88687c2a205dea3b390fcf55a40))
* remove prop type checking in Reveal component and pass all props to react-reveal ([2edce39](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2edce3961f0e83b0c4c861e5f68290c7e9ffcc5b))
* rework color mode button styles in mobile ([d6d4ce1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/d6d4ce154598fd66b62b13a6bc707dcf1e0a2a5d))





# [2.5.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.4.0...v2.5.0) (2020-10-02)


### Bug Fixes

* adjust font overrides in themes to use correct google font urls ([a5f413c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/a5f413cebdfd4279845c19ced807b06d93b9ae2d))
* change single quote to backtick in Card.Media Image styles ([1f27e1f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/1f27e1fd9d4ad28812eb84effa7ca3bdc072f850))


### Features

* add dark color mode to theme colors ([3fa1b88](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/3fa1b8871b4671e66e83fe7932acca6c4ace4cae))
* add dark version of logo to starters ([c2428f7](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c2428f708fef251d19b71dd72af8cf91044916df))
* add Header.ColorMode component to Header component ([197fce6](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/197fce6134b7ad6b1d796b0b98fe05a8d0aac69f))
* add logo swapping based on color mode ([d84b50f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/d84b50f7dd9904a9d257872f40e14de19a658643))
* add rc-switch module to flow-ui-layout for dark mode ([db3e13c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/db3e13c5c0921a90f6d4e83ba7ace0ed9fe9e638))
* add wide and full props to Post.Image component ([b31d265](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/b31d2652728386888b3a757654fe299dd8aa8a73))
* add wide prop to science theme post image ([44d6e3b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/44d6e3b2e24beb093622cb0045a1031fb519c902))
* adjust AuthorExpanded component for dark mode ([ee7ceea](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/ee7ceea227ab7db6c354417fa57584b231e3d9de))
* adjust BannerVertical component for dark mode ([c4dca82](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c4dca82ea9ec6ad58ad697fe4ff995aa5eeed18e))
* adjust beauty theme Posts component for dark mode ([bf9d820](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/bf9d820fd68fcec0b1e268cc8630cf064b8ff920))
* adjust button variants for dark mode ([5f6e457](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/5f6e45718b4fa6794687804277e0ffc326265166))
* adjust card variants for dark mode ([9bcfe4a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9bcfe4a66168c928e80048c80ea4aa768dcba242))
* adjust Drawer component for dark mode ([10745a9](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/10745a97b46a2fb91925e21881b3df2795935891))
* adjust form variants for dark mode ([ede8de7](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/ede8de77e3ee9ff3da8102ae280282d3109a4f10))
* adjust markdown styles for dark mode ([71ed329](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/71ed3298ab2bbf191adf6ff3d89c4639da01d133))
* adjust minimal-v2 color overrides for dark mode ([a9e6ac5](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/a9e6ac5a5854ca03cb266c8c3dbae801aa7ff502))
* adjust minimal-v2 theme Hero for dark mode ([06f89f4](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/06f89f4c4da0a857a7f9d832125a9edb54e3c3ee))
* adjust minimal-v2 theme Posts component for dark mode ([c53b332](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c53b3325a6907d0aaf1c129bf34024a9742f947a))
* adjust Pagination component for dark mode ([71b220f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/71b220f316e07aa553097b4b59318246795c3127))
* adjust Post.Footer component for dark mode ([bc95c17](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/bc95c172db44cd0b7e3b1de6c122017250c7058f))
* adjust science theme Posts component for dark mode ([ca62eea](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/ca62eeae4345cef7d924a92882361ae3e3851457))
* adjust Search for dark mode ([df2d45d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/df2d45da199c3b83ff1c77637588a44e01c20747))
* adjust Stats component for dark mode ([42c787d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/42c787dc4a8ff7748669e351948bc8e34335a790))
* change default font from Muli to Inter ([f15bc0f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/f15bc0f78daefb15cea5894776b9ad30e239daaa))
* create Header.ColorMode component ([4fe390a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4fe390ab1e86f38f10bb84171dc900ceb961586a))






# [2.4.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.3.1...v2.4.0) (2020-09-26)


### Bug Fixes

* add strict option to slugify in makeSlug directive ([84b0d78](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/84b0d78bc0d8b17a9264e75a0dbbb39d53553c94))
* fix invisible post body in minimal theme in smaller phones ([1aed03c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/1aed03c72aae86bd5a42e13d920ed600d98e8477))
* Fix social sharing image previews for Contentful and Sanity posts ([b624617](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/b624617a8418f549bde65d24f1303bb115a98ff3))
* Remove unnecessary slufigy module form core-blog package ([97110b5](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/97110b590aee44d0432f880a32c4ea198471a738))
* remove unused author from beauty theme starter ([19e9604](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/19e960432821987e58bf2ba6c34280bacdce9b0a))
* Remove unused sitePaths from gatsby-plugin-proxy-schema default options ([1f25d9b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/1f25d9b55329de25c464c0dd227f2202a37af9da))


### Features

* Remove helpers-blog dependency from flow-ui-layout and pass mobile menu to header via context ([476a37c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/476a37c6aeaf9b7d3b873d13d0b598fb8eff0bc2))
* upgrade slugify module in gatsby-plugin-utility-directives package ([4a9491d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4a9491d4261f166f9758f00d5b15cdbed13e5325))






## [2.3.1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.3.0...v2.3.1) (2020-08-20)


### Bug Fixes

* Fix missing page for contentful collection nodes ([f210d2d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/f210d2dcdd30da49154fa8134b3c891b7de25143))
* Fix primary button hover text color ([a02aea5](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/a02aea53f60320017dc8a457936ce71a0fc39b8d))






# [2.3.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.2.3...v2.3.0) (2020-08-06)


### Bug Fixes

* Add missing flow-ui-components package to all themes gatsby-config file to fix component shadowing of flow-ui-components. ([faf3276](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/faf32760fc0102ddc98eb56a51b0733f78754cc4))
* change sources.mdx to sources.local in default options ([db4db98](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/db4db9870557e93409d4104bf1411f70387f877b))
* fix images in Sanity blog posts causing build error ([cce94ea](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/cce94ea0c6cb3b4f63ec2924428bfbb3965e59cf))
* fix previous link in pagination for paginated homepages ([8213f19](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/8213f194d4068a1194c17e6b7de1a2fa76cab48b))
* move lerna --conventional-commit flag from package.json to lerna.json ([4277281](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4277281faa46624c696484e449ea6aded2552dc6))
* separate content/assets from themeOptions.localPaths ([6d5d8b1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/6d5d8b152c7f188a84d914f2ec8eeaa38deef72f))
* upgrade peerDeps to v2 for internal packages ([efb6b0a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/efb6b0a99d1109b69b93d45a97327d7886199b69))


### Features

* Add Open Graph Image to post pages for social sharing ([3ee2e05](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/3ee2e05369f2722c6e44a442099a3fa82944e845))
* add siteUrl to theme options for Open Graph images ([6b3354f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/6b3354fda976ad72c4e6384832be3f8e220b753d))
* Increase personal theme homepage limit to 10 posts per page ([4939d2b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4939d2b3b8b57b3564cd66b099a1947a136d5127))






## [2.2.2](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.2.1...v2.2.2) (2020-08-02)


### Bug Fixes

* fix paging in paginated homepages ([3299fd6](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/3299fd6a42de9f2151fcbf2900113723935ff847))





## [2.2.1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.2.0...v2.2.1) (2020-08-01)


### Bug Fixes

* catch error in logo component if default logo file is removed ([fb5bae0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/fb5bae08a9cfe2d415ebe8844f9e87ab9f454364))
* ignore eslint warnings for drawer and search useEffect hooks ([bbd0b3a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/bbd0b3a21c6ea87db1dfe138a02c0d2e7d4b76a3))





# [2.2.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.1.0...v2.2.0) (2020-07-28)


### Bug Fixes

* close mobile menu drawer when an a menu item is clicked ([4b4d242](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/4b4d242b642824a101e22529ef2c3ecf44535591))
* fix sorting of posts by date ([ccc21e9](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/ccc21e956a67c3901cbef26d802e9846db5ccb39))
* remove handleTitleClick from Card component ([fc2d301](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/fc2d3019722bd1c28df972f80be4c80dd7fc9522))
* use pageContext state key to close search when a search result item is clicked ([14eb69f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/14eb69fd293eb4e825af74f64e4d3801ca156a43))
* webkit style was not using kebab-case ([3ac325c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/3ac325cbd7839aef539a91a9b1508e39f4b22233))






# [2.1.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v2.0.0...v2.1.0) (2020-07-27)


### Bug Fixes

* Close search box when an item is clicked ([e09cbb7](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e09cbb7a0133e87df5e82b02a533c8839328f450))


### Features

* add handleLinkClick prop to card to trigger functions when link in card is clicked ([a1974b1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/a1974b184bb0c5028213aa81904d2a03f4623c9b))





# [2.0.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v1.2.0...v2.0.0) (2020-07-26)


### Bug Fixes

* Author description in Contentful was not resolving correctly ([9c8f30d](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9c8f30db8b1cbade3fa961683a385de8abef0afd))
* decouple components folder from packages/theme-ui ([9fba1e6](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9fba1e6d2cd9c886b0e032b32044077114dc2edc))
* Fix pagination extra slashes for collections in Pagination.jsx ([d7d6dec](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/d7d6dec5a4e30f1878b342c8d8331e45ce471104))
* Fix react console error for keys in Footer.Menu.jsx ([a1fb59a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/a1fb59a6e8637f8fd61ad44de7a9c4fdf0f15c67))
* Fix react console error for prop-type in Card.jsx ([2a88567](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2a88567c48471224ec86ec8f149fd369c3a6e662))
* Fix react console error for prop-type in PageTitle.jsx ([8976249](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/89762494c0f1dc0f458eec69532668da32d2702b))
* fix react console errors for :nth-child in styles.js ([547f28c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/547f28c248c85357e1f1b1e95f15482232bf11e5))
* Fix react error for keys in AuthorExpanded.jsx ([76e8b85](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/76e8b85b6b76df4db54d3a50a0c18c4532496340))
* modify [@components](https://gitlab.com/components) alias with new path ([086e1d4](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/086e1d4f930dcad4c33a170c8ef4bd5cc6e9285b))
* remove gastby-config.js from decoupled components package ([01ee82a](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/01ee82a68514b7d69102360b39e2ae73306a3d24))


### Features

* add new packages to workspaces ([f7e16ae](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/f7e16aea09a288a745935dd5d80a20b19cd46f0d))
* Change all starters package name to comply with gatsby naming convention ([e1f5a0b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e1f5a0bbb746a8b2ef56c1d2329df1f195158ead))
* Change all theme names to comply with gatsby naming convention ([d437e10](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/d437e10b195e516958e0aca9c8706438fb7ea02c))
* Change all theme names to comply with gatsby naming convention ([e91dfd1](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e91dfd1529f1402d857923b741325ec41157162e))
* change widgets package name and remove dependency of blog helpers ([59618ff](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/59618ffe269b82f839f8973d0fae1814c0160905))
* decouple algolia query from core-blog ([85f8cfb](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/85f8cfbf4c1cbdf84fc270a5b14151843b765445))
* decouple blog pages and change package name ([f2666b9](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/f2666b92908481b6e4790425240f62c10335506f))
* decouple components and theme and change package names ([c562a83](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c562a832bae0cb650abeea4367c645ff9dc1dcdf))
* decouple general functionalities from core and move them to plugins ([eaffbbf](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/eaffbbfe74e4f4a4064c67368e09886c73b6e8a7))
* decouple general functionalities from core and move to gatsby plugins with gatsby naming convention ([c92ac94](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/c92ac948f988507c61db94bcfa1622daf9a25e3a))
* decouple helpers and layout and change package names ([9562395](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9562395ffe1f57593859b4e72598acd33bea35db))
* decouple layout package and change package name ([9fa2550](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9fa2550ee8342013470d85005992fbe4d162ab5e))
* simplify Code blocks in mdx and remove mdx-utils ([b21ecfb](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/b21ecfb3373021108a8d6e5829967b3e753778ee))
* update dependencies in yarn.lock ([65b9e96](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/65b9e964ce3e0f71334668df5aff89cd7c3c4fee))
* upgrade dependencies in package files ([9391fad](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/9391fad0a525f7a8514ab722831eff9a2eae8e04))





# [1.2.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v1.1.0...v1.2.0) (2020-07-14)


### Bug Fixes

* Add missing fields to Contentful content model ([1dda1f4](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/1dda1f4d3f861fb037df65ff4fc2f702a276d0f1))
* Create schema types only when an article of the type is available ([adb3a94](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/adb3a94d34531574ca2fb4ff9cc3ffe2f18d5dac))
* Include path prefixes in user defined slugs ([e31144b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/e31144b313acc93ac10d0c59a00d51e4e72f26e8))
* Prevent article thumbnailText to render when image is present ([1ebea19](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/1ebea1951bf3fbe51c46803143c640d0e5a08a8e))


### Features

* Add support for Sanity CMS (sanity.io) for creating blog posts ([5f9e83f](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/5f9e83f7f1d94cb9a896d191868572e17b9b9a9e))
* Calculate image aspectRatio when source does not provide it ([463a34b](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/463a34b0d7a014818332a7d9d1020dbd94394fea))
* Port schema types to new sourcing system ([5edc16c](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/5edc16ce883bfdc3b3df16006d647527d45c5e07))
* Refactor semantic schema sourcing strategy from cloning/modifying nodes to proxying for cache optimization and more flexibility ([2479f2e](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2479f2e60030fb8087e4c0cd47f1c689cc530d6b))
* Unified GraphQL ArticleCategory.icon from all sources ([59fad09](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/59fad09fd8763080bcaa12afe1ae3a0d9294bea2))






# [1.1.0](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/compare/v1.0.0...v1.1.0) (2020-07-06)


### Features

* allow overriding background of header and footer in theme colors ([16944ea](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/16944eada2d96f8ff6a315af68cc3f172a1de156))
* new theme theme-minimal-v2 with starter ([2607eb3](https://gitlab.com/alimoosavi15/gatsby-theme-flexiblog/commit/2607eb3f0d8406322cde7b9258730bea48ca74b8))
