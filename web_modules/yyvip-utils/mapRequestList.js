import assign from 'lodash/assign'
import { assert, type, forEachOrder, checkFunction } from './utils'

function packageApi(opts) {
  const { request, data, options = {} } = opts
  const { onRequest, onSuccess, onError, onFinish } = options

  checkFunction(onRequest, data)
  return request(data)
    .then(res => {
      typeof res === 'object' && (res.reqData = data)
      checkFunction(onSuccess, res)
      checkFunction(onFinish, data)
    })
    .catch(error => {
      typeof error === 'object' && (error.reqData = data)
      checkFunction(onError, error)
      checkFunction(onFinish, data)
    })
}

function mapPromises(requests, order, data) {
  const result = []
  forEachOrder(requests, order, (value, key) => {
    assert(type(value) === 'object', 'Every option must be a object')
    assert(type(value.data) === 'undefined', 'Every option: data must be undefined')
    assert(type(value.request) === 'function', 'Every option: request must be a function')
    result.push(packageApi(assign({ data: (data.data || data[key] ? assign({}, data.data, data[key]) : data) }, value)))
  })
  return Promise.all(result)
}

export function mapResourceList(requestsOptions) {
  const { requests = {}, options = {}, order } = requestsOptions
  const { onRequest, onPrefix, onSuccess, onError, onFinish } = options

  assert(type(requests) === 'object', 'requests must be a object')

  return async function doList(data = {}) {
    try {
      checkFunction(onRequest)
      const response = await (onPrefix ? onPrefix(_ => mapPromises(requests, order, data)) : mapPromises(requests, order, data))
      checkFunction(onSuccess, response)
      return response
    } catch (error) {
      checkFunction(onError, error)
    } finally {
      checkFunction(onFinish, data)
    }
  }
}

function packageApiQueue(opts) {
  let requestData = null
  const { request, data, onData, lastResData, getDataFromLastResData } = opts

  if (getDataFromLastResData) {
    requestData = getDataFromLastResData(lastResData, data)
  } else {
    requestData = data
  }

  return request(requestData)
    .then(res => {
      typeof res === 'object' && (res.reqData = data)
      checkFunction(onData, res)
      return res
    })
}

function mapPromisesQueue(requests, order, data) {
  let promise = Promise.resolve()
  forEachOrder(requests, order, (value, key) => {
    assert(type(value) === 'object', 'Every option must be a object')
    assert(type(value.data) === 'undefined', 'Every option: data must be undefined')
    assert(type(value.request) === 'function', 'Every option: request must be a function')
    promise = promise.then(res => packageApiQueue(assign({
      lastResData: res,
      data: (data.data || data[key] ? assign({}, data.data, data[key]) : data)
    }, value)))
  })
  return promise
}

export function mapResourceQueue(requestsOptions) {
  const { requests = {}, options = {}, order } = requestsOptions
  const { onRequest, onPrefix, onSuccess, onError, onFinish } = options

  assert(type(requests) === 'object', 'requests must be a object')
  assert(type(order) === 'array' && order.length, 'order must be a array and at least one element')

  return async function doQueue(data = {}) {
    try {
      checkFunction(onRequest)
      const response = await (onPrefix ? onPrefix(_ => mapPromisesQueue(requests, order, data)) : mapPromisesQueue(requests, order, data))
      checkFunction(onSuccess, response)
      return response
    } catch (error) {
      checkFunction(onError, error)
    } finally {
      checkFunction(onFinish, data)
    }
  }
}

export async function mapResource(requestsOptions) {
  const { request, data, options = {} } = requestsOptions
  const { onRequest, onSuccess, onError, onFinish } = options
  try {
    checkFunction(onRequest)
    const response = await request(data)
    checkFunction(onSuccess, response)
    return response
  } catch (error) {
    checkFunction(onError, error)
  } finally {
    checkFunction(onFinish, data)
  }
}
