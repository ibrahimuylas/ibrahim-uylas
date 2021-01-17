import React, { useContext } from 'react'
import pageContextProvider from '@helpers/pageContextProvider'
import { Stack, Main, PreFooter } from '@layout'
import PageTitle from '@components/PageTitle'
import Pagination from '@components/Pagination'
import CardList from '@components/CardList'
import Divider from '@components/Divider'
import Seo from '@widgets/Seo'

const Collection = ({ data: { posts, collectionInfo } }) => {
  const context = useContext(pageContextProvider)

  return (
    <>
      <Seo title={collectionInfo.name} />
      <Divider />
      <Stack effectProps={{ effect: 'fadeInDown' }}>
        <PageTitle
          header={collectionInfo.name}
          subheader={collectionInfo.title}
          running={collectionInfo.description}
          totalCount={posts.totalCount}
        />
      </Stack>
      <Divider />
      <Stack>
        <Main>
          {posts.nodes && (
            <CardList
              nodes={posts.nodes}
              variant={['horizontal-md', 'vertical']}
              columns={[1, 2, 3, 3]}
              omitCategory={
                context.pageContext &&
                context.pageContext.collectionType === 'category'
              }
            />
          )}
        </Main>
      </Stack>
      <Divider />
      <PreFooter>
        <Pagination {...posts.pageInfo} {...collectionInfo} />
      </PreFooter>
    </>
  )
}
export default Collection
