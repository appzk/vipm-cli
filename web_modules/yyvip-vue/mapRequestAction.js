import { assert, type } from '../yyvip-utils/utils'
import { checkParams, checkFunction } from './mapRequestActionUtils'

export default async function mapRequestAction({ commit }, requestOptions) {
  const { types = [], request, data = {}, options = {} } = requestOptions
  const { onRequest, onSuccess, onError, onFinish } = options

  assert(type(types) === 'array', 'types must be a array')
  assert(type(request) === 'function', 'request must be a function')

  const [successType, failType, requestType] = types

  try {
    checkParams(commit, requestType, data)
    checkFunction(onRequest, { commit }, data)
    const res = await request(data)
    typeof res === 'object' && (res.reqData = data)
    checkParams(commit, successType, res)
    checkFunction(onSuccess, { commit }, res)
    return res
  } catch (error) {
    typeof error === 'object' && (error.reqData = data)
    checkParams(commit, failType, error)
    checkFunction(onError, { commit }, error)
  } finally {
    checkFunction(onFinish, { commit }, data)
  }
}
