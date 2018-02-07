import forEach from 'lodash/forEach'
import indexOf from 'lodash/indexOf'
import React, { Component } from 'react'
import { type } from '../../yyvip-utils/utils'

const lifeCycleName = ['componentWillMount', 'render', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount']

function isReactComponentInstance(component) {
  return component && component.props !== undefined && component.state !== undefined
}

export function componentPropsIf(validity, onNot) {
  return (target, name, descriptor) => {
    const oldValue = descriptor.value

    descriptor.value = function() {
      let doOldValue = false
      if (!isReactComponentInstance(this)) {
        doOldValue = true
      } else if (type(validity) === 'function') {
        doOldValue = validity(this.props, this.state, ...arguments)
      } else {
        doOldValue = true
      }
      if (doOldValue) return oldValue.apply(this, arguments)
      if (type(onNot) === 'function') return onNot()
      return onNot
    }

    return descriptor
  }
}

export function debugLifeCycle(target) {
  if (process.env.NODE_ENV !== 'production') {
    forEach(lifeCycleName, (prop) => {
      const oldFunction = target.prototype[prop]
      if (type(oldFunction) === 'function') {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, prop)
        const oldValue = descriptor.value

        descriptor.value = function() {
          console.log(`%c ${target.name} LifeCycle: ${prop}`, 'color: #4CAF50; font-weight: bold')
          if (arguments && arguments.length) console.log('%c arguments', 'color: #03A9F4; font-weight: bold', ...arguments)
          console.log('%c props', 'color: #03A9F4; font-weight: bold', this.props)
          if (this.state) console.log('%c state', 'color: #03A9F4; font-weight: bold', this.state)
          return oldValue.apply(this, arguments)
        }

        Object.defineProperty(target.prototype, prop, descriptor)

        return descriptor
      }
    })
  }
}

function is(x, y) {
  if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y
  // eslint-disable-next-line
  return x !== x || y !== y
}

function shallowEqual(objA, objB, ignoreKeys) {
  if (is(objA, objB)) return true
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i]
    if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !is(objA[keyA], objB[keyA])) {
      if (!Array.isArray(ignoreKeys) || indexOf(ignoreKeys, keyA) === -1) return false
    }
  }

  return true
}

export function pureRenderDecorator(ignoreKeys) {
  return (Target) => class Wrapper extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqual(this.state, nextState) || !shallowEqual(this.props, nextProps, ignoreKeys)
    }

    render() {
      return React.createElement(Target, this.props, this.props.children)
    }
  }
}
