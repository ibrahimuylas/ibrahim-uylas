import common from './common'

export default {
  ...common.button,
  color: `omegaDark`,
  bg: `omegaLight`,
  borderColor: `omegaLight`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: `white`,
      bg: `alpha`,
      borderColor: `alpha`
    }
  }
}
