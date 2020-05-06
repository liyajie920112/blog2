const { resolve } = require('path')
module.exports = (options = {}, ctx) => {
  return {
    name: 'copy-code',
    enhanceAppFiles: [
      resolve(__dirname, 'enhanceAppFiles.js')
    ]
  }
}
