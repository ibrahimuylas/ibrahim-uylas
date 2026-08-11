'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const {
  commentText,
  normalizePath,
  prepareDisqusImport
} = require('../scripts/import-disqus-comments.cjs')

const exportXml = `<?xml version="1.0" encoding="UTF-8"?>
<disqus xmlns="http://disqus.com"
  xmlns:dsq="http://disqus.com/disqus-internals">
  <thread dsq:id="thread-local">
    <id>thread-10</id>
    <forum>ibrahim-uylas</forum>
    <link>http://www.ibrahimuylas.com/example?utm_source=old</link>
    <title>Example article</title>
    <createdAt>2020-01-01T10:00:00Z</createdAt>
  </thread>
  <thread dsq:id="external-thread">
    <id>thread-20</id>
    <link>https://example.com/not-this-site/</link>
    <title>External article</title>
  </thread>
  <post dsq:id="root-local">
    <id>post-100</id>
    <message><![CDATA[<p>Hello <strong>world</strong><br>again &amp; welcome</p>]]></message>
    <thread dsq:id="thread-local">thread-10</thread>
    <createdAt>2020-01-02T10:00:00Z</createdAt>
    <author><name>Ada</name><email>private@example.com</email></author>
  </post>
  <post dsq:id="reply-local">
    <id>post-101</id>
    <message>Reply</message>
    <parent dsq:id="root-local">post-100</parent>
    <thread dsq:id="thread-local">thread-10</thread>
    <createdAt>2020-01-03T10:00:00Z</createdAt>
    <author><name>Grace</name></author>
  </post>
  <post dsq:id="deleted-local">
    <id>post-102</id>
    <message>Deleted parent</message>
    <thread dsq:id="thread-local">thread-10</thread>
    <createdAt>2020-01-04T10:00:00Z</createdAt>
    <isDeleted>true</isDeleted>
    <author><name>Deleted</name></author>
  </post>
  <post dsq:id="orphan-local">
    <id>post-103</id>
    <message>Visible child</message>
    <parent dsq:id="deleted-local">post-102</parent>
    <thread dsq:id="thread-local">thread-10</thread>
    <createdAt>2020-01-05T10:00:00Z</createdAt>
    <author><name>Linus</name></author>
  </post>
  <post dsq:id="spam-local">
    <id>post-104</id>
    <message>Spam</message>
    <thread dsq:id="thread-local">thread-10</thread>
    <createdAt>2020-01-06T10:00:00Z</createdAt>
    <isSpam>true</isSpam>
    <author><name>Spam</name></author>
  </post>
</disqus>`

test('normalizes only paths from the configured site', () => {
  assert.equal(normalizePath('https://www.ibrahimuylas.com/example?q=1'), '/example/')
  assert.equal(normalizePath('/example/'), '/example/')
  assert.equal(normalizePath('https://example.com/example/'), null)
})

test('converts exported comment HTML to bounded plain text', () => {
  assert.equal(
    commentText('<p>Hello <strong>world</strong><br>again &amp; welcome</p>'),
    'Hello world\nagain & welcome'
  )
})

test('prepares public Disqus threads and preserves reply relationships', () => {
  const plan = prepareDisqusImport(exportXml)

  assert.deepEqual(plan.summary, {
    threads: 1,
    comments: 3,
    roots: 2,
    replies: 1,
    skippedThreads: 1,
    unreferencedThreads: 0,
    skippedModerated: 2,
    skippedInvalid: 0,
    skippedWithoutThread: 0
  })
  assert.equal(plan.threads[0].path, '/example/')

  const root = plan.posts.find(post => post.sourceId === 'post-100')
  const reply = plan.posts.find(post => post.sourceId === 'post-101')
  const promoted = plan.posts.find(post => post.sourceId === 'post-103')

  assert.equal(root.body, 'Hello world\nagain & welcome')
  assert.equal('email' in root, false)
  assert.equal(reply.parentSourceId, 'post-100')
  assert.equal(reply.rootSourceId, 'post-100')
  assert.equal(promoted.parentSourceId, null)
  assert.equal(plan.rootActivity.get('post-100'), '2020-01-03T10:00:00.000Z')
})
