const chalk = require('chalk'),
  shell = require('shelljs'),
  inquirer = require('inquirer'),
  logger = require('../utils/logger'),
  version = require('./package').version

const cmdDev = require('./dev'),
  cmdInit = require('./init'),
  cmdBuild = require('./build')

function processCmd(cmd) {
  switch (cmd) {
    case 'init':
      cmdInit()
      break
    case 'dev_dev':
      cmdDev('dev')
      break
    case 'build_test':
      cmdBuild('test')
      break
    case 'build_prod':
      cmdBuild('prod')
      break
    case 'dev_test':
      cmdDev('test')
      break
    case 'dev_prod':
      cmdDev('prod')
      break
    default:
      shell.exit(0)
      break
  }
}

module.exports = function() {
  console.log(chalk.bold('欢迎使用 vip mobile cli！'))
  console.log(`当前版本：${chalk.green(version)}`)
  console.log('\n')
  console.log(`生成种子项目可以直接执行：${chalk.green.bold('vipm init')} 或 ${chalk.green.bold('vipm i')}`)
  console.log(`启动服务可以直接执行：${chalk.yellow.bold('vipm dev')} 或 ${chalk.yellow.bold('vipm d')}`)
  console.log(`构建发布任务可以直接执行：${chalk.yellow.bold('vipm build')} 或 ${chalk.yellow.bold('vipm build')}`)
  console.log('\n')
  console.log(`启动服务命令：${chalk.yellow.bold('vipm dev [env]')} 或 ${chalk.yellow.bold('vipm d [env]')}`)
  console.log(`启动服务参数：${chalk.yellow.bold('[dev, test, prod]')}，参数默认值：${chalk.yellow.bold('dev')}`)
  console.log('\n')
  console.log(`构建发布任务命令：${chalk.yellow.bold('vipm build [env]')} 或 ${chalk.yellow.bold('vipm b [env]')}`)
  console.log(`构建发布任务参数：${chalk.yellow.bold('[test, prod]')}，参数默认值：${chalk.yellow.bold('test')}`)
  console.log('\n')

  const question = {
    type: 'rawlist',
    name: 'mode',
    message: '请选择任务：',
    default: 6,
    choices: [{
      value: 'init',
      name: '生成种子项目（初始用）'
    }, {
      value: 'dev_dev',
      name: '开发（开发用，开发环境代码，其实就是env=dev）'
    }, {
      value: 'build_test',
      name: '构建（构建测试环境任务用，产生 build 目录）'
    }, {
      value: 'build_prod',
      name: '构建（构建正式环境任务用，产生 release 目录）'
    }, {
      value: 'dev_test',
      name: '启动服务（开发用，测试环境代码，其实就是env=test）'
    }, {
      value: 'dev_prod',
      name: '启动服务（开发用，正式环境代码，其实就是env=prod）'
    }, {
      value: 'exit',
      name: '退出（Bye bye）'
    }]
  }

  inquirer.prompt([question]).then((answers) => {
    processCmd(answers.mode)
  })
}
