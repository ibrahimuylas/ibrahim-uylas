import common from './common'

export default {
  ...common.button,
  color: `white`,
  bg: `alpha`,
  borderColor: `alpha`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      color: `omegaLighter`,
      bg: `omegaDark`,
      borderColor: `omegaDark`
    }
  }
}
