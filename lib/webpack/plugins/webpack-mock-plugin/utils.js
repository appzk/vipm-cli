const fs = require('fs')
const path = require('path')
const trim = require('lodash/trim')
const find = require('lodash/find')
const { mock, Random } = require('mockjs')

const cwd = file => path.resolve(file || '')
const ownDir = file => path.join(__dirname, file || '')
const type = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
const getProjectName = () => trim(path.resolve(''), path.sep).split(path.sep).pop()
const findOneWithQuery = (target, query) => find(target, (item) => query[item.query] == item.value)
const projectName = getProjectName()

function compileMockConfig(path) {
  let mockConfig = {}
  if (fs.existsSync(path)) {
    let mockInterface = require(path)
    let configType = type(mockInterface)
    if (configType === 'object') {
      mockConfig = mockInterface
    } else if (configType === 'function') {
      mockConfig = mockInterface({ projectName, cwd, mock, Random })
    }
  }
  return mockConfig
}

exports.cwd = cwd
exports.type = type
exports.ownDir = ownDir
exports.findOneWithQuery = findOneWithQuery
exports.compileMockConfig = compileMockConfig
