import common from './common'

export default {
  ...common.button,
  color: `omegaDark`,
  bg: `transparent`,
  borderColor: `omegaDark`,
  ':hover': {
    bg: `omegaDark`,
    color: `white`
  }
}
