export default {
  imageVariant: `hero`,

  card: {
    borderRadius: `none`,
    ':hover': {
      transform: `none`,
      boxShadow: `none`,
    },
  },
  content: {
    flexDirection: [`column`, `column`, `row`],
    position: `relative`,
    ':after': {
      display: [`none`, `none`, `block`],
      height: [0, `2/3`, `2/3`, `2/3`],
      width: `full`,
      position: `absolute`,
      bottom: 0,
      content: `""`,
      background: `linear-gradient(
        0deg,
      	#2d3748 0%,
      	transparent 100%
      )`,
    },
  },
  media: {
    flexBasis: `full`,
    m: 0,
  },
  image: {
    minHeight: `auto`,
    maxHeight: `none`,
  },
  iconBox: {
    borderRadius: 0,
    minHeight: `20rem`,
  },
  iconText: {
    display: `none`,
  },
  icon: {
    size: `5/6`,
    ml: `40%`,
    opacity: 0.5,
  },
  body: {
    height: `auto`,
    width: `100%`,
    maxWidth: `container`,
    position: [`static`, `static`, `absolute`],
    transform: [`none`, `none`, `translate(-50%, 0)`],
    left: `50%`,
    bottom: 0,
    zIndex: 3,
    px: 4,
    py: [4, 4, 0],
    mb: [0, 0, 4, 5],
  },
  category: {
    display: `block`,
  },
  title: {
    fontFamily: `heading`,
    fontSize: [5, 6, 6, 7],
    width: [`full`, `full`, `full`, `2/3`],
    color: [`heading`, `heading`, `white`],
    textAlign: `left`,
    pr: [0, 0, 4, 5],
    m: 0,
  },
  excerpt: {
    display: `none`,
  },
  footer: {
    variant: `text.h4`,
    alignSelf: `flex-start`,
    borderLeftStyle: `solid`,
    borderLeftWidth: `lg`,
    borderLeftColor: `omegaDark`,
    m: 0,
    mt: 3,
    px: 3,
    py: 2,
  },
  authorPhoto: {
    display: [`block`, `block`, `none`],
  },
  author: {
    display: [`inline-block`, `inline-block`, `none`],
    flexBasis: [`auto`, `full`],
    'a, a:visited': {
      color: [`alpha`, `alpha`, `omegaLighter`],
    },
  },
  date: {
    display: `inline-block`,
  },
  timeToRead: {
    display: `inline-block`,
  },
}
