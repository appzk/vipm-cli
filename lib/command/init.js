const ora = require('ora'),
  shell = require('shelljs'),
  inquirer = require('inquirer'),
  logger = require('../utils/logger')

function randomProjectName() {
  let dt = new Date()
  let yymm = (dt.getFullYear() + '').substring(2) + ((dt.getMonth() + 1 < 9 ? '0' : '') + (dt.getMonth() + 1))
  return yymm + String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0)) + Math.floor(Math.random() * 10)
}

function cloneRepo(projectType, projectName) {
  const spinner = ora('clone template')
  return new Promise(function(resolve, reject) {
    spinner.start()
    shell.exec(`git clone https://github.com/yyfrontend/${projectType}.git ${projectName}`, { silent: false }, (code) => {
      spinner.stop()
      if (code === 0) {
        resolve(projectName)
      } else {
        reject(projectName)
      }
    })
  })
}

module.exports = function() {
  if (!shell.which('git')) logger.fatal('找不到 git 命令，请先安装 git！')

  const questions = [{
    default: 1,
    type: 'rawlist',
    name: 'projectType',
    message: '请选择项目类型：',
    choices: [{
      value: 'seed-zepto-simple',
      name: 'Zepto模板'
    }, {
      value: 'seed-vue-mobile-simple',
      name: 'Vue2模板'
    }, {
      value: 'seed-vue-mobile-spa',
      name: 'Vue2 with Router模板'
    }, {
      value: 'seed-react-mobx-spa',
      name: 'React-Mobx模板'
    }, {
      value: 'seed-react-mobx-spa-pc',
      name: 'React-Mobx模板-PC'
    }, {
      value: 'seed-react-spa',
      name: 'React-Redux模板'
    }, {
      value: 'seed-mobile-text',
      name: '长文本页面'
    }, {
      value: 'seed-bilin-rank',
      name: '比邻app内嵌榜单'
    }]
  }, {
    type: 'input',
    name: 'projectName',
    message: '请输入项目名称：（默认【mmdd+3随机数】）',
    default: randomProjectName()
  }]

  inquirer.prompt(questions)
    .then((answers) => {
      const { projectType, projectName } = answers
      return cloneRepo(projectType, projectName)
    })
    .then(function(projectName) {
      shell.cd(projectName)
      shell.rm('-rf', '.git')
      shell.rm('-rf', '.gitignore')
      shell.rm('-rf', '.editorconfig')
      logger.success(`项目创建成功！已生成 ${projectName} 目录！`)
    }, function(projectName) {
      logger.fatal(`${projectName} 创建失败`)
    })
}
