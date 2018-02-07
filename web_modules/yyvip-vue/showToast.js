import toast from './toast'
import assign from 'lodash/assign'
import initInstance from './vuevUtils'

let timer = null
const toastOpts = {
  show: true,
  timeout: 3000,
  content: '服务器加载失败',
  toastClass: { 'toast--default': true },
  transitionName: 'toast-fade'
}

function hideToast(instance, opts) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    instance.show = false
  }, opts.timeout)
}

export const showToast = initInstance('toast', toast, toastOpts, hideToast, function(instance, opts) {
  assign(instance, opts)
  hideToast(instance, opts)
})
