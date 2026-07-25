const assert = require('node:assert/strict')
const test = require('node:test')

const transformVideoEmbeds = require('./index')

const createVideoAst = iframe =>
  ({
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

test('adds a cross-origin referrer policy to generated YouTube embeds', () => {
  const markdownAST = createVideoAst(
    '<iframe src="https://www.youtube.com/embed/HuMmBjTpc0k?rel=0"></iframe>'
  )

  transformVideoEmbeds({ markdownAST })

  assert.equal(markdownAST.children[0].type, 'html')
  assert.match(
    markdownAST.children[0].value,
    /<iframe referrerpolicy="strict-origin-when-cross-origin"/
  )
})

test('preserves an existing YouTube iframe referrer policy', () => {
  const markdownAST = createVideoAst(
    '<iframe referrerpolicy="origin" src="https://www.youtube.com/embed/HuMmBjTpc0k"></iframe>'
  )

  transformVideoEmbeds({ markdownAST })

  assert.equal(
    markdownAST.children[0].value.match(/\breferrerpolicy=/g)?.length,
    1
  )
  assert.match(markdownAST.children[0].value, /referrerpolicy="origin"/)
})

test('does not add a YouTube policy to other embedded video providers', () => {
  const markdownAST = createVideoAst(
    '<iframe src="https://player.vimeo.com/video/123"></iframe>'
  )

  transformVideoEmbeds({ markdownAST })

  assert.doesNotMatch(markdownAST.children[0].value, /referrerpolicy=/)
})
