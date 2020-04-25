module.exports = {
  name: 'error',
  type: 'on',
  handle: (err) => {
    console.error('ERIS ERROR', err)
  }
}
