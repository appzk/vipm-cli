const postcss = require('postcss')
const postcssValueParser = require('postcss-value-parser')

function defaultScale() {
  return 1
}

function transform(opts) {
  const { onSpx, mapScale = defaultScale } = opts
  return function (decl) {
    decl.value = postcssValueParser(decl.value).walk(function(node) {
      if (node.type === 'word') {
        if (onSpx) {
          onSpx(node, decl)
        } else {
          node.value = node.value.replace(/(\d+)s(px)/ig, (s, n, m) => Math.round(Number(n) * mapScale(decl.source.input.file, decl)) + m)
        }
      }
    }).toString()
  }
}

module.exports = postcss.plugin('postcss-spx', function spx(opts) {
  return function (css, result) {
    css.walkDecls(transform(opts))
  }
})
