import Vue from 'vue'
import keys from 'lodash/keys'
import pick from 'lodash/pick'
import assign from 'lodash/assign'

const vueInstance = {}

function newInstance(key, component, fixedScript) {
  return function(opts) {
    const ComponentConstructor = Vue.extend(component)
    vueInstance[key] = new ComponentConstructor({
      propsData: opts,
      el: document.createElement('div')
    })
    if (typeof fixedScript === 'function') fixedScript(vueInstance[key], opts)
    document.body.appendChild(vueInstance[key].$el)
  }
}

export default function initInstance(key, component, defaultOpts, fixedScript, onUpdate) {
  return function(opts) {
    const pickedItems = assign({}, defaultOpts, pick(opts, keys(defaultOpts)))
    if (!vueInstance[key]) {
      newInstance(key, component, fixedScript)(pickedItems)
    } else if (typeof onUpdate !== 'function') {
      assign(vueInstance[key], pickedItems)
    } else {
      onUpdate(vueInstance[key], pickedItems)
    }
  }
}
