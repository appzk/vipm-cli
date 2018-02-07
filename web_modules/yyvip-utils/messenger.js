import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import { assert, type } from './utils'

const supportPostMessage = 'postMessage' in window

class Target {
  constructor(target, name, prefix) {
    assert(arguments.length >= 3, 'target error - target, name are both requied')
    assert(typeof target === 'object', 'target error - target itself must be window object')
    assert(type(name) === 'string', 'target error - target name must be string type')
    assign(this, { target, name, prefix })
  }

  send(msg) {
    if (supportPostMessage) {
      this.target.postMessage(this.prefix + msg, '*')
    } else {
      const targetFunc = window.navigator[this.prefix + this.name]
      if (type(targetFunc) === 'function') {
        targetFunc(this.prefix + msg, window)
      } else {
        throw new Error('target callback function is not defined')
      }
    }
  }
}

export default class Messenger {
  constructor(name, prefix) {
    assert(type(prefix) === 'string', 'messenger error - prefix must be string type')
    assert(type(name) === 'string', 'messenger error - messenger name must be string type')
    assign(this, { prefix, name })
    this.targets = {}
    this.listenFunc = []
    this.initListen()
  }

  addTarget(target, name) {
    this.targets[name] = new Target(target, name, this.prefix)
  }

  listen(callback) {
    this.listenFunc.push(callback)
  }

  clear() {
    this.listenFunc = []
  }

  send(msg) {
    for (let key in this.targets) {
      if (this.targets.hasOwnProperty(key)) this.targets[key].send(msg)
    }
  }

  initListen() {
    const generalCallback = msg => {
      if (typeof msg === 'object' && msg.data) {
        const data = msg.data
        if (type(data) === 'string') {
          const result = data.slice(this.prefix.length)
          forEach(this.listenFunc, value => value(result))
        }
      }
    }
    if (supportPostMessage) {
      if ('addEventListener' in document) {
        window.addEventListener('message', generalCallback, false)
      } else if ('attachEvent' in document) {
        window.attachEvent('onmessage', generalCallback)
      }
    } else {
      window.navigator[this.prefix + this.name] = generalCallback
    }
  }
}
