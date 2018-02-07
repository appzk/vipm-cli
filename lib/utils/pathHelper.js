const path = require('path')
const trim = require('lodash/trim')

exports.cwd = file => path.resolve(file || '')
exports.ownDir = file => path.join(__dirname, '../..', file || '')
exports.getProjectName = () => trim(path.resolve(''), path.sep).split(path.sep).pop()
