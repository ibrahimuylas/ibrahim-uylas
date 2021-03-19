module.exports = options => {
  return {
    plugins: [
      {
        resolve: '@elegantstack/core-blog',
        options
      },
      {
        resolve: '@elegantstack/pages-blog',
        options
      },
      {
        resolve: '@elegantstack/helpers-blog',
        options
      },
      {
        resolve: '@elegantstack/helpers',
        options
      },
      {
        resolve: '@elegantstack/flow-ui-components',
        options
      },
      {
        resolve: '@elegantstack/flow-ui-theme',
        options
      },
      {
        resolve: '@elegantstack/flow-ui-layout',
        options
      },
      {
        resolve: '@elegantstack/flow-ui-widgets',
        options
      }
    ]
  }
}
