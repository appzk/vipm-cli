import { type } from './utils'

let count = 0

function noop() {}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - prefix {String} qs parameter (`__jp`)
 *  - name {String} qs parameter (`prefix` + incr)
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */
export default function jsonp(url, opts, fn) {
  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }
  if (!opts) opts = {}

  let timer
  const param = opts.param || 'callback'
  const script = document.createElement('script')
  const timeout = type(opts.timeout) === 'number' ? opts.timeout : 30000
  const id = opts.name || ((opts.prefix || '__jp') + (count++))
  const target = document.getElementsByTagName('script')[0] || document.head

  if (timeout) {
    timer = setTimeout(() => {
      cleanup()
      if (fn) fn(new Error('Timeout'))
    }, timeout)
  }

  function cleanup(notNeedFn) {
    if (!notNeedFn && typeof script.jsonp === 'undefined') {
      if (fn) fn(new Error('error'))
    }
    if (script.clearAttributes) {
      script.clearAttributes()
    } else {
      script.onload = script.onreadystatechange = script.onerror = null
    }
    if (script.parentNode) script.parentNode.removeChild(script)
    if (timer) clearTimeout(timer)
    window[id] = noop
  }

  function cancel() {
    if (window[id]) cleanup(true)
  }

  window[id] = function(data) {
    script.jsonp = 1
    if (fn) fn(null, data)
  }

  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + encodeURIComponent(id)
  url = url.replace('?&', '?')

  script.onerror = () => cleanup()
  script.onload = () => cleanup()
  script.onreadystatechange = () => {
    if (script.readyState === 'loaded' || script.readyState === 'complete') cleanup()
  }

  script.src = url
  target.parentNode.insertBefore(script, target)

  return cancel
}
