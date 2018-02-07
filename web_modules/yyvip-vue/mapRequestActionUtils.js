import { actions as toastActions } from './toast.vuex'
import { actions as pageLoadingActions } from './pageLoading.vuex'
import { getContentFromError, updateFunctionFromObject, checkParams, checkFunction } from '../yyvip-utils/utils'
export { getContentFromError, updateFunctionFromObject, checkParams, checkFunction }

export function bindApiActionPrefix(opts) {
  return bindApiLoadingActionPrefix(bindApiOnErrorActionPrefix(opts))
}

export function bindApiLoadingActionPrefix(opts) {
  if (!opts.options) {
    opts.options = {}
  }
  updateFunctionFromObject(opts.options, 'onRequest', operate => pageLoadingActions.showPageLoading(operate))
  updateFunctionFromObject(opts.options, 'onFinish', operate => pageLoadingActions.hidePageLoading(operate))
  return opts
}

export function bindApiOnErrorActionPrefix(opts) {
  if (!opts.options) {
    opts.options = {}
  }
  updateFunctionFromObject(opts.options, 'onError', (operate, error) => toastActions.showToast(operate, { content: getContentFromError(error) || '服务器加载失败' }))
  return opts
}

export function bindApiOnWrapperActionPrefix(opts) {
  if (!opts.options) {
    opts.options = {}
  }
  const [before, finish] = opts.wrapper
  updateFunctionFromObject(opts.options, 'onRequest', ({ commit }, data) => commit(before, data))
  updateFunctionFromObject(opts.options, 'onFinish', ({ commit }, data) => commit(finish, data))
  return opts
}
