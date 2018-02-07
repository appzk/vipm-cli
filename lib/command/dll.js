const path = require('path'),
  chalk = require('chalk'),
  version = require('./package').version

module.exports = function(env, cmd) {
  console.log(`正在使用 vip mobile cli ${chalk.green(version)} 编译 dll ${env}`)

  process.env.NODE_ENV = env
  process.env.CMD_ENV = cmd

  process.argv = []
  process.argv.push(
    '--env', env,
    '--config', path.resolve(__dirname, '../webpack/dll.config.js')
  )
  require('webpack/bin/webpack')
}
