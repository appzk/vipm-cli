import Vue from 'vue'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import VueResource from 'vue-resource'
import { type as getType, getContentFromError } from '../yyvip-utils/utils'

Vue.use(VueResource)
Vue.http.options.crossOrigin = true
Vue.http.options.credentials = false

const parse = (type, text) => (res) => {
  try {
    if (res) return res[type]()
  } catch (e) {}
  throw new Error(text)
}

export default class Api {
  constructor(baseUrl = '', validRes, data, headers = {}, opts, text = '请求失败') {
    assign(this, {
      data,
      opts,
      baseUrl,
      validRes,
      errorText: text,
      headers: assign({
        Accept: 'application/json, text/plain, */*'
      }, headers)
    })
  }

  requestPromise(url, type, body = {}, opts, resType = 'json', formType) {
    const data = {}
    forEach(this.data, (item, key) => {
      if (getType(item) === 'function') {
        const value = item(url, body, type, opts)
        value !== undefined && (data[key] = value)
      } else {
        data[key] = item
      }
    })
    if (type === 'post' || type === 'put' || type === 'patch') {
      return Vue.http[type](url, formType ? this.transFromData(assign(data, body)) : assign(data, body), opts).then(parse(resType, this.errorText))
    }
    return Vue.http[type](url, assign({ params: assign(data, body) }, opts)).then(parse(resType, this.errorText))
  }

  request(type, url, data, headers, opts, validRes, resType) {
    const formType = headers && headers['Content-Type'] && headers['Content-Type'].indexOf('multipart/form-data') > -1
    const result = this.requestPromise(`${this.baseUrl}${url}`, type, data, assign({ headers: assign({}, headers, this.headers) }, this.opts, opts), resType, formType)
    if (validRes) return result.then(validRes)
    if (this.validRes) return result.then(this.validRes)
    return result
  }

  transFromData(data) {
    const formData = new FormData()
    for (let key in data) {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    }
    return formData
  }

  get(url, data, headers, opts, validRes, resType) {
    return this.request('get', url, data, headers, opts, validRes, resType)
  }

  post(url, data, headers, opts, validRes, resType) {
    return this.request('post', url, data, headers, opts, validRes, resType)
  }

  jsonp(url, data, headers, opts, validRes, resType) {
    return this.request('jsonp', url, data, headers, opts, validRes, resType)
  }
}

export const validateApi = (judge, resDataKey = 'data', unpack) => unPackRes => {
  let res = unPackRes
  if (getType(unPackRes) === 'object') {
    if (getType(unpack) === 'string') {
      res = unPackRes[unpack]
    } else if (getType(unpack) === 'function') {
      res = unpack(unPackRes)
    }
  }
  if (getType(res) === 'object') {
    if (getType(judge) === 'string') {
      if (res[judge] && res[resDataKey] !== undefined) return (resDataKey ? res[resDataKey] : res)
    } else if (getType(judge) === 'function') {
      if (judge(res)) return (resDataKey ? res[resDataKey] : res)
    }
  }
  let error = new Error(getContentFromError(res))
  if (res) {
    error.res = res
  }
  throw error
}
