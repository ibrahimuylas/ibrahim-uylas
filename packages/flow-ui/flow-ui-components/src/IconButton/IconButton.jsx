import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { Button, Box, Heading, Text } from 'theme-ui'

const styles = {
  button: {
    vertical: {
      variant: `cards.primary`,
      display: `flex`,
      alignItems: `center`,
      textAlign: `initial`,
      overflow: `hidden`,
      mb: 3,
      p: 0,
      pr: 2,
      'svg, img': {
        color: `omegaDark`,
        verticalAlign: `middle`,
        size: `icon.xs`
      },
      '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
          'svg, img': {
            color: `white`
          },
          'div:first-of-type': {
            bg: `alpha`
          }
        }
      }
    },
    horizontal: {
      variant: `cards.interactive`,
      display: `flex`,
      flexDirection: `column`,
      alignItems: `stretch`,
      p: 0,
      'svg, img': {
        size: `icon.sm`
      },
      '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
          'svg, img': {
            color: `omegaDark`
          }
        }
      }
    }
  },
  icon: {
    vertical: {
      display: [`flex`, `none`, `flex`],
      transition: `all 250ms ease`,
      alignItems: `center`,
      justifyContent: `center`,
      alignSelf: `stretch`,
      bg: `omegaLight`,
      width: 70
    },
    horizontal: {
      display: [`block`, `none`, `block`],
      boxSizing: `content-box`,
      transition: `all 250ms ease`,
      borderRadius: `bottom`,
      width: `1/3`,
      height: `icon.sm`,
      mx: `auto`,
      pt: 3
    }
  },
  text: {
    flex: `auto`,
    color: `omegaDark`,
    whiteSpace: `normal`,
    p: 3,
    m: 0
  },
  description: {
    display: `block`,
    color: `text`,
    fontSize: 1,
    fontWeight: `body`,
    lineHeight: 1.4,
    mt: 1
  }
}

export const IconButton = ({
  variant,
  name,
  description,
  Icon,
  iconPath,
  iconColor,
  to
}) => (
  <Button variant='none' as={to && Link} to={to} sx={styles.button[variant]}>
    {(Icon || iconPath) && (
      <Box sx={styles.icon[variant]}>
        {iconPath &&
          (iconColor ? (
            <Box
              as='span'
              aria-hidden='true'
              sx={{
                display: `block`,
                width: `icon.sm`,
                height: `icon.sm`,
                mx: `auto`,
                bg: iconColor,
                WebkitMaskImage: `url(${iconPath})`,
                maskImage: `url(${iconPath})`,
                WebkitMaskPosition: `center`,
                maskPosition: `center`,
                WebkitMaskRepeat: `no-repeat`,
                maskRepeat: `no-repeat`,
                WebkitMaskSize: `contain`,
                maskSize: `contain`
              }}
            />
          ) : (
            <Box as='img' src={iconPath} alt='' />
          ))}
        {Icon && (
          <Icon
            color={iconColor}
            style={iconColor ? { color: iconColor } : undefined}
          />
        )}
      </Box>
    )}
    <Box sx={styles.text}>
      <Heading variant='h4' as='span'>
        {name}
      </Heading>
      {description && <Text sx={styles.description}>{description}</Text>}
    </Box>
  </Button>
)

export default IconButton

IconButton.defaultProps = {
  variant: 'horizontal',
  number: undefined
}

IconButton.propTypes = {
  variant: PropTypes.oneOf(['horizontal', 'vertical']),
  name: PropTypes.string,
  description: PropTypes.string,
  number: PropTypes.number,
  Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  iconPath: PropTypes.string,
  iconColor: PropTypes.string,
  to: PropTypes.string
}
