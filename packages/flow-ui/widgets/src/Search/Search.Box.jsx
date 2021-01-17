import React, { useEffect, useState, useCallback } from 'react'
import { connectSearchBox, PoweredBy } from 'react-instantsearch-dom'
import { Box, Input, IconButton } from 'theme-ui'
import { FaSearch } from 'react-icons/fa'
import useDebounce from '@components/useDebounce'
import styles from './Search.styles'

const SearchBox = ({
  refine,
  delay,
  focus,
  handleFocus,
  handleClose,
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchCharacters = useCallback(
    searchTerm => {
      refine(searchTerm)
    },
    [refine]
  )

  // Effect for API call
  useEffect(() => {
    if (debouncedSearchTerm) {
      searchCharacters(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, searchCharacters])

  const handleEsc = e => {
    //close on esc keypress
    if (e.keyCode === 27) {
      e.currentTarget.blur()
      handleClose()
    }
  }

  return (
    <>
      <IconButton
        sx={styles.mobileTrigger}
        onTouchStart={handleFocus}
        aria-label='Search'
      >
        <FaSearch />
      </IconButton>
      <Box
        sx={styles.form({
          focus
        })}
      >
        <FaSearch style={styles.searchIcon} />
        <Input
          sx={styles.input}
          type='text'
          placeholder='Discover news, articles and more...'
          aria-label='Search'
          onFocus={handleFocus}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleEsc}
          {...rest}
        />
        {focus && (
          <Box sx={styles.poweredBy}>
            <PoweredBy />
          </Box>
        )}
      </Box>
    </>
  )
}

export default connectSearchBox(SearchBox)
