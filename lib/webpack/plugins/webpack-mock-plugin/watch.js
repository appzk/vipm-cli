const path = require('path')
const chokidar = require('chokidar')
const { EventEmitter } = require('events')
const { cwd, ownDir } = require('./utils')
const childProcess = require('child_process')

const event = new EventEmitter()
const mockConfigPath = cwd('mock.config.js')
const baseMockConfigPath = cwd('../mock.config.js')

function onFileChange() {
  const child = forkChild()

  event.on('killChild', function() {
    child.kill('SIGKILL')
    event.removeAllListeners('killChild')
  })
}

function forkChild() {
  let child = childProcess.fork(ownDir('server.js'), [], {
    encoding: 'utf8',
    execArgv: process.execArgv
  })

  child.on('error', (data) => {
    console.log(`Express server exited with error ${data.toString()}`)
  })

  child.on('exit', (code) => {
    console.log(`Express server exited with code ${code || 0}`)
  })
  return child
}

module.exports = function() {
  onFileChange()
  chokidar.watch([mockConfigPath, baseMockConfigPath], { persistent: true }).on('change', () => {
    event.emit('killChild')
    setTimeout(onFileChange, 10)
  })
}
