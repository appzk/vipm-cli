let engine
let translate3d = false
const docStyle = document.documentElement.style

if (window.opera && Object.prototype.toString.call(window.opera) === '[object Opera]') {
  engine = 'presto'
} else if ('MozAppearance' in docStyle) {
  engine = 'gecko'
} else if ('WebkitAppearance' in docStyle) {
  engine = 'webkit'
} else if (typeof navigator.cpuClass === 'string') {
  engine = 'trident'
}

const helperElem = document.createElement('div')
const vendorPrefix = { trident: 'ms', gecko: 'Moz', webkit: 'Webkit', presto: 'O' }[engine]
const cssPrefix = { trident: '-ms-', gecko: '-moz-', webkit: '-webkit-', presto: '-o-' }[engine]

const perspectiveProperty = engine ? (vendorPrefix + 'Perspective') : 'perspective'
const transformProperty = engine ? (vendorPrefix + 'Transform') : 'transform'
const transformStyleName = (engine ? cssPrefix : '') + 'transform'
const transitionProperty = engine ? (vendorPrefix + 'Transition') : 'transition'
const transitionStyleName = (engine ? cssPrefix : '') + 'transition'
const transitionEndProperty = engine ? (vendorPrefix.toLowerCase() + 'TransitionEnd') : 'transitionEnd'
const transitionDurationProperty = engine ? (vendorPrefix.toLowerCase() + 'TransitionDuration') : 'transitionDuration'

if (helperElem.style[perspectiveProperty] !== undefined) translate3d = true

export default {
  translate3d,
  transformProperty,
  transformStyleName,
  transitionProperty,
  transitionStyleName,
  transitionEndProperty,
  transitionDurationProperty
}
