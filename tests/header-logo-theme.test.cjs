const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const readSource = relativePath =>
  fs.readFileSync(path.resolve(__dirname, '..', relativePath), 'utf8')

test('header logo follows Theme UI color variables during hydration', () => {
  const headerLogo = readSource(
    'packages/flow-ui/flow-ui-layout/src/Header/Header.Logo.jsx'
  )
  const logo = readSource(
    'packages/flow-ui/flow-ui-components/src/Logo/Logo.jsx'
  )
  const colors = readSource(
    'packages/flow-ui/flow-ui-theme/src/theme/colors.js'
  )

  assert.doesNotMatch(headerLogo, /useColorMode|localStorage/)
  assert.match(headerLogo, /imageDark=\{logoDarkImage\}/)
  assert.match(logo, /imageDark \? \(/)
  assert.match(logo, /--theme-ui-colors-logoLightOpacity/)
  assert.match(logo, /--theme-ui-colors-logoDarkOpacity/)
  assert.match(colors, /logoLightOpacity: 1,[\s\S]*logoDarkOpacity: 0/)
  assert.match(
    colors,
    /modes: \{[\s\S]*dark: \{[\s\S]*logoLightOpacity: 0,[\s\S]*logoDarkOpacity: 1/
  )
})
