function WebpackDoneLogPlugin(log) {
  this.log = log
}

WebpackDoneLogPlugin.prototype.apply = function(compiler) {
  const log = this.log
  compiler.plugin('done', function() {
    console.log(log)
  })
}

module.exports = WebpackDoneLogPlugin
