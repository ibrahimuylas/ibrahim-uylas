import React, { useEffect, useState, useCallback } from 'react'
import { useSearchBox } from 'react-instantsearch'
import useDebounce from '@components/useDebounce'
import SearchInput from './Search.Input'

const SearchBox = ({ focus, handleFocus, handleClose, ...rest }) => {
  const { refine } = useSearchBox()
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
      <SearchInput
        focus={focus}
        onFocus={handleFocus}
        onChange={e => setSearchTerm(e.target.value)}
        onKeyDown={handleEsc}
        isLoaded
        {...rest}
      />
    </>
  )
}

export default SearchBox
