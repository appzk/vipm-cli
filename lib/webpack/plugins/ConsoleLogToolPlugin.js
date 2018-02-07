function ConsoleLogToolPlugin() {
  this.consoleScript = '<script src="//vipweb.bs2cdn.yy.com/vipinter_563d001e306d4272a8bd9c377987b5e4.js"></script><script src="//vipweb.bs2cdn.yy.com/vipinter_b6bd407faee54ee7b4867526508049a9.js"></script>'
}

ConsoleLogToolPlugin.prototype.apply = function(compiler) {
  let consoleScript = this.consoleScript
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
      let html = htmlPluginData.html,
        bodyRegExp = /(<\/body>)/i
      if (bodyRegExp.test(html)) {
        htmlPluginData.html = html.replace(bodyRegExp, function(match) {
          return consoleScript + match
        })
      } else {
        htmlPluginData.html += consoleScript
      }
      callback(null, htmlPluginData)
    })
  })
}

module.exports = ConsoleLogToolPlugin
