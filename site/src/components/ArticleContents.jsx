import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Heading, Link } from 'theme-ui'

const ArticleContents = ({ items }) => {
  if (!items || items.length < 2) return null

  return (
    <Box
      as='nav'
      aria-label='İçindekiler'
      sx={{
        bg: 'omegaLighter',
        borderRadius: 'default',
        mb: 4,
        px: [3, 4],
        py: 3
      }}
    >
      <Heading as='h2' variant='h4' sx={{ mb: 3 }}>
        Bu yazıda
      </Heading>
      <Grid as='ol' columns={[1, 2]} gap={2} sx={{ my: 0, pl: 4 }}>
        {items.map(item => (
          <Box as='li' key={item.url} sx={{ pr: 2 }}>
            <Link href={item.url}>{item.title}</Link>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

ArticleContents.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  )
}

export default ArticleContents
