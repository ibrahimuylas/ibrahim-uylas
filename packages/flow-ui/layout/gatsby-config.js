module.exports = options => {
  return {
    plugins: [
      {
        resolve: 'gatsby-plugin-layout',
        options: {
          component: require.resolve('./src/Layout/Layout.jsx')
        }
      }
    ]
  }
}
