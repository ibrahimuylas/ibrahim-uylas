export default bgColor => {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2
    ? 'omegaDarker'
    : '#fff'
}
