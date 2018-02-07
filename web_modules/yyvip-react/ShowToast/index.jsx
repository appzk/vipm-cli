import React, { PureComponent } from 'react'
import Toast from '../Toast'

export default class ShowToast extends PureComponent {
  constructor(...args) {
    super(...args)
    this.state = {
      show: false,
      content: '服务器加载失败',
      classString: 'toast--default'
    }
  }

  render() {
    return <Toast { ...this.state }/>
  }
}
