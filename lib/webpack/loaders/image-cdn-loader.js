const trim = require('lodash/trim')
const util = require('loader-utils')
const type = require('../../utils/getType')

module.exports = function(content) {
  this.cacheable && this.cacheable(true)
  let query = util.getOptions(this) || {}
  let cdnPath = query.cdnPath
  let newCdnPath
  if (!cdnPath) return content

  if (Array.isArray(cdnPath)) {
    newCdnPath = trim(cdnPath(Math.round(Math.random() * cdnPath.length)))
  } else {
    newCdnPath = trim(cdnPath)
  }

  if (type(content) === 'string' && content.indexOf('__webpack_public_path__') !== -1) {
    content = content.replace('__webpack_public_path__', `"${newCdnPath}" + __webpack_public_path__`)
  }
  return content
}
