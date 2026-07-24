import React from 'react'
import { Link } from 'gatsby'
import { Badge, Heading, Flex, Box } from 'theme-ui'

const styles = {
  wrapper: {
    alignItems: `center`
  },
  heading: {
    color: `omegaDark`,
    mr: 3,
    mb: 0
  }
}

export const PostTags = ({ tags, private: isPrivate }) =>
  tags && tags.length > 0 ? (
    <Flex sx={styles.wrapper}>
      <Heading variant='h5' sx={styles.heading}>
        Tags
      </Heading>
      <Box variant='lists.badges'>
        {tags.map(({ id, name, slug }) => {
          const linkProps = isPrivate ? {} : { as: Link, to: slug }

          return (
            <Badge variant='tag' key={id} {...linkProps}>
              {name}
            </Badge>
          )
        })}
      </Box>
    </Flex>
  ) : null
