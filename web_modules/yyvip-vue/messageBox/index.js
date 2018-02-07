import assign from 'lodash/assign'
import cloneDeep from 'lodash/cloneDeep'
import initInstance from '../vuevUtils'
import messageAlert from './messageAlert'
import messageConfirm from './messageConfirm'

function noop() {}

const messageAlertOpts = {
  message: '',
  title: '提示',
  onConfirm: noop,
  showClose: false,
  onClickMask: noop,
  onClickClose: noop,
  hideOnConfirm: true,
  showPageModal: true,
  hideOnClickMask: true,
  hideOnClickClose: true,
  alertButtonText: '确定',
  pageModalClass: { 'page-modal--default': true }
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

function fixedPageModalScript(instance) {
  instance.hidePageModal = function() {
    instance.showPageModal = false
  }
}

export const showAlert = initInstance('alert', messageAlert, messageAlertOpts, fixedPageModalScript)
export const showConfirm = initInstance('confirm', messageConfirm, messageConfirmOpts, fixedPageModalScript)
