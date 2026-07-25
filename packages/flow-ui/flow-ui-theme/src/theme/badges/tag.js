import common from './common'

export default {
  ...common.badge,
  bg: `omegaLight`,
  color: `omegaDark`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: `omegaLight`,
      bg: `omegaDark`
    }
  }
}
