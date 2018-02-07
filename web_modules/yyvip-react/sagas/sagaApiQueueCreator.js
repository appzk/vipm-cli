import assign from 'lodash/assign'
import { showToast } from '../actions/toast'
import { call, put, fork } from 'redux-saga/effects'
import { type, assert } from '../../yyvip-utils/utils'
import { showPageLoading, hidePageLoading } from '../actions/pageLoading'

function *sagaApis(apis, order, params, action) {
  let requestData = null
  let lastResData = null
  for (let i = 0; i < order.length; i++) {
    const key = order[i]
    const { api, dataType, onData, getDataFromLastResData } = apis[key]
    const paramsData = params.data || params[key] ? assign({}, params.data, params[key]) : params
    if (getDataFromLastResData) {
      requestData = getDataFromLastResData(lastResData, paramsData)
    } else {
      requestData = paramsData
    }
    lastResData = yield call(api, requestData)
    if (dataType) yield put({ type: dataType, payload: lastResData, ext: params })
    if (onData) yield fork(onData, lastResData, params, action)
  }
}

export default function sagaApiQueueCreator(opts) {
  return function* sagaQueueApi(action) {
    let { payload: params } = action
    const { apis, order, handleParams, loading, toast, toastText, successType, errorType, onBefore, onSuccess, onError, onEnd } = opts
    assert(type(order) === 'array' && order.length, 'order must be a array and at least one element')
    if (type(handleParams) === 'function') params = handleParams(params)
    try {
      if (loading) yield put(showPageLoading())
      if (onBefore) yield fork(onBefore, params, action)
      yield call(sagaApis, apis, order, params, action)
      if (onSuccess) yield fork(onSuccess, params, action)
      if (successType) yield put({ type: successType, payload: null, ext: params })
    } catch (error) {
      if (onError) yield fork(onError, error, params, action)
      if (errorType) yield put({ type: errorType, payload: error, ext: params })
      if (toast) yield put(showToast({ content: toastText || error.message }))
    } finally {
      if (onEnd) yield fork(onEnd, params, action)
      if (loading) yield put(hidePageLoading())
    }
  }
}
