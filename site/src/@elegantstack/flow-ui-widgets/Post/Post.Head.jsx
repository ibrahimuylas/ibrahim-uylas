import React from 'react'
import { Link as GLink } from 'gatsby'
import { Link, Text } from 'theme-ui'
import TextList from '@components/TextList'
import PageTitle from '@components/PageTitle'

const styles = {
  item: {
    display: `inline-block`
  }
}

export const PostHead = ({
  title,
  author,
  date,
  modified,
  timeToRead,
  category
}) => {
  const info = (
    <TextList>
      {author && author.slug && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`Yazan `}
          <Link variant='mute' as={GLink} to={author.slug}>
            <strong>{author.name}</strong>
          </Link>
        </Text>
      )}
      {category && category.slug && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`Kategori `}
          <Link variant='mute' as={GLink} to={category.slug}>
            <strong data-pagefind-meta='category'>{category.name}</strong>
          </Link>
        </Text>
      )}
      {date && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`Yayımlandı: ${date}`}
        </Text>
      )}
      {modified && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`Güncellendi: ${modified}`}
        </Text>
      )}
      {timeToRead && (
        <Text
          data-pagefind-ignore='index'
          sx={{ ...styles.item, color: `error` }}
        >
          <strong>{timeToRead} dk</strong>
        </Text>
      )}
    </TextList>
  )

  const heading = <span data-pagefind-meta='title'>{title}</span>

  return <PageTitle header={heading} running={info} />
}
