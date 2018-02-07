import React, {
  PureComponent
} from 'react'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { adapt } from '../../style/adapt'

import './slide.styl'

export default class Slide extends PureComponent {
  static defaultProps = {
    zIndex: 999
  }

  constructor(...args) {
    super(...args)
    this.handleClick = this.handleClick.bind(this)
  }

  getSideIndex(array) {
    let index = -1
    forEach(array, (t, i) => {
      if (this.matchIndex(t)) index = i
    })
    return index
  }

  matchIndex(index) {
    return index >= 0 ? this.props.index === index : (this.props.total + index) === this.props.index
  }

  calculatePosition(index, positive, zIndex) {
    const indexPos = index + 1
    const y = parseInt(this.props.perspective)
    const z = parseInt(this.props.inverseScaling) + indexPos * 100
    const top = this.props.space === 'auto' ? 0 : parseInt(indexPos * this.props.space)
    const leftRemain = (this.props.space === 'auto') ? parseInt(indexPos * (this.props.width / 1.5)) : parseInt(indexPos * this.props.space)
    const transform = positive ? `translateX(${leftRemain}px) translateZ(-${z}px) rotateY(-${y}deg)` : `translateX(-${leftRemain}px) translateZ(-${z}px) rotateY(${y}deg)`
    return assign({
      top,
      zIndex: zIndex - (Math.abs(index) + 1)
    }, adapt({
      transform
    }, ['Moz', 'Webkit']))
  }

  getStyle(isCurrent) {
    let styles = {}
    if (!isCurrent) {
      const lrStyle = {
        opacity: 1,
        visibility: 'visible'
      }
      const lIndex = this.getSideIndex(this.props.leftIndices)
      const rIndex = this.getSideIndex(this.props.rightIndices)
      if (lIndex >= 0) {
        assign(styles, this.calculatePosition(lIndex, false, this.props.zIndex), lrStyle)
      } else if (rIndex >= 0) {
        assign(styles, this.calculatePosition(rIndex, true, this.props.zIndex), lrStyle)
      }
      if (this.props.hasHiddenSlides) {
        if (this.matchIndex(this.props.leftOutIndex)) {
          styles = this.calculatePosition(this.props.leftIndices.length - 1, false, this.props.zIndex)
        } else if (this.matchIndex(this.props.rightOutIndex)) {
          styles = this.calculatePosition(this.props.rightIndices.length - 1, true, this.props.zIndex)
        }
      }
    }
    return assign(styles, {
      width: `${this.props.slideWidth}px`,
      height: `${this.props.slideHeight}px`,
      borderWidth: `${this.props.border}px`
    }, adapt({
      transition: `transform ${this.props.animationSpeed}ms, opacity ${this.props.animationSpeed}ms, visibility ${this.props.animationSpeed}ms`
    }, ['Moz', 'Webkit'], (item, key, pre) => `-${pre.toLowerCase()}-${item}`))
  }

  handleClick() {
    if (this.props.clickable) this.props.goFar(this.props.index)
  }

  render() {
    const isCurrent = this.props.index === this.props.currentIndex
    const slideStyle = assign(this.getStyle(isCurrent), this.props.style)
    return <div className={classnames('carousel-3d-slide', { current: isCurrent, 'carousel-3d-current': isCurrent, 'carousel-3d-others': !isCurrent })} onClick={this.handleClick} style={slideStyle}>{this.props.children}</div>
  }
}

Slide.propTypes = {
  children: PropTypes.node,
  zIndex: PropTypes.number,
  goFar: PropTypes.func,
  index: PropTypes.number,
  total: PropTypes.number,
  width: PropTypes.number,
  border: PropTypes.number,
  slideWidth: PropTypes.number,
  slideHeight: PropTypes.number,
  animationSpeed: PropTypes.number,
  clickable: PropTypes.bool,
  perspective: PropTypes.number,
  currentIndex: PropTypes.number,
  leftOutIndex: PropTypes.number,
  rightOutIndex: PropTypes.number,
  hasHiddenSlides: PropTypes.bool,
  inverseScaling: PropTypes.number,
  leftIndices: PropTypes.arrayOf(PropTypes.number),
  rightIndices: PropTypes.arrayOf(PropTypes.number),
  space: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
}
