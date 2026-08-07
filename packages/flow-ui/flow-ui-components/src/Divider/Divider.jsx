import React from 'react'
import { Box } from 'theme-ui'

const getSpacing = space =>
  Array.isArray(space)
    ? space.map((value, index) =>
        value == null ? value : index === 0 ? value - 1 : value
      )
    : [space - 1, space]

const Divider = ({ space = 4, line = false }) => (
  <Box
    sx={{
      minWidth: `auto`,
      borderTopStyle: `solid`,
      borderTopColor: line ? `omegaLighter` : `transparent`,
      borderTopWidth: 2,
      height: 0,
      my: getSpacing(space)
    }}
  />
)

export default Divider
