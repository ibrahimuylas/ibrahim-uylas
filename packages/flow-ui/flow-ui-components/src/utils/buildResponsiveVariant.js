import castArray from './castArray'

const getThemeValue = (theme, path) =>
  path.split('.').reduce((value, key) => value && value[key], theme)

export const responsiveVariantStyles =
  (variants, baseStyles = {}) =>
  theme =>
    castArray(variants).reduce((styles, variant, index) => {
      const variantStyles = getThemeValue(theme, variant)

      if (!variantStyles) return styles
      if (index === 0) return { ...styles, ...variantStyles }

      const breakpoint = theme.breakpoints[index - 1]
      if (!breakpoint) return styles

      const mediaQuery = breakpoint.includes('@media')
        ? breakpoint
        : `@media screen and (min-width: ${breakpoint})`

      return {
        ...styles,
        [mediaQuery]: {
          ...styles[mediaQuery],
          ...variantStyles
        }
      }
    }, baseStyles)

//Builds theme-ui variant dynamically
export default (a, b, c) => {
  //Responsive variant is passed
  //Add variant child(b) to variant only
  if (Array.isArray(a)) {
    return a.map(variant => [variant, b].join('.'))
  }

  //Variant group is passed
  return castArray(b).map(variant => {
    let values = [a, variant]

    if (c) {
      values.push(c)
    }

    return values.join('.')
  })
}
