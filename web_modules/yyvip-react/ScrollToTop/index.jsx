import assign from 'lodash/assign'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'
import { display, opacity } from '../style/adapt'
import { getDpr } from '../../yyvip-flexible/utils'
import { scrollTop } from '../../yyvip-utils/checkBrowser'

import './scrollToTop.styl'

export default class ScrollToTop extends PureComponent {
  static defaultProps = {
    dpr: getDpr()
  }

  constructor(...args) {
    super(...args)
    this.state = {
      showToTop: false
    }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll() {
    this.setState({
      showToTop: scrollTop() > 25 * this.props.dpr
    })
  }

  handleToTopClick(e) {
    e.stopPropagation()
    let index = 0
    let step = scrollTop() / 30
    let scrollTopNum = scrollTop() - step
    let time = setInterval(function() {
      index++
      if (index > 32 || scrollTopNum < 0) {
        clearInterval(time)
      }
      scrollTop(scrollTopNum)
      scrollTopNum -= step
    }, 10)
  }

  render() {
    const {
      showToTop
    } = this.state
    const {
      classString
    } = this.props
    return (
      <Motion defaultStyle={{ x: 0 }} style={{ x: spring(showToTop ? 100 : 0, { stiffness: 200 }) }}>
        {({ x }) =>
          <div className={`scroll-to-top ${classString || 'scroll-to-top--default'}`} style={assign(display(x), opacity(x))} onClick={this.handleToTopClick}></div>
        }
      </Motion>
    )
  }
}

ScrollToTop.propTypes = {
  classString: PropTypes.string
}
