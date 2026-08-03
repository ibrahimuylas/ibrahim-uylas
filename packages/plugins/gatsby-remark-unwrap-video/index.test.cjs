const assert = require('node:assert/strict')
const test = require('node:test')

const transformVideoEmbeds = require('./index')

const createVideoAst = iframe => ({
  children: [
    {
      type: 'paragraph',
      children: [
        {
          type: 'html',
          value: `<div class="embedVideo-container">${iframe}</div>`
        }
      ]
    }
  ]
})

test('replaces generated YouTube embeds with a deferred component', () => {
  const markdownAST = createVideoAst(
    '<iframe src="https://www.youtube.com/embed/HuMmBjTpc0k?rel=0" width="800" height="450"></iframe>'
  )

  transformVideoEmbeds({ markdownAST })

  assert.equal(markdownAST.children[0].type, 'mdxJsxFlowElement')
  assert.equal(markdownAST.children[0].name, 'DeferredEmbed')
  assert.deepEqual(
    Object.fromEntries(
      markdownAST.children[0].attributes.map(({ name, value }) => [name, value])
    ),
    {
      src: 'https://www.youtube.com/embed/HuMmBjTpc0k?rel=0',
      provider: 'youtube',
      title: 'YouTube videosu',
      width: '800',
      height: '450'
    }
  )
})

test('replaces explicit route iframes with viewport-deferred components', () => {
  const markdownAST = {
    children: [
      {
        type: 'mdxJsxFlowElement',
        name: 'iframe',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'src',
            value: 'https://tr.wikiloc.com/wikiloc/spatialArtifacts.do?id=1'
          },
          { type: 'mdxJsxAttribute', name: 'width', value: '100%' },
          { type: 'mdxJsxAttribute', name: 'height', value: '600' }
        ],
        children: []
      }
    ]
  }

  transformVideoEmbeds({ markdownAST })

  assert.equal(markdownAST.children[0].name, 'DeferredEmbed')
  assert.equal(
    markdownAST.children[0].attributes.find(({ name }) => name === 'provider')
      .value,
    'route'
  )
})

test('leaves non-YouTube generated video HTML unchanged', () => {
  const markdownAST = createVideoAst(
    '<iframe src="https://player.vimeo.com/video/123"></iframe>'
  )

  transformVideoEmbeds({ markdownAST })

  assert.equal(markdownAST.children[0].type, 'paragraph')
  assert.match(markdownAST.children[0].children[0].value, /player\.vimeo/)
})
