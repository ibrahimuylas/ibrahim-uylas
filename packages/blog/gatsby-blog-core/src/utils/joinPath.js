module.exports = (...parts) =>
  parts
    .filter(part => part !== undefined && part !== null && part !== '')
    .join('/')
    .replace(/\/+/g, '/')
