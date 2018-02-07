import types from '../actions/types'
import { delay } from '../../yyvip-utils/utils'
import { put, fork, cancel, takeEvery } from 'redux-saga/effects'

let timer

function* showToastBg(action) {
  const { payload = {} } = action
  const { timeout = 3000 } = payload
  yield put({ type: types.SHOW_TOAST_SAGA, payload })
  yield delay(timeout)
  yield put({ type: types.HIDE_TOAST_SAGA })
}

function* showToast(action) {
  if (timer) yield cancel(timer)
  timer = yield fork(showToastBg, action)
}

function* hideToast(action) {
  if (timer) yield cancel(timer)
  yield put({ type: types.HIDE_TOAST_SAGA })
}

export default function* watchToast() {
  yield takeEvery(types.SHOW_TOAST, showToast)
  yield takeEvery(types.HIDE_TOAST, hideToast)
}
