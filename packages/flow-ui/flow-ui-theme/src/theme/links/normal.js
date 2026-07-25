export default {
  color: `alpha`,
  textDecoration: `none`,
  userSelect: `none`,
  ':visited': {
    color: 'alpha'
  },
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: 'alphaDark'
    }
  }
}
