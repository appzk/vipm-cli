import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import initInstance from '../reactvUtils'
import MessageAlert from './MessageAlert'
import MessageConfirm from './MessageConfirm'

function noop() {}

const messageAlertOpts = {
  isShow: true,
  children: null,
  onConfirm: noop,
  showClose: false,
  onClickMask: noop,
  onClickClose: noop,
  hideOnConfirm: true,
  hideOnClickMask: true,
  hideOnClickClose: true,
  alertButtonText: '确定',
  hidePageModal: undefined,
  pageModalClass: 'page-modal--default'
}
const messageConfirmOpts = (function() {
  const opts = cloneDeep(messageAlertOpts)
  delete opts.alertButtonText
  return assign(opts, {
    onCancel: noop,
    hideOnCancel: true,
    cancelButtonText: '取消',
    confirmButtonText: '确定'
  })
})()

export const showAlert = initInstance('alert', MessageAlert, messageAlertOpts, (instance, opts) => instance.setState(opts))
export const showConfirm = initInstance('alert', MessageConfirm, messageConfirmOpts, (instance, opts) => instance.setState(opts))
