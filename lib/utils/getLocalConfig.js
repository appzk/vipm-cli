const fs = require('fs'),
  path = require('path'),
  getType = require('./getType'),
  defaultsDeep = require('lodash/defaultsDeep')

const env = process.env.NODE_ENV,
  serverEnv = process.env.SERVER_ENV,
  { cwd, ownDir, getProjectName } = require('./pathHelper'),
  localConfigPath = path.resolve(cwd(), 'local.config.js'),
  baseLocalConfigPath = path.resolve(cwd(), '../local.config.js'),
  projectName = getProjectName()

let localConfigCache = null

function getLocalConfig(path) {
  let localConfig = {}
  if (fs.existsSync(path)) {
    let localInterface = require(path)
    let configType = getType(localInterface)
    if (configType === 'object') {
      localConfig = localInterface
    } else if (configType === 'function') {
      localConfig = localInterface({ env, projectName, cwd, cliDir: ownDir, serverEnv })
    }
  }
  return localConfig
}

// get locat config information
module.exports = function() {
  if (localConfigCache) return localConfigCache
  localConfigCache = defaultsDeep({}, getLocalConfig(localConfigPath), getLocalConfig(baseLocalConfigPath))
  return localConfigCache
}
