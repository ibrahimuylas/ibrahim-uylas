const test = require('node:test')
const assert = require('node:assert/strict')
const createDisqusConfig = require('./createDisqusConfig')

test('creates a canonical Disqus URL for a post', () => {
  assert.deepEqual(
    createDisqusConfig({
      siteUrl: 'https://www.ibrahimuylas.com/',
      slug: '/lowa-zephyr-gtx-mid-bot-sage/',
      title: 'Yeni Botlarım LOWA ZEPHYR'
    }),
    {
      title: 'Yeni Botlarım LOWA ZEPHYR',
      url: 'https://www.ibrahimuylas.com/lowa-zephyr-gtx-mid-bot-sage/'
    }
  )
})

test('lets Disqus use its browser fallback when no canonical URL is available', () => {
  assert.deepEqual(createDisqusConfig({ title: 'A post' }), {
    title: 'A post'
  })
})
