function HtmlWebpackHmtTrackPlugin(key) {
  if (typeof key === 'string') {
    this.hmtScript = '<script type="text/javascript">var _hmt=_hmt||[];!function(){var e=document.createElement("script");e.src="//hm.baidu.com/hm.js?' + key + '";var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}()</script>'
  } else {
    this.hmtScript = '<script type="text/javascript">var _hmt=_hmt||[];</script>'
  }
}

/*
1. Create hmt analyse code
2. insert code to body
*/
HtmlWebpackHmtTrackPlugin.prototype.apply = function(compiler) {
  let hmtScript = this.hmtScript
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-before-html-processing', function(htmlPluginData, callback) {
      let html = htmlPluginData.html,
        bodyRegExp = /(<\/body>)/i
      if (bodyRegExp.test(html)) {
        htmlPluginData.html = html.replace(bodyRegExp, function(match) {
          return hmtScript + match
        })
      } else {
        htmlPluginData.html += hmtScript
      }
      callback(null, htmlPluginData)
    })
  })
}

module.exports = HtmlWebpackHmtTrackPlugin
