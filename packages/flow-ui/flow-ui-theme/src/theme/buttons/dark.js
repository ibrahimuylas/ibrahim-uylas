import common from './common'

export default {
  ...common.button,
  color: `omegaLighter`,
  bg: `omegaDark`,
  borderColor: `omegaDark`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: `white`,
      bg: `alpha`,
      borderColor: `alpha`
    }
  }
}
