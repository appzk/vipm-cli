const chalk = require('chalk')
const shell = require('shelljs')

function exec(cmd, options = {}) {
  return new Promise((resolve, reject) => {
    shell.exec(cmd, options, (code, stdout, stderr) => {
      if (code !== 0) {
        reject(new Error(stderr))
      } else {
        resolve(new shell.ShellString(stdout, stderr, code))
      }
    })
  })
}

module.exports = function(msg) {
  // 没有提交信息
  if (!msg) {
    console.log(chalk.red('请使用 -m 填写提交信息！'))
    console.log(`${chalk.blue('例子：')}vipm p -m "xxx"`)
    shell.exit(1)
  }

  // 没有 git 命令
  if (!shell.which('git')) {
    console.log(chalk.red('找不到 git 命令，请先安装 git！'))
    shell.exit(1)
  }

  // 分支名称
  let branch
  // 命令流程
  return exec('git branch', {
      silent: true
    })
    .then((res) => {
      branch = res.stdout.match(/\*\s.*(?=\n)/)[0].replace(/\*\s/, '')

      console.log(`当前分支为：${chalk.green(branch)}`)
      console.log(`正在执行 ${chalk.cyan('git add .')}`)
      return exec('git add .', {
        silent: true
      })
    })
    .then(() => {
      console.log(`${chalk.green('git add 成功！')}`)
      console.log(`正在执行 ${chalk.cyan('git commit -m "')}${chalk.cyan(msg)}${chalk.cyan('"')}`)
      return exec(`git commit -m "${msg}"`, {
        silent: true
      })
    })
    .then(() => {
      console.log(`${chalk.green('git commit 成功！')}`)
      console.log(`正在执行 ${chalk.cyan('git push origin')} ${chalk.cyan(branch)}`)
      return exec(`git push origin ${branch}`, {
        silent: true
      })
    })
    .then(() => {
      console.log(`${chalk.green('git push 成功！')}`)
      console.log('\n')
      console.log(`${chalk.green('vipm p 命令成功完成！')}`)
      console.log('\n')
    })
    .catch((err) => {
      console.log(chalk.red('出错了！错误信息如下：'))
      console.log(err)
    })
}
