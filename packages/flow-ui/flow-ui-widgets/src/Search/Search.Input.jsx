import React from 'react'
import { Box, Input, IconButton } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import styles from './Search.styles'

const customStyles = {
  notLoaded: {
    cursor: `pointer`,
    color: `transparent`
  }
}

const SearchInput = ({
  isLoaded,
  focus,
  loadSearch,
  loadSearchWithFocus,
  ...props
}) => (
  <>
    <IconButton
      sx={styles.mobileTrigger}
      onClick={loadSearchWithFocus || props.onFocus}
      aria-label='Search'
    >
      <FaSearch />
    </IconButton>
    <Box sx={styles.form({ focus })}>
      <FaSearch style={styles.searchIcon} />
      <Input
        css={!isLoaded && customStyles.notLoaded}
        sx={styles.input}
        type='text'
        placeholder='Discover news, articles and more...'
        aria-label='Search'
        onMouseEnter={loadSearch ? loadSearch : undefined}
        {...props}
      />
    </Box>
  </>
)

export default SearchInput
