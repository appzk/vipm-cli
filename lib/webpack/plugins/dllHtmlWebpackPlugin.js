function dllHtmlWebpackPlugin(opts) {
  this.keys = opts.keys
  this.injectBody = opts.env !== 'dev'
}

dllHtmlWebpackPlugin.prototype.apply = function(compiler) {
  let { keys, injectBody } = this
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
      let htmlStr = '',
        html = htmlPluginData.html,
        bodyRegExp = /(<\/body>)/i,
        headRegExp = /(<\/head>)/i
      keys.forEach(key => {
        htmlStr += `<script type="text/javascript" src="${key}"></script>`
      })
      if (injectBody && bodyRegExp.test(html)) {
        htmlPluginData.html = html.replace(bodyRegExp, function(match) {
          return htmlStr + match
        })
      } else if (headRegExp) {
        htmlPluginData.html = html.replace(headRegExp, function(match) {
          return htmlStr + match
        })
      } else {
        htmlPluginData.html += htmlStr
      }
      callback(null, htmlPluginData)
    })
  })
}

module.exports = dllHtmlWebpackPlugin
