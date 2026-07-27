import React from 'react'
import { Layout, Stack, Main, Sidebar } from '@layout'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'
import Categories from '@widgets/Categories'
import NewsletterExpanded from '@widgets/NewsletterExpanded'
import BannerVertical from '@widgets/BannerVertical'
import { useBlogCategories } from '@helpers-blog'
import InstagramShowcase from '../../../components/InstagramShowcase'

const Posts = ({
  data: { posts = {}, featuredPosts = {}, recentPosts = {} },
  ...props
}) => {
  const { pageContext: { services = {} } = {} } = props
  let categories = useBlogCategories()

  let sortedPostGroup = []
  sortedPostGroup.push(posts.group.find(_ => _.categoryName === 'Kampçılık'))
  sortedPostGroup.push(
    posts.group.find(_ => _.categoryName === 'Doğa Yürüyüşleri')
  )
  sortedPostGroup.push(posts.group.find(_ => _.categoryName === 'Rotalar'))
  sortedPostGroup.push(posts.group.find(_ => _.categoryName === 'Ekipmanlar'))
  sortedPostGroup.push(posts.group.find(_ => _.categoryName === 'Diğer'))

  posts.group = sortedPostGroup

  let sortedCategories = []
  sortedCategories.push(categories.find(_ => _.name === 'Kampçılık'))
  sortedCategories.push(categories.find(_ => _.name === 'Doğa Yürüyüşleri'))
  sortedCategories.push(categories.find(_ => _.name === 'Rotalar'))
  sortedCategories.push(categories.find(_ => _.name === 'Ekipmanlar'))
  sortedCategories.push(categories.find(_ => _.name === 'Diğer'))

  categories = sortedCategories

  return (
    <Layout {...props}>
      <Seo title='Ana Sayfa' />
      <Divider />
      <Stack effectProps={{ effect: false }}>
        <Categories categories={categories} variant='horizontal' omitTitle />
      </Stack>
      <Divider />
      <Stack effectProps={{ effect: false }}>
        <Main>
          <CardList
            nodes={featuredPosts.nodes}
            limit={3}
            variant='horizontal-cover'
            slider
            fade
            controlPosition='over'
            loading='eager'
            omitCategory
          />
          <Divider space={2} />
          <CardList
            nodes={recentPosts.nodes}
            limit={4}
            columns={[1, 2]}
            variant='horizontal-aside'
          />
        </Main>
        <Sidebar sx={{ pl: `3`, flexBasis: `1/4` }}>
          <BannerVertical />
        </Sidebar>
      </Stack>
      <Stack>
        <Main>
          {services.mailchimp && (
            <>
              <Divider space={4} />
              <NewsletterExpanded />
            </>
          )}
        </Main>
      </Stack>
      <Divider space={4} />
      {posts.group.length &&
        posts.group.map((group, index) => (
          <React.Fragment key={`${group.categoryName}.list`}>
            {index % 2 === 0 ? (
              <Stack
                title={group.categoryName}
                titleLink={group.nodes[0].category.slug}
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
                  />
                  <Divider space={2} />
                  <CardList
                    nodes={group.nodes}
                    limit={3}
                    skip={3}
                    columns={[1, 2, 3, 3]}
                    variant={['horizontal-md', 'horizontal-aside']}
                    omitMedia
                  />
                </Main>
              </Stack>
            ) : (
              <Stack
                title={group.categoryName}
                titleLink={group.nodes[0].category.slug}
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
                    omitCategory
                  />
                </Sidebar>
                <Main
                  sx={{
                    display: [null, `flex`],
                    flexDirection: [`column`, null, null, `row`]
                  }}
                >
                  <Divider space={2} />
                  <CardList
                    nodes={group.nodes}
                    limit={3}
                    skip={1}
                    columns={[1, 1, 3, 1]}
                    variant={[
                      'horizontal-md',
                      'horizontal-md',
                      'horizontal-aside'
                    ]}
                    mediaType='icon'
                    omitCategory
                  />
                  <Divider space={2} />
                </Main>
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
                    skip={4}
                    columns={[1]}
                    variant={[
                      'horizontal-md',
                      'horizontal',
                      'horizontal',
                      'vertical'
                    ]}
                    omitCategory
                  />
                </Sidebar>
              </Stack>
            )}
            {index === 0 && (
              <>
                <Divider />
                <Stack effectProps={{ effect: false }}>
                  <InstagramShowcase />
                </Stack>
              </>
            )}
            {index !== posts.group.length - 1 && <Divider />}
          </React.Fragment>
        ))}
    </Layout>
  )
}

export default Posts
