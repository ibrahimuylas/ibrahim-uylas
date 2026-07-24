import React from 'react'
import groupArray from 'group-array'
import {
  Highlight,
  Snippet,
  PoweredBy,
  useInstantSearch
} from 'react-instantsearch'
import { Heading, Box, Spinner } from 'theme-ui'
import Card from '@components/Card'
import useScrollDisabler from '@components/useScrollDisabler'
import styles from './Search.styles'

const Hits = () => {
  useScrollDisabler()
  const { indexUiState, results: searchResults, status } = useInstantSearch()
  const query = indexUiState.query

  if (!searchResults || !query) {
    return 'What are you looking for?'
  }

  if (status === 'loading' || status === 'stalled') {
    //Waiting for search request to return results from server
    return <Spinner strokeWidth={2} duration={700} sx={styles.spinner} />
  }

  if (searchResults && searchResults.nbHits < 1) {
    return `No results for '${searchResults.query}'`
  } else {
    const hitsByCategory = groupArray(searchResults.hits, 'category.name')
    const categories = Object.keys(hitsByCategory)

    return categories.map(name => (
      <Box
        variant='lists.cards.fixed.search'
        sx={styles.hitGroup}
        key={`search-${name}`}
      >
        <Heading variant='h4'>{name}</Heading>
        {hitsByCategory[name].map(hit => {
          const node = {
            ...hit,
            key: hit.objectID,
            title: <Highlight hit={hit} tagName='mark' attribute='title' />,
            excerpt: <Snippet hit={hit} tagName='mark' attribute='excerpt' />
          }
          return (
            <Card
              variant='search'
              {...node}
              omitCategory
              omitFooter
              omitMedia
            />
          )
        })}
      </Box>
    ))
  }
}

const Results = () => (
  <Box sx={styles.resultsWrapper}>
    <Box sx={styles.hitsWrapper}>
      <Hits />
    </Box>
    <Box sx={styles.poweredBy}>
      <PoweredBy />
    </Box>
  </Box>
)

export default Results
