module.exports = ({ createResolvers }) => {
  createResolvers({
    Mdx: {
      timeToRead: {
        type: 'Int',
        resolve: source => {
          const words = (source.body || '').trim().split(/\s+/).filter(Boolean)
          return Math.max(1, Math.ceil(words.length / 200))
        }
      }
    }
  })
}
