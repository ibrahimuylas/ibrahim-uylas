import common from './common'

export default {
  ...common.badge,
  bg: `white`,
  color: `alpha`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      bg: `alpha`,
      color: `white`
    }
  }
}
