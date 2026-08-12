import React from 'react'
import { Box, Heading, Text } from 'theme-ui'
import { Layout, Stack, Main, Sidebar } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import BannerVertical from '@widgets/BannerVertical'
import { useBlogCategories } from '@helpers-blog'
import ArticleContents from '../../../components/ArticleContents'
import HomepageCategories from '../../../components/HomepageCategories'
import categoryColors from '../../../components/categoryColors'
import InstagramShowcase from '../../../components/InstagramShowcase'

const categoryDescriptions = {
  Kampçılık: 'Kamp hazırlığı, güvenlik ve temel kamp deneyimleri.',
  'Doğa Yürüyüşleri': 'Hiking, trekking, giyim ve yürüyüşe hazırlık.',
  Rotalar: 'Günübirlik parkurlar, kamp alanları ve uzun rota rehberleri.',
  Ekipmanlar: 'Çadır, ayakkabı, ocak ve outdoor ekipmanı seçimleri.',
  Diğer: 'Yol hikâyeleri, kişisel notlar ve farklı açık hava deneyimleri.'
}

const Posts = ({
  data: {
    posts = {},
    featuredPosts = {},
    recentPosts = {},
    homeOgImage = null
  },
  ...props
}) => {
  const { pageContext: { services = {} } = {} } = props
  let categories = useBlogCategories()
  const featuredSlugs = new Set(
    (featuredPosts.nodes || []).map(post => post.slug).filter(Boolean)
  )
  const withCategoryColors = nodes =>
    (nodes || []).map(post => {
      const categoryColor = categoryColors[post.category?.name]

      return categoryColor
        ? {
            ...post,
            category: {
              ...post.category,
              color: categoryColor
            },
            accentColor: categoryColor
          }
        : post
    })

  const featuredNodes = withCategoryColors(featuredPosts.nodes)
  const recentNodes = withCategoryColors(recentPosts.nodes)

  const sortedPostGroup = [
    'Kampçılık',
    'Doğa Yürüyüşleri',
    'Rotalar',
    'Ekipmanlar',
    'Diğer'
  ]
    .map(categoryName =>
      (posts.group || []).find(_ => _.categoryName === categoryName)
    )
    .filter(Boolean)
    .map(group => ({
      ...group,
      nodes: withCategoryColors(
        group.nodes.filter(post => !featuredSlugs.has(post.slug))
      )
    }))
    .filter(group => group.nodes.length > 0)

  const sortedCategories = [
    'Kampçılık',
    'Doğa Yürüyüşleri',
    'Rotalar',
    'Ekipmanlar',
    'Diğer'
  ]
    .map(categoryName => (categories || []).find(_ => _.name === categoryName))
    .filter(Boolean)
    .map(category => ({
      ...category,
      color: categoryColors[category.name] || category.color,
      description: categoryDescriptions[category.name]
    }))

  categories = sortedCategories

  const homeContentsItems = [
    { title: 'Öne çıkanlar ve son yazılar', url: '#one-cikanlar' },
    ...sortedPostGroup.filter(Boolean).map(group => ({
      title: group.categoryName,
      url: `#ana-${group.nodes[0].category.slug}`
    }))
  ]

  return (
    <Layout {...props}>
      <Seo
        title='Kampçılık, Doğa Yürüyüşü ve Rota Rehberleri'
        description='Kampçılık, doğa yürüyüşü, trekking, rota ve kamp ekipmanı rehberleri. Kişisel deneyimler, hazırlık notları ve yol hikâyeleri.'
        imageData={homeOgImage?.childImageSharp?.gatsbyImageData}
      />
      <Divider space={[3, 2]} />
      <Stack effectProps={{ effect: false }}>
        <Box sx={{ py: [2, 3], width: `100%`, maxWidth: `none` }}>
          <Heading as='h1' variant='h1'>
            Kampçılık, doğa yürüyüşü ve rota rehberleri
          </Heading>
          <Text sx={{ display: `block`, width: `100%` }}>
            Kamp hazırlığı, rota seçimi, ekipman kullanımı ve yol hikâyeleri;
            gerçek deneyimlerden süzülen pratik rehberler.
          </Text>
        </Box>
      </Stack>
      <Divider space={[3, 2]} />
      <Stack direction={['column']} effectProps={{ effect: false }}>
        <Heading
          as='h2'
          sx={{ fontSize: [4, 5], lineHeight: 1.2, mb: 3, mt: 0 }}
        >
          Doğaya çıkmaya buradan başla
        </Heading>
        <HomepageCategories
          categories={categories}
          variant='horizontal'
          omitTitle
        />
      </Stack>
      <Divider space={[4, 3]} />
      <ArticleContents items={homeContentsItems} showInlineNavigation={false} />
      <Box id='one-cikanlar' sx={{ scrollMarginTop: `24px` }}>
        <Stack
          direction={['column', 'column', 'column', 'row']}
          effectProps={{ effect: false }}
        >
          <Main>
            <CardList
              nodes={featuredNodes}
              limit={3}
              variant='horizontal-cover'
              slider
              fade
              controlPosition='over'
              loading='eager'
              accentColorByCategory={categoryColors}
              omitCategory
              omitAuthor
            />
            <Divider space={[3, 2]} />
            <CardList
              nodes={recentNodes}
              limit={4}
              columns={[1, 2]}
              variant='horizontal-aside'
              accentColorByCategory={categoryColors}
            />
          </Main>
          <Sidebar
            sx={{
              pl: [0, null, null, `3`],
              mt: [4, null, 4, 0],
              flexBasis: `1/4`
            }}
          >
            <BannerVertical />
          </Sidebar>
        </Stack>
      </Box>
      <Divider space={[5, 4]} />
      <Stack effectProps={{ effect: false }}>
        <InstagramShowcase showNewsletter={services.mailchimp} />
      </Stack>
      <Divider space={[5, 4]} />
      {sortedPostGroup.length > 0 &&
        sortedPostGroup.map((group, index) => (
          <Box
            key={`${group.categoryName}.list`}
            id={`ana-${group.nodes[0].category.slug}`}
            sx={{ scrollMarginTop: `24px` }}
          >
            {index % 2 === 0 ? (
              <Stack
                title={group.categoryName}
                titleLink={group.nodes[0].category.slug}
                titleColor={categoryColors[group.categoryName]}
              >
                <Main>
                  <CardList
                    nodes={group.nodes}
                    limit={3}
                    columns={[1, 1, 1, 3]}
                    variant={[
                      'horizontal-md',
                      'horizontal',
                      'horizontal',
                      'vertical'
                    ]}
                    accentColor={categoryColors[group.categoryName]}
                  />
                  <Divider space={[3, 2]} />
                  <CardList
                    nodes={group.nodes}
                    limit={3}
                    skip={3}
                    columns={[1, 2, 3, 3]}
                    variant={['horizontal-md', 'horizontal-aside']}
                    accentColor={categoryColors[group.categoryName]}
                    showMediaOnMobile
                    omitMedia
                  />
                </Main>
              </Stack>
            ) : (
              <Stack
                title={group.categoryName}
                titleLink={group.nodes[0].category.slug}
                titleColor={categoryColors[group.categoryName]}
                direction={['column', 'column', 'column', 'row']}
              >
                <Sidebar
                  sx={{
                    pl: 0,
                    pr: [0, null, null, 3],
                    display: [null, `flex`],
                    flexDirection: [`column`, null, null, `row`]
                  }}
                >
                  <CardList
                    nodes={group.nodes}
                    limit={1}
                    columns={[1]}
                    variant={[
                      'horizontal-md',
                      'horizontal',
                      'horizontal',
                      'vertical'
                    ]}
                    accentColor={categoryColors[group.categoryName]}
                    omitCategory
                  />
                </Sidebar>
                <Main
                  sx={{
                    display: [null, `flex`],
                    flexDirection: [`column`, null, null, `row`]
                  }}
                >
                  <Divider space={[3, 2]} />
                  <CardList
                    nodes={group.nodes}
                    limit={group.nodes.length === 4 ? 2 : 3}
                    skip={1}
                    columns={[1, 1, 3, 1]}
                    variant={[
                      'horizontal-md',
                      'horizontal-md',
                      'horizontal-aside'
                    ]}
                    mediaType='icon'
                    mobileMediaType='image'
                    thumbnailText={null}
                    accentColor={categoryColors[group.categoryName]}
                    omitCategory
                  />
                  <Divider space={[3, 2]} />
                </Main>
                {group.nodes.length >= 4 && (
                  <Sidebar
                    sx={{
                      pl: [0, null, null, 3],
                      display: [null, `flex`],
                      flexDirection: [`column`, null, null, `row`]
                    }}
                  >
                    <CardList
                      nodes={group.nodes}
                      limit={1}
                      skip={group.nodes.length === 4 ? 3 : 4}
                      columns={[1]}
                      variant={[
                        'horizontal-md',
                        'horizontal',
                        'horizontal',
                        'vertical'
                      ]}
                      accentColor={categoryColors[group.categoryName]}
                      omitCategory
                    />
                  </Sidebar>
                )}
              </Stack>
            )}
            {index !== sortedPostGroup.length - 1 && <Divider space={[5, 4]} />}
          </Box>
        ))}
    </Layout>
  )
}

export default Posts
