import React from 'react'
import PropTypes from 'prop-types'
import { Box, Grid, Link } from 'theme-ui'

const itemType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
})

const ArticleContentsList = ({ columns = [1, 2], items, onItemClick }) => (
  <Grid
    as='ol'
    columns={columns}
    sx={{
      columnGap: 4,
      rowGap: 2,
      my: 0,
      pl: 4
    }}
  >
    {items.map(item => (
      <Box
        as='li'
        key={item.url}
        sx={{
          minWidth: 0,
          pr: 2,
          overflowWrap: `anywhere`
        }}
      >
        <Link
          href={item.url}
          onClick={onItemClick ? event => onItemClick(event, item) : undefined}
          sx={{
            overflowWrap: `anywhere`,
            wordBreak: `break-word`
          }}
        >
          {item.title}
        </Link>
      </Box>
    ))}
  </Grid>
)

ArticleContentsList.propTypes = {
  columns: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  items: PropTypes.arrayOf(itemType).isRequired,
  onItemClick: PropTypes.func
}

export { itemType }
export default ArticleContentsList
