import { getScale, getDpr, getRem } from './utils'

let tid
let dpr = getDpr(0)
let scale = getScale(0)
let metaElement = document.querySelector('meta[name="viewport"]')

const documentElement = document.documentElement

if (!dpr && !scale) {
  const devicePixelRatio = window.devicePixelRatio
  if (window.navigator.appVersion.match(/iphone/gi)) {
    if (devicePixelRatio >= 3) {
      dpr = 3
    } else if (devicePixelRatio >= 2) {
      dpr = 2
    } else {
      dpr = 1
    }
  } else {
    dpr = 1
  }
  scale = 1 / dpr
}

documentElement.setAttribute('data-dpr', dpr)
if (!metaElement) {
  metaElement = document.createElement('meta')
  metaElement.setAttribute('name', 'viewport')
  metaElement.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no')
  documentElement.firstElementChild.appendChild(metaElement)
}

function refreshRem() {
  documentElement.style.fontSize = getRem() + 'px'
}

window.addEventListener('resize', function() {
  clearTimeout(tid)
  tid = setTimeout(refreshRem, 300)
}, false)
window.addEventListener('pageshow', function(e) {
  if (e.persisted) {
    clearTimeout(tid)
    tid = setTimeout(refreshRem, 300)
  }
}, false)

if (document.readyState === 'complete') {
  document.body.style.fontSize = 12 * dpr + 'px'
} else {
  document.addEventListener('DOMContentLoaded', function(e) {
    document.body.style.fontSize = 12 * dpr + 'px'
  }, false)
}

refreshRem()
