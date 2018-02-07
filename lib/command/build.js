const fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  logger = require('../utils/logger'),
  version = require('./package').version

module.exports = function(env, query, isZip) {
  console.log(`正在使用 vip mobile cli ${chalk.green(version)} 编译 ${env}，参数${Array.prototype.slice.call(arguments, 1)}`)

  !fs.existsSync('./src') && logger.fatal('出错了～找不到源文件 src 目录！请检查当前路径是否正确！')

  process.env.NODE_ENV = env
  process.env.IS_ZIP = isZip

  process.argv = []
  process.argv.push(
    '--env', env,
    '--config', path.resolve(__dirname, '../webpack/prod.config.js')
  )
  require('webpack/bin/webpack')
}
