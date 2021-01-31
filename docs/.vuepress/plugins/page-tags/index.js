const { resolve } = require('path')
module.exports = (options = {}, ctx) => {
  return {
    name: 'page-tags',
    clientRootMixin: resolve(__dirname, 'clientRootMixin.js'),
    enhanceAppFiles: [resolve(__dirname, 'enhanceAppFiles.js')],
  }
}
