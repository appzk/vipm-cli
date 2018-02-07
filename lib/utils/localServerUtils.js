const { ownDir } = require('./pathHelper')

function provide(name) {
  return require(ownDir(`./node_modules/${name}`))
}

function provideWeb(name) {
  return require(ownDir(`./web_modules/${name}`))
}

exports.provide = provide
exports.provideWeb = provideWeb
