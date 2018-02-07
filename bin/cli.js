#!/usr/bin/env node

const program = require('commander'),
  cmdDll = require('../lib/command/dll'),
  cmdDev = require('../lib/command/dev'),
  cmdInit = require('../lib/command/init'),
  cmdBuild = require('../lib/command/build'),
  cmdPrompt = require('../lib/command/prompt')

program
  .version(require('../package').version)
program
  .command('dev').alias('d').action(cmd => {
    action(cmdDev, cmd, 'dev', ['dev', 'test', 'prod'], 'dev')
  })
program
  .command('init').alias('i').action(() => {
    cmdInit()
  })
program
  .command('build').alias('b').action(cmd => {
    action(cmdBuild, cmd, 'test', ['test', 'prod'])
  })
program
  .command('dll').action((cmd) => {
    action(cmdDll, cmd, 'dev', ['dev', 'test', 'prod'])
  })
program
  .command('ddll').action((cmd) => {
    action(cmdDll, cmd, 'test', ['test', 'prod'], 'dev')
  })

function assert(condition, msg) {
  if (!condition) throw new Error(`[vipm] ${msg}`)
}

function action(func, env, defalutValue, envs, query = '') {
  if (typeof env === 'string') {
    if (env.indexOf('-') !== -1) {
      const envArray = env.split('-')
      assert(envs.indexOf(envArray[0]) !== -1, `env must be ${envs.toString()}`)
      envArray.splice(1, 0, query)
      func.apply(null, envArray)
    } else {
      assert(envs.indexOf(env) !== -1, `env must be ${envs.toString()}`)
      func(env, query)
    }
  } else {
    func(defalutValue, query)
  }
}

function Prompt() {
  program.parse(process.argv)
  if (program.args.length < 1) cmdPrompt()
}
Prompt()
