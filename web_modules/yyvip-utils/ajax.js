import assign from 'lodash/assign'
import { serialize } from './utils'

const blankRE = /^\s*$/
const htmlType = 'text/html'
const jsonType = 'application/json'
const escape = encodeURIComponent
const xmlTypeRE = /^(?:text|application)\/xml/i
const scriptTypeRE = /^(?:text|application)\/javascript/i

const accepts = {
  json: jsonType,
  html: htmlType,
  text: 'text/plain',
  xml: 'application/xml, text/xml',
  script: 'text/javascript, application/javascript'
}

function appendQuery(url, query) {
  return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}

function getParam(obj) {
  const params = []
  params.add = function(k, v) {
    this.push(escape(k) + '=' + escape(v))
  }
  serialize(params, obj)
  return params.join('&').replace(/%20/g, '+')
}

function empty() {}

function mimeToDataType(mime) {
  if (mime) mime = mime.split(';', 2)[0]
  return mime && (mime === htmlType ? 'html' : mime === jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text'
}

export default function ajax(opts = {}) {
  let { url, data, dataType, headers = {}, crossDomain } = opts
  const { type = 'GET', async = true, cache = true, contentType, timeout = 0 } = opts

  if (!crossDomain) crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(url) && RegExp.$2 !== window.location.host

  data = getParam(data)
  url = url || window.location.toString()
  if (data && (type.toUpperCase() === 'GET')) url = appendQuery(url, data)

  if (cache === false) url = appendQuery(url, '_=' + Date.now())

  let abortTimeout
  const baseHeaders = {}
  let mime = accepts[dataType]
  const xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new window.ActiveXObject('Microsoft.XMLHTTP')

  if (!crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
  if (mime) {
    baseHeaders['Accept'] = mime
    if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
    xhr.overrideMimeType && xhr.overrideMimeType(mime)
  }

  if (contentType || (contentType !== false && data && type.toUpperCase() !== 'GET')) {
    baseHeaders['Content-Type'] = (contentType || 'application/x-www-form-urlencoded')
  }
  headers = assign(baseHeaders, headers)

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      let result
      let error = false
      clearTimeout(abortTimeout)
      xhr.onreadystatechange = empty
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
        result = xhr.responseText

        try {
          if (dataType === 'script')(1, eval)(result)
          else if (dataType === 'xml') result = xhr.responseXML
          else if (dataType === 'json') result = blankRE.test(result) ? null : JSON.parse(result)
        } catch (e) {
          error = e
        }
        if (error) ajaxError(error, 'parsererror', xhr, opts)
        else ajaxSuccess(result, xhr, opts)
      } else {
        ajaxError(null, xhr.status ? 'error' : 'abort', xhr, opts)
      }
    }
  }

  xhr.open(type, url, async)

  for (const name in headers) xhr.setRequestHeader(name, headers[name])

  if (timeout > 0) {
    abortTimeout = setTimeout(function() {
      xhr.onreadystatechange = empty
      xhr.abort()
      ajaxError(null, 'timeout', xhr, opts)
    }, timeout)
  }

  xhr.send(data || null)
  return xhr
}

function ajaxSuccess(data, xhr, opts) {
  opts.success && opts.success.call(opts.context, data, 'success', xhr)
  ajaxComplete('success', xhr, opts)
}

function ajaxError(error, type, xhr, opts) {
  opts.error && opts.error.call(opts.context, xhr, type, error)
  ajaxComplete(type, xhr, opts)
}

function ajaxComplete(status, xhr, opts) {
  opts.complete && opts.complete.call(opts.context, xhr, status)
}
