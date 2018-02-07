const chalk = require('chalk'),
  prefix = '  vipm-cli',
  sep = chalk.gray('·')

function loggerCreator(isException) {
  return function(msg) {
    if (isException) {
      console.error(chalk.red(prefix), sep, msg)
      process.exit(1)
    }
    console.log(chalk.white(prefix), sep, msg)
  }
}

module.exports = {
  log: loggerCreator(false),
  fatal: loggerCreator(true),
  success: loggerCreator(false),
}
