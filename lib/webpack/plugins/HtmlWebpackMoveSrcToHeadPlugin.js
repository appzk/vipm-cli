const remove = require('lodash/remove')

function HtmlWebpackMoveSrcToHeadPlugin(names) {
  this.names = names
}

/*
HtmlWebpackPlugin options key "inject" only has four selector

In order to insert some script to head and others to body, this plugin will help you

htmlPluginData is a object. it has assets that need to insert to html

1. delete script from body
2. add script to head
*/
HtmlWebpackMoveSrcToHeadPlugin.prototype.apply = function(compiler) {
  let names = this.names
  compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) {
      let removeScripts = remove(htmlPluginData.body, item => {
        let isRemove = false
        let test = item.attributes.src || item.attributes.href
        for (let i = 0; i < names.length; i++) {
          if (test.indexOf(`${names[i]}.`) !== -1) {
            isRemove = true
            break
          }
        }
        return isRemove
      })
      removeScripts.sort((a, b) => {
        let indexA = 0
        let indexB = 0
        let testA = a.attributes.src || a.attributes.href
        let testB = b.attributes.src || b.attributes.href
        for (let i = 0; i < names.length; i++) {
          if (testA.indexOf(`${names[i]}.`) !== -1) {
            indexA = i
          }
          if (testB.indexOf(`${names[i]}.`) !== -1) {
            indexB = i
          }
        }
        return indexA < indexB
      }).forEach(item => htmlPluginData.head.unshift(item))
      callback(null, htmlPluginData)
    })
  })
}

module.exports = HtmlWebpackMoveSrcToHeadPlugin
