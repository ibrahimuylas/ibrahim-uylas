export default {
  row: {
    display: [`block`, `block`, `flex`],
    flexWrap: `wrap`,
    mb: 3,
  },
  column: {
    flex: `auto`,
    mb: [3, 3, 0],
    '+ div': {
      ml: [0, 0, 3],
    },
  },
  input: {
    border: `none`,
    bg: `omegaLight`,
    color: `omegaDark`,
    outline: `none`,
    '::placeholder': {
      color: `omegaDark`,
    },
  },
  textarea: {
    variant: 'forms.input',
    fontSize: 3,
    minHeight: 100,
  },
  label: {
    mb: 2,
  },
}
