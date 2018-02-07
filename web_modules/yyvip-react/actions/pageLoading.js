import types from './types'

export function showPageLoading() {
  return { type: types.SHOW_PAGE_LOADING }
}

export function hidePageLoading() {
  return { type: types.HIDE_PAGE_LOADING }
}
