import omit from 'lodash/omit'
import React, { PureComponent } from 'react'
import PageAlert from '../PageAlert'

function noop() {}

export default class MessageAlert extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = {
      isShow: false,
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
    return <PageAlert hidePageModal={this.hidePageModal} { ...omit(this.state, ['children', 'hidePageModal']) }>{this.state.children}</PageAlert>
  }
}
