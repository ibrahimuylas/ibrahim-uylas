import common from './common'

export default {
  ...common.button,
  color: `omegaDark`,
  bg: `omegaLighter`,
  borderColor: `omega`,
  '@media (hover: hover) and (pointer: fine)': {
    ':hover': {
      borderColor: `alpha`
    }
  }
}
