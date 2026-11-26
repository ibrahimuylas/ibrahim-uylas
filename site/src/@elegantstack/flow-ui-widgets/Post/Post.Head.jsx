import React from 'react'
import { Text } from 'theme-ui'
import TextList from '@components/TextList'
import PageTitle from '@components/PageTitle'
import LocaleLink from '../../../i18n/LocaleLink'
import { copy } from '../../../i18n/copy'

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
  category,
  language = 'tr'
}) => {
  const labels = copy[language]
  const info = (
    <TextList>
      {author && author.slug && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`${labels.author} `}
          <LocaleLink variant='mute' to={author.slug} language={language}>
            <strong>{author.name}</strong>
          </LocaleLink>
        </Text>
      )}
      {category && category.slug && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`${labels.category} `}
          <LocaleLink variant='mute' to={category.slug} language={language}>
            <strong data-pagefind-meta='category'>{category.name}</strong>
          </LocaleLink>
        </Text>
      )}
      {date && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`${labels.published}: ${date}`}
        </Text>
      )}
      {modified && (
        <Text data-pagefind-ignore='index' sx={styles.item}>
          {`${labels.updated}: ${modified}`}
        </Text>
      )}
      {timeToRead && (
        <Text
          data-pagefind-ignore='index'
          sx={{ ...styles.item, color: `error` }}
        >
          <strong>{labels.minutes(timeToRead)}</strong>
        </Text>
      )}
    </TextList>
  )

  const heading = <span data-pagefind-meta='title'>{title}</span>

  return <PageTitle header={heading} running={info} />
}
