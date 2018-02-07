import assign from 'lodash/assign'
import { assert, type, forEachOrder } from '../yyvip-utils/utils'
import { checkParams, checkFunction } from './mapRequestActionUtils'

function packageApi(commit, opts) {
  let requestData = null
  const { dataType, request, data, onData, lastResData, getDataFromLastResData } = opts

  assert(type(dataType) === 'string' || type(dataType) === 'undefined', 'Every option: dataType must be a string or undefined')

  if (getDataFromLastResData) {
    requestData = getDataFromLastResData(lastResData, data)
  } else {
    requestData = data
  }

  return request(requestData)
    .then(res => {
      typeof res === 'object' && (res.reqData = requestData)
      checkParams(commit, dataType, res)
      checkFunction(onData, { commit }, res)
      return res
    })
}

function mapPromises(commit, requests, order, data) {
  let promise = Promise.resolve()
  forEachOrder(requests, order, (value, key) => {
    assert(type(value) === 'object', 'Every option must be a object')
    assert(type(value.data) === 'undefined', 'Every option: data must be undefined')
    assert(type(value.request) === 'function', 'Every option: request must be a function')
    promise = promise.then(res => packageApi(commit, assign({
      lastResData: res,
      data: (data.data || data[key] ? assign({}, data.data, data[key]) : data)
    }, value)))
  })
  return promise
}

export default async function mapRequestQueueAction({ commit }, requestsOptions, data = {}) {
  const { types = [], requests = {}, options = {}, order } = requestsOptions
  const { onRequest, onPrefix, onSuccess, onError, onFinish } = options

  assert(type(types) === 'array', 'types must be a array')
  assert(type(requests) === 'object', 'requests must be a object')
  assert(type(order) === 'array' && order.length, 'order must be a array and at least one element')

  const [successType, failType, requestType] = types

  try {
    checkParams(commit, requestType)
    checkFunction(onRequest, { commit })
    const response = await (onPrefix ? onPrefix(_ => mapPromises(commit, requests, order, data)) : mapPromises(commit, requests, order, data))
    checkParams(commit, successType, response)
    checkFunction(onSuccess, { commit }, response)
    return response
  } catch (error) {
    checkParams(commit, failType, error)
    checkFunction(onError, { commit }, error)
  } finally {
    checkFunction(onFinish, { commit }, data)
  }
}
