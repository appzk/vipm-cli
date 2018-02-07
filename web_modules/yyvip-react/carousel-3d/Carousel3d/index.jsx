import React, {
  PureComponent
} from 'react'
import PropTypes from 'prop-types'
import assign from 'lodash/assign'

import {
  calCircleSub
} from '../../../yyvip-utils/utils'
import {
  supportTouch
} from '../../../yyvip-utils/checkBrowser'
import {
  getRem,
  getDpr
} from '../../../yyvip-flexible/utils'

import './carousel3d.styl'

const noop = () => {}

export default class Carousel3d extends PureComponent {
  static defaultProps = {
    border: 1,
    dir: 'rtl',
    loop: true,
    display: 5,
    space: 'auto',
    startIndex: 0,
    clickable: true,
    perspective: 35,
    animationSpeed: 500,
    width: getRem() * 4.8,
    height: getRem() * 3.6,
    inverseScaling: getRem() * 4,
    minSwipeDistance: getDpr() * 10,
    onLastSlide: noop,
    onClickCurrent: noop,
    onAfterSlideChange: noop,
    onBeforeSlideChange: noop,
    autoplay: false,
    autoplayTimeout: 5000
  }

  constructor(...args) {
    super(...args)
    this.state = {
      total: 0,
      zIndex: 998,
      viewport: 0,
      currentIndex: 0
    }
    this.mainRef = null
    this.dragStartX = 0
    this.dragOffset = 0
    this.mousedown = false
    this.mutationObserver = null
    this.autoplayInterval = null
    this.goFar = this.goFar.bind(this)
    this.startAutoplay = this.startAutoplay.bind(this)
    this.pauseAutoplay = this.pauseAutoplay.bind(this)
    this.handleMouseup = this.handleMouseup.bind(this)
    this.handleMousedown = this.handleMousedown.bind(this)
    this.handleMousemove = this.handleMousemove.bind(this)
  }

  isFirstSlide() {
    return this.state.currentIndex === 0
  }

  isLastSlide() {
    return this.state.currentIndex === this.state.total - 1
  }

  isPrevPossible() {
    return !(!this.props.loop && this.isFirstSlide())
  }

  isNextPossible() {
    return !(!this.props.loop && this.isLastSlide())
  }

  leftIndices(visible) {
    const n = Math.floor(visible / 2) + 1
    const indices = []
    for (let m = 1; m < n; m++) {
      indices.push((this.props.dir === 'ltr') ? (this.state.currentIndex + m) % (this.state.total) : (this.state.currentIndex - m) % (this.state.total))
    }
    return indices
  }

  rightIndices(visible) {
    const n = Math.floor(visible / 2) + 1
    const indices = []
    for (let m = 1; m < n; m++) {
      indices.push((this.props.dir === 'ltr') ? (this.state.currentIndex - m) % (this.state.total) : (this.state.currentIndex + m) % (this.state.total))
    }
    return indices
  }

  leftOutIndex(visible) {
    const n = Math.floor(visible / 2) + 1
    if (this.dir === 'ltr') return ((this.state.total - this.state.currentIndex - n) <= 0) ? (-parseInt(this.state.total - this.state.currentIndex - n)) : (this.state.currentIndex + n)
    return (this.state.currentIndex - n)
  }

  rightOutIndex(visible) {
    const n = Math.floor(visible / 2) + 1
    if (this.dir === 'ltr') return (this.state.currentIndex - n)
    return ((this.state.total - this.state.currentIndex - n) <= 0) ? (-parseInt(this.state.total - this.state.currentIndex - n)) : (this.state.currentIndex + n)
  }

  goPrev() {
    if (this.isPrevPossible()) this.isFirstSlide() ? this.goSlide(this.state.total - 1) : this.goSlide(this.state.currentIndex - 1)
  }

  goNext() {
    if (this.isNextPossible()) this.isLastSlide() ? this.goSlide(0) : this.goSlide(this.state.currentIndex + 1)
  }

  goSlide(index) {
    this.setState({
      currentIndex: index < 0 || index > this.total - 1 ? 0 : index
    }, () => {
      this.props.onBeforeSlideChange(this.state.currentIndex)
      if (this.isLastSlide()) this.props.onLastSlide(this.state.currentIndex)
      setTimeout(() => this.props.onAfterSlideChange(this.state.currentIndex), this.props.animationSpeed)
    })
  }

  goFar(index) {
    if (index === this.state.currentIndex) return this.props.onClickCurrent(index)
    let i = 0
    let timeBuff = 0
    const diff = calCircleSub(index, this.state.currentIndex, this.state.total)
    const diff2 = Math.abs(diff)
    while (i < diff2) {
      i += 1
      const timeout = diff2 === 1 ? 0 : timeBuff
      setTimeout(() => (diff < 0) ? this.goPrev(diff2) : this.goNext(diff2), timeout)
      timeBuff += (this.props.animationSpeed / (diff2))
    }
  }

