import assign from 'lodash/assign'
import { assert, type, forEachOrder } from '../yyvip-utils/utils'
import { checkParams, checkFunction } from './mapRequestActionUtils'

function packageApi(commit, opts) {
  const { types = [], request, data, options = {} } = opts
  const { onRequest, onSuccess, onError, onFinish } = options

  assert(type(types) === 'array', 'Every option: types must be a array')

  const [successType, failType, requestType] = types

  checkParams(commit, requestType, data)
  checkFunction(onRequest, { commit }, data)
  return request(data)
    .then(res => {
      typeof res === 'object' && (res.reqData = data)
      checkParams(commit, successType, res)
      checkFunction(onSuccess, { commit }, res)
      checkFunction(onFinish, { commit }, data)
      return res
    })
    .catch(error => {
      typeof error === 'object' && (error.reqData = data)
      checkParams(commit, failType, error)
      checkFunction(onError, { commit }, error)
      checkFunction(onFinish, { commit }, data)
      return error
    })
}

function mapPromises(commit, requests, order, data) {
  const result = []
  forEachOrder(requests, order, (value, key) => {
    assert(type(value) === 'object', 'Every option must be a object')
    assert(type(value.data) === 'undefined', 'Every option: data must be undefined')
    assert(type(value.request) === 'function', 'Every option: request must be a function')
    result.push(packageApi(commit, assign({ data: (data.data || data[key] ? assign({}, data.data, data[key]) : data) }, value)))
  })
  return Promise.all(result)
}

export default async function mapRequestListAction({ commit }, requestsOptions, data = {}) {
  const { types = [], requests = {}, options = {}, order } = requestsOptions
  const { onRequest, onPrefix, onSuccess, onError, onFinish } = options

  assert(type(types) === 'array', 'types must be a array')
  assert(type(requests) === 'object', 'requests must be a object')

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
