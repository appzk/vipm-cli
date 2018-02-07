import ShowToast from './index'
import initInstance from '../reactvUtils'

let timer = null
const toastOpts = {
  show: true,
  timeout: 3000,
  content: '服务器加载失败',
  classString: 'toast--default'
}

function initToast(instance, opts) {
  instance.setState(opts)
  clearTimeout(timer)
  timer = setTimeout(() => {
    instance.setState({ show: false })
  }, opts.timeout)
}

export const showToast = initInstance('toast', ShowToast, toastOpts, initToast, initToast)
