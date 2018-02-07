import { showToast } from '../actions/toast'
import { type } from '../../yyvip-utils/utils'
import { call, put, fork } from 'redux-saga/effects'
import { showPageLoading, hidePageLoading } from '../actions/pageLoading'

export default function sagaApiCreator(opts) {
  return function* sagaApi(action) {
    let { payload: params } = action
    const { api, handleParams, loading, toast, toastText, successType, errorType, onBefore, onSuccess, onError, onEnd } = opts
    if (type(handleParams) === 'function') params = handleParams(params)
    try {
      if (loading) yield put(showPageLoading())
      if (onBefore) yield fork(onBefore, params, action)
      const data = yield call(api, params)
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
