export default {
  imageVariant: `horizontal`,

  card: {
    ':hover': {
      transform: `none`,
      boxShadow: `none`,
    },
  },
  content: {
    flexDirection: `row`,
    position: `relative`,
  },
  media: {
    flexBasis: `full`,
    m: 0,
  },
  image: {
    minHeight: `15rem`,
    maxHeight: 350,
  },
  iconBox: {
    borderRadius: `default`,
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
    height: `full`,
    width: `full`,
    justifyContent: `flex-start`,
    background: `linear-gradient(
				120deg,
				#2d3748 0%,
				transparent 120%
			)`,
    position: `absolute`,
    zIndex: 3,
    p: 0,
    pt: [4, 5],
    pl: [4, 6],
    pr: 4,
  },
  category: {
    display: [`none`, `block`],
  },
  title: {
    variant: `text.h2`,
    color: `white`,
    width: `full`,
  },
  excerpt: {
    display: [`none`, `none`, `block`],
    width: `4/5`,
    flex: `0`,
    color: `omega`,
    fontSize: 2,
    textShadow: (t) => `
			1px 1px 0px #2d3748
    `,
    mb: 3,
  },
  footer: {
    variant: `text.small`,
  },
  authorPhoto: {
    display: `none`,
  },
  author: {
    display: `inline-block`,
    'a, a:visited': {
      color: `omegaLight`,
    },
  },
  date: {
    display: `none`,
  },
  timeToRead: {
    display: `none`,
  },
}
