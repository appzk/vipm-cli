import React from 'react'
import keys from 'lodash/keys'
import pick from 'lodash/pick'
import { render } from 'react-dom'
import assign from 'lodash/assign'

const reactInstance = {}

function newInstance(key, Component, fixedScript) {
  return function(opts) {
    const element = document.createElement('div')
    document.body.appendChild(element)
    render(<Component ref={ target => (reactInstance[key] = target) } />, element, function() {
      if (typeof fixedScript === 'function') fixedScript(reactInstance[key], opts)
    })
  }
}

export default function initInstance(key, component, defaultOpts, fixedScript, onUpdate) {
  return function(opts) {
    const pickedItems = assign({}, defaultOpts, pick(opts, keys(defaultOpts)))
    if (!reactInstance[key]) {
      newInstance(key, component, fixedScript)(pickedItems)
    } else if (typeof onUpdate !== 'function') {
      reactInstance[key].setState(pickedItems)
    } else {
      onUpdate(reactInstance[key], pickedItems)
    }
  }
}
