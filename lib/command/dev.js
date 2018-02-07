const fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  logger = require('../utils/logger'),
  version = require('./package').version

module.exports = function(env, cmd, serverEnv = 'dev') {
  console.log(`正在使用 vip mobile dev server ${chalk.green(version)} 开发 ${env}，参数${Array.prototype.slice.call(arguments, 1)}`)

  !fs.existsSync('./src') && logger.fatal('出错了～找不到源文件 src 目录！请检查当前路径是否正确！')

  let CONTENT_BASE = {
    dev: process.cwd(),
    test: path.resolve(process.cwd(), 'build'),
    prod: path.resolve(process.cwd(), 'release')
  }

  process.env.CMD_ENV = cmd
  process.env.NODE_ENV = env
  process.env.SERVER_ENV = serverEnv

  process.argv = []
  process.argv.push(
    '--content-base', CONTENT_BASE[env],
    '--config', path.resolve(__dirname, '../webpack/dev.config.js'),
    '--inline'
  )
  require('webpack-dev-server/bin/webpack-dev-server')
}
