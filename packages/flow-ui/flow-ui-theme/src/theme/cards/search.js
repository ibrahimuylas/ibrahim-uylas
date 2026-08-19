export default {
  card: {
    borderRadius: `none`,
    boxShadow: `none`,
    bg: `transparent`,
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        transform: `none`,
        boxShadow: `none`
      }
    }
  },
  content: {
    pl: [0, 3]
  },
  media: {
    display: `none`
  },
  body: {
    alignSelf: `center`,
    flexGrow: 1
  },
  category: {
    display: `none`
  },
  title: {
    variant: `text.h4`,
    color: `alpha`,
    mb: 2,
    '@media (hover: hover) and (pointer: fine)': {
      ':hover': {
        color: `alphaDark`
      }
    }
  },
  excerpt: {
    variant: `text.small`
  },
  footer: {
    variant: `text.small`
  },
  authorPhoto: {
    display: `block`
  },
  author: {
    display: `inline-block`,
    flexBasis: `full`
  },
  date: {
    display: `inline-block`
  },
  timeToRead: {
    display: `inline-block`
  }
}
