import assign from 'lodash/assign'
import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Motion, spring } from 'react-motion'
import ReactShow from '../property/ReactShow'
import { display, transform } from '../style/adapt'

import './bottomLayer.styl'

export default class BottomLayer extends PureComponent {
  static defaultProps = {
    hideOnClickMask: true,
    bottomLayerClass: 'bottom-layer--default'
  }

  constructor(...args) {
    super(...args)
    this.mainRef = null
    this.state = { mainShow: this.props.show }
    this.syncMainShow = this.syncMainShow.bind(this)
    this.handleClickMask = this.handleClickMask.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show) this.setState({ mainShow: true })
  }

  syncMainShow() {
    if (!this.props.show) this.setState({ mainShow: false })
  }

  handleClickMask(e) {
    e.stopPropagation()
    const { onClickMask, hideOnClickMask, hideBottomLayer } = this.props
    if (e.target === this.mainRef) {
      onClickMask && onClickMask(e)
      hideOnClickMask && hideBottomLayer && hideBottomLayer(e)
    }
  }

  render() {
    const {
      mainShow
    } = this.state
    const {
      show,
      children,
      bottomLayerClass
    } = this.props
    return (
      <ReactShow show={mainShow}>
        <div className={classnames('bottom-layer', bottomLayerClass)} onClick={this.handleClickMask} ref={(target) => { this.mainRef = target }}>
          <Motion defaultStyle={{ x: 0 }} style={{ x: spring(show ? 100 : 0, { stiffness: 240 }) }} onRest={this.syncMainShow}>
            {({ x }) =>
              <div className='bottom-layer__box' style={assign(display(x), transform(x))}>{children}</div>
            }
          </Motion>
        </div>
      </ReactShow>
    )
  }
}

BottomLayer.propTypes = {
  onClickMask: PropTypes.func,
  hideBottomLayer: PropTypes.func,
  hideOnClickMask: PropTypes.bool,
  show: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  bottomLayerClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}
