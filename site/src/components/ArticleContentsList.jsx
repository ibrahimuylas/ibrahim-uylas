import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Link } from 'theme-ui'

const itemType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
})

const ArticleContentsList = ({ items, onItemClick }) => (
  <Grid as='ol' columns={[1, 2]} gap={2} sx={{ my: 0, pl: 4 }}>
    {items.map(item => (
      <Box as='li' key={item.url} sx={{ pr: 2 }}>
        <Link
          href={item.url}
          onClick={onItemClick ? event => onItemClick(event, item) : undefined}
        >
          {item.title}
        </Link>
      </Box>
    ))}
  </Grid>
)

ArticleContentsList.propTypes = {
  items: PropTypes.arrayOf(itemType).isRequired,
  onItemClick: PropTypes.func
}

export { itemType }
export default ArticleContentsList
