import omit from 'lodash/omit'
import React, { PureComponent } from 'react'
import PageConfirm from '../PageConfirm'

function noop() {}

export default class MessageConfirm extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = {
      isShow: false,
      children: null,
      onCancel: noop,
      onConfirm: noop,
      showClose: false,
      onClickMask: noop,
      onClickClose: noop,
      hideOnCancel: true,
      hideOnConfirm: true,
      hideOnClickMask: true,
      hideOnClickClose: true,
      cancelButtonText: '取消',
      confirmButtonText: '确定',
      hidePageModal: undefined,
      pageModalClass: 'page-modal--default'
    }
    this.hide = this.hide.bind(this)
    this.hidePageModal = this.hidePageModal.bind(this)
  }

  hide() {
    this.setState({ isShow: false })
  }

  hidePageModal() {
    if (!this.state.hidePageModal) {
      this.hide()
    } else {
      this.state.hidePageModal(this.hide)
    }
  }

  render() {
    return <PageConfirm hidePageModal={this.hidePageModal} { ...omit(this.state, ['children', 'hidePageModal']) }>{this.state.children}</PageConfirm>
  }
}
