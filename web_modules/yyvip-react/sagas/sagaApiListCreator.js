import assign from 'lodash/assign'
import { showToast } from '../actions/toast'
import { type, mapOrder } from '../../yyvip-utils/utils'
import { all, call, put, fork } from 'redux-saga/effects'
import { showPageLoading, hidePageLoading } from '../actions/pageLoading'

function *sagaApi(opts, params, action) {
  const { api, toast, toastText, requestType, successType, errorType, onBefore, onSuccess, onError, onEnd } = opts
  try {
    if (onBefore) yield fork(onBefore, params, action)
    if (requestType) yield put({ type: requestType, ext: params })
    const data = yield call(api, params)
    if (successType) yield put({ type: successType, payload: data, ext: params })
    if (onSuccess) yield fork(onSuccess, data, params, action)
  } catch (error) {
    if (toast) yield put(showToast({ content: toastText || error.message }))
    if (errorType) yield put({ type: errorType, payload: error, ext: params })
    if (onError) yield fork(onError, error, params, action)
  } finally {
    if (onEnd) yield fork(onEnd, params, action)
  }
}

export default function sagaApiListCreator(opts) {
  return function* sagaListApi(action) {
    let { payload: params } = action
    const { apis, order, handleParams, loading, toast, toastText, successType, errorType, onBefore, onSuccess, onError, onEnd } = opts
    if (type(handleParams) === 'function') params = handleParams(params)
    try {
      if (loading) yield put(showPageLoading())
      if (onBefore) yield fork(onBefore, params, action)
      const data = yield all(mapOrder(apis, order, (value, key) => call(sagaApi, value, (params.data || params[key] ? assign({}, params.data, params[key]) : params), action)))
      if (successType) yield put({ type: successType, payload: data, ext: params })
      if (onSuccess) yield fork(onSuccess, data, params, action)
    } catch (error) {
      if (toast) yield put(showToast({ content: toastText || error.message }))
      if (errorType) yield put({ type: errorType, payload: error, ext: params })
      if (onError) yield fork(onError, error, params, action)
    } finally {
      if (onEnd) yield fork(onEnd, params, action)
      if (loading) yield put(hidePageLoading())
    }
  }
}
