import types from './types'

export function showToast(payload) {
  return { type: types.SHOW_TOAST, payload }
}

export function hideToast() {
  return { type: types.HIDE_TOAST }
}