  handleMouseup() {
    this.startAutoplay()
    this.dragOffset = 0
    this.mousedown = false
  }

  handleMousedown(e) {
    this.pauseAutoplay()
    this.mousedown = true
    this.dragStartX = supportTouch ? e.touches[0].clientX : e.clientX
  }

  handleMousemove(e) {
    if (!this.mousedown) return
    this.dragOffset = this.dragStartX - (supportTouch ? e.touches[0].clientX : e.clientX)
    if (this.dragOffset > this.props.minSwipeDistance) {
      this.handleMouseup()
      this.goNext()
    } else if (this.dragOffset < -this.props.minSwipeDistance) {
      this.handleMouseup()
      this.goPrev()
    }
  }

  pauseAutoplay() {
    if (this.autoplayInterval) this.autoplayInterval = clearInterval(this.autoplayInterval)
  }

  startAutoplay() {
    if (this.props.autoplay && !this.autoplayInterval) {
      this.autoplayInterval = setInterval(() => {
        this.dir === 'ltr' ? this.goPrev() : this.goNext()
      }, this.props.autoplayTimeout)
    }
  }

  attachMutationObserver() {
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    if (MutationObserver) {
      this.mutationObserver = new MutationObserver(() => this.computeData())
      if (this.mainRef) {
        this.mutationObserver.observe(this.mainRef, {
          childList: true,
          attributes: true,
          characterData: true
        })
      }
    }
  }

  detachMutationObserver() {
    if (this.mutationObserver) this.mutationObserver.disconnect()
  }

  computeData() {
    const total = React.Children.count(this.props.children)
    this.setState({
      total,
      viewport: this.mainRef.clientWidth,
      currentIndex: parseInt(this.props.startIndex) > total - 1 ? total - 1 : parseInt(this.props.startIndex)
    })
  }

  componentDidMount() {
    this.computeData()
    this.startAutoplay()
    this.attachMutationObserver()
  }

  componentWillUnmount() {
    this.pauseAutoplay()
    this.detachMutationObserver()
  }

  render() {
    let events = {}
    const vw = this.state.viewport
    const sw = parseInt(this.props.width) + parseInt(this.props.border) * 2
    const sh = parseInt(parseInt(this.props.height) + this.props.border * 2)
    const v = this.props.display > this.state.total ? this.state.total : this.props.display
    const slideWidth = Math.min(vw, sw)
    const slideHeight = slideWidth / sw * sh
    const visible = v !== 2 ? (v % 2) ? v : v - 1 : v
    const leftIndices = this.leftIndices(visible)
    const rightIndices = this.rightIndices(visible)
    const leftOutIndex = this.leftOutIndex(visible)
    const rightOutIndex = this.rightOutIndex(visible)
    const hasHiddenSlides = this.state.total > visible
    const {
      width,
      space,
      border,
      clickable,
      perspective,
      inverseScaling,
      animationSpeed,
      autoplay
    } = this.props
    if (autoplay) {
      events = {
        onMouseEnter: this.pauseAutoplay,
        onMouseLeave: this.startAutoplay
      }
    }
    if (supportTouch) {
      assign(events, {
        onTouchStart: this.handleMousedown,
        onTouchMove: this.handleMousemove,
        onTouchEnd: this.handleMouseup
      })
    } else {
      assign(events, {
        onMouseDown: this.handleMousedown,
        onMouseMove: this.handleMousemove,
        onMouseUp: this.handleMouseup
      })
    }
    return (
      <div className='carousel-3d-container' ref={(target) => { this.mainRef = target }} style={{ height: `${slideHeight}px` }} {...events}>
        <div className='carousel-3d-slider' style={{ width: `${slideWidth}px`, height: `${slideHeight}px` }}>
          {
            React.Children.map(this.props.children, (item, index) => React.cloneElement(item, {
              index,
              width,
              space,
              border,
              clickable,
              perspective,
              inverseScaling,
              animationSpeed,
              slideWidth,
              slideHeight,
              leftIndices,
              rightIndices,
              leftOutIndex,
              rightOutIndex,
              hasHiddenSlides,
              goFar: this.goFar,
              total: this.state.total,
              zIndex: this.state.zIndex,
              currentIndex: this.state.currentIndex
            }))
          }
        </div>
      </div>
    )
  }
}

Carousel3d.propTypes = {
  loop: PropTypes.bool,
  dir: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  border: PropTypes.number,
  children: PropTypes.node,
  display: PropTypes.number,
  clickable: PropTypes.bool,
  onLastSlide: PropTypes.func,
  startIndex: PropTypes.number,
  perspective: PropTypes.number,
  onClickCurrent: PropTypes.func,
  inverseScaling: PropTypes.number,
  animationSpeed: PropTypes.number,
  minSwipeDistance: PropTypes.number,
  onAfterSlideChange: PropTypes.func,
  onBeforeSlideChange: PropTypes.func,
  autoplay: PropTypes.bool,
  autoplayTimeout: PropTypes.number,
  space: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
}
