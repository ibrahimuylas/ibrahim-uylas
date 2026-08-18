import React from 'react'
import { IconButton, useColorMode } from 'theme-ui'
import { FaMoon, FaSun } from 'react-icons/fa'

const styles = {
  trigger: {
    display: `flex`,
    alignItems: `center`,
    justifyContent: `center`,
    width: 48,
    minWidth: 48,
    height: 48,
    minHeight: 48,
    boxSizing: `border-box`,
    p: 0,
    borderRadius: `full`,
    color: `omegaDark`,
    cursor: `pointer`,
    '&:hover': {
      bg: `omegaLighter`,
      color: `heading`
    },
    '&:focus-visible': {
      outline: `3px solid`,
      outlineColor: `alpha`,
      outlineOffset: 2
    },
    svg: {
      width: 20,
      height: 20
    }
  }
}

export const HeaderColorMode = () => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`

  const handleChange = () => setColorMode(isDark ? `light` : `dark`)

  const label = isDark ? `Açık temaya geç` : `Koyu temaya geç`

  return (
    <IconButton aria-label={label} onClick={handleChange} sx={styles.trigger}>
      {isDark ? (
        <FaMoon aria-hidden='true' focusable='false' />
      ) : (
        <FaSun aria-hidden='true' focusable='false' />
      )}
    </IconButton>
  )
}
