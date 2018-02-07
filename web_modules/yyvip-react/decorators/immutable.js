import Immutable from 'immutable'
import indexOf from 'lodash/indexOf'
import React, { Component } from 'react'

const is = Immutable.is.bind(Immutable)

function shallowEqualImmutable(objA, objB, ignoreKeys) {
  if (objA === objB || is(objA, objB)) {
    return true
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i]
    if (!(Object.prototype.hasOwnProperty.bind(objB)(keyA)) || !is(objA[keyA], objB[keyA])) {
      if (!Array.isArray(ignoreKeys) || indexOf(ignoreKeys, keyA) === -1) return false
    }
  }

  return true
}

export function immutableRenderDecorator(ignoreKeys) {
  return (Target) => class Wrapper extends Component {
    shouldComponentUpdate(nextProps, nextState) {
      return !shallowEqualImmutable(this.state, nextState) || !shallowEqualImmutable(this.props, nextProps, ignoreKeys)
    }

    render() {
      return React.createElement(Target, this.props, this.props.children)
    }
  }
}
