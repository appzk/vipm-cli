import assign from 'lodash/assign'
import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Motion, spring } from 'react-motion'
import ReactShow from '../property/ReactShow'
import { opacity, display, scale } from '../style/adapt'

import './pageModal.styl'

export default class PageModal extends PureComponent {
  static defaultProps = {
    showClose: false,
    hideOnClickMask: true,
    hideOnClickClose: true,
    pageModalClass: 'page-modal--default'
  }

  constructor(...args) {
    super(...args)
    this.maskRef = null
    this.state = { maskShow: this.props.isShow }
    this.syncMainShow = this.syncMainShow.bind(this)
    this.handleClickMask = this.handleClickMask.bind(this)
    this.handleClickClose = this.handleClickClose.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isShow) this.setState({ maskShow: true })
  }

  syncMainShow() {
    if (!this.props.isShow) this.setState({ maskShow: false })
  }

  handleClickMask(e) {
    e.stopPropagation()
    const { onClickMask, hideOnClickMask, hidePageModal } = this.props
    if (e.target === this.maskRef) {
      onClickMask && onClickMask(e)
      hideOnClickMask && hidePageModal && hidePageModal(e)
    }
  }

  handleClickClose(e) {
    e.stopPropagation()
    const { onClickClose, hideOnClickClose, hidePageModal } = this.props
    onClickClose && onClickClose(e)
    hideOnClickClose && hidePageModal && hidePageModal(e)
  }

  render() {
    const {
      maskShow
    } = this.state
    const {
      isShow,
      children,
      pageModalClass
    } = this.props
    return (
      <ReactShow show={maskShow}>
        <div className={classnames('page-modal', pageModalClass)}>
          <div className='page-modal__main' onClick={this.handleClickMask} ref={(target) => { this.maskRef = target }}>
            <Motion defaultStyle={{ x: 0 }} style={{ x: spring(isShow ? 100 : 0, { stiffness: 240 }) }} onRest={this.syncMainShow}>
              {({ x }) =>
                <div className='page-modal__main__box' style={assign(opacity(x), display(x), scale(x))}>
                  <div className='page-modal__main__box__close' onClick={this.handleClickClose}>
                    <div className='page-modal__main__box__close__icon'></div>
                  </div>
                  {children}
                </div>
              }
            </Motion>
          </div>
        </div>
      </ReactShow>
    )
  }
}

PageModal.propTypes = {
  children: PropTypes.node,
  showClose: PropTypes.bool,
  onClickMask: PropTypes.func,
  onClickClose: PropTypes.func,
  hidePageModal: PropTypes.func,
  hideOnClickMask: PropTypes.bool,
  hideOnClickClose: PropTypes.bool,
  isShow: PropTypes.bool.isRequired,
  pageModalClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}
