const fs = require('fs'),
  path = require('path')

let extOpts = ['.html', '.pug', '.ejs', '.art']

module.exports = function(dir, name) {
  for (let i = 0; i < extOpts.length; i++) {
    if (fs.existsSync(path.resolve(dir, name + extOpts[i]))) return (name + extOpts[i])
  }
  return false
}
