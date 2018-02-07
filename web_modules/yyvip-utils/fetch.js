import 'isomorphic-fetch'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import fetchJsonp from 'fetch-jsonp'
import { stringify } from 'querystring'
import { type as getType, getContentFromError } from '../yyvip-utils/utils'

let errorText = '请求失败'
const parse = (type) => (response) => {
  try {
    if (response) return response[type]()
  } catch (e) {}
  throw new Error(errorText)
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) return response
  throw new Error(errorText)
}

export default class FetchReq {
  constructor(baseUrl = '', validRes, data, headers = {}, opts, text) {
    this.data = data
    this.baseUrl = baseUrl
    this.validRes = validRes
    this.headers = assign({
      Accept: 'application/json, text/plain, */*'
    }, headers)
    this.opts = assign({
      mode: 'cors'
    }, opts)
    text && (errorText = text)
  }

  assignData(url, body, type, opts) {
    const data = {}
    forEach(this.data, (item, key) => {
      if (getType(item) === 'function') {
        const value = item(url, body, type, opts)
        value !== undefined && (data[key] = value)
      } else {
        data[key] = item
      }
    })
    return assign(data, body)
  }

  requestPromise(request, validRes, type) {
    const result = fetch(request)
      .then(checkStatus)
      .then(parse(type))
    if (validRes) return result.then(validRes)
    if (this.validRes) return result.then(this.validRes)
    return result
  }

  get(url, data, headers, opts, validRes, type = 'json') {
    const requestOpts = assign({
      method: 'GET',
      headers: new Headers(assign({}, headers, this.headers))
    }, this.opts, opts)
    return this.requestPromise(new Request(`${this.baseUrl}${url}${data ? ('?' + stringify(this.assignData(url, data, 'get', opts))) : ''}`, requestOpts), validRes, type)
  }

  post(url, data, headers, opts, validRes, type = 'json') {
    const requestOpts = assign({
      method: 'POST',
      headers: new Headers(assign({
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }, headers, this.headers))
    }, this.opts, opts)
    if (data) requestOpts.body = stringify(this.assignData(url, data, 'post', opts))
    return this.requestPromise(new Request(`${this.baseUrl}${url}`, requestOpts), validRes, type)
  }

  postJson(url, data, headers, opts, validRes, type = 'json') {
    const requestOpts = assign({
      method: 'POST',
      headers: new Headers(assign({
        'Content-Type': 'application/json;charset=utf-8'
      }, headers, this.headers))
    }, this.opts, opts)
    if (data) requestOpts.body = JSON.stringify(this.assignData(url, data, 'post', opts))
    return this.requestPromise(new Request(`${this.baseUrl}${url}`, requestOpts), validRes, type)
  }

  jsonp(url, data, opts, validRes) {
    const requestOpts = assign({
      timeout: 30000
    }, opts)
    let result = fetchJsonp(`${this.baseUrl}${url}${data ? ('?' + stringify(this.assignData(url, data, 'jsonp', opts))) : ''}`, requestOpts)
      .then(response => {
        if (response.ok) return response
        throw new Error(errorText)
      })
      .then(parse('json'))
    if (validRes) return result.then(validRes)
    if (this.validRes) return result.then(this.validRes)
    return result
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
  throw new Error(getContentFromError(res))
}
