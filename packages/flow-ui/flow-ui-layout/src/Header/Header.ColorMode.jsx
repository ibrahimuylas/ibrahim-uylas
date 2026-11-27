import React, { useEffect, useState } from 'react'
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
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': {
        bg: `omegaLighter`,
        color: `heading`
      }
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

export const HeaderColorMode = ({ lightLabel = `Açık temaya geç`, darkLabel = `Koyu temaya geç` }) => {
  const [colorMode, setColorMode] = useColorMode()
  const [hasHydrated, setHasHydrated] = useState(false)
  const isDark = hasHydrated && colorMode === `dark`

  useEffect(() => setHasHydrated(true), [])

  const handleChange = () => setColorMode(colorMode === `dark` ? `light` : `dark`)

  const label = isDark ? lightLabel : darkLabel

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
