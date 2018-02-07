const watchServer = require('./watch.js')

function WebpackMockPlugin() {}

WebpackMockPlugin.prototype.apply = function(compiler) {
  watchServer()
  compiler.plugin('emit', (compilation, callback) => {
    callback()
  })
}

module.exports = WebpackMockPlugin
