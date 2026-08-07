import React from 'react'
import { Box } from 'theme-ui'
import { FaArchive } from 'react-icons/fa'
import IconButton from '@components/IconButton'
import Section from '@components/Section'
import categoryColors from './categoryColors'

const styles = {
  horizontal: {
    display: `flex`,
    flexWrap: `nowrap`,
    overflowX: `auto`,
    width: `auto`,
    scrollBehavior: `smooth`,
    m: -2,
    a: {
      flex: 1,
      minWidth: '140px',
      m: 2,
      transition: `transform 220ms ease, box-shadow 220ms ease`,
      willChange: `transform`,
      '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
          transform: `translateY(-0.35rem) scale(1.015)`,
          boxShadow: `0 16px 40px -12px rgba(46, 41, 51, 0.16)`,
          '> div:first-of-type': {
            transform: `scale(1.08) translateY(-0.1rem)`
          }
        }
      },
      ':focus-visible': {
        outline: `2px solid`,
        outlineColor: `primary`,
        outlineOffset: 3
      },
      '@media (prefers-reduced-motion: reduce)': {
        transition: `none`,
        ':hover': {
          transform: `none`,
          '> div:first-of-type': {
            transform: `none`
          }
        }
      }
    }
  }
}

const HomepageCategories = ({ variant, categories, ...props }) => (
  <Section aside={variant === 'vertical'} title='Topics' {...props}>
    <Box sx={styles[variant]}>
      {categories &&
        categories.map(({ id, name, slug, totalCount, icon, description }) => {
          const buttonProps = {
            key: id,
            name,
            description,
            number: totalCount,
            to: slug,
            iconPath: icon,
            iconColor: categoryColors[name],
            Icon: !icon && FaArchive,
            variant
          }

          return totalCount !== 0 && <IconButton {...buttonProps} />
        })}
    </Box>
  </Section>
)

export default HomepageCategories

HomepageCategories.defaultProps = {
  variant: 'vertical'
}
