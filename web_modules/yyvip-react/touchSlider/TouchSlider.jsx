import assign from 'lodash/assign'
import React, { PureComponent} from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ReactShow from '../property/ReactShow'
import translateUtils from '../../yyvip-utils/translate'
import { getTouchData, supportTouch } from '../../yyvip-utils/checkBrowser'

import './touchSlider.styl'

export default class TouchSlider extends PureComponent {
  static propTypes = {
    loop: PropTypes.bool,
    speed: PropTypes.number,
    disabled: PropTypes.bool,
    children: PropTypes.node,
    distance: PropTypes.number,
    showIndicators: PropTypes.bool,
    auto: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.number
    ]),
    className: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
      PropTypes.string
    ])
  }

  static defaultProps = {
    loop: true,
    auto: 3000,
    speed: 300,
    distance: 0.2,
    disabled: false,
    showIndicators: true
  }

  constructor(...args) {
    super(...args)
    this.items = []
    this.itemsNum = 0
    this.wrapRef = null
    this.autoPlayTimer = null
    this.touches = {
      startX: 0,
      startY: 0,
      startTouch: false
    }
    this.state = { currentIndex: 0 }
    this.bindTouchStart = this.bindTouchStart.bind(this)
    this.bindTouchMove = this.bindTouchMove.bind(this)
    this.bindTouchEnd = this.bindTouchEnd.bind(this)
    this.preventBodyDefault = this.preventBodyDefault.bind(this)
  }

  init() {
    this.stopAutoplay()
    this.items = React.Children.toArray(this.props.children)
    if (this.items && this.items.length) {
      this.itemsNum = this.items.length
      this.setState({ currentIndex: Number(this.props.loop) }, _ => {
        this.setTranslate(0, -this.wrapRef.offsetWidth * this.state.currentIndex)
        this.autoPlay()
      })
    }
  }

  setTranslate(speed, translate) {
    this.wrapRef.style[translateUtils.transitionDurationProperty] = speed + 'ms'
    if (translateUtils.translate3d) {
      this.wrapRef.style[translateUtils.transformProperty] = `translate3d(${translate}px, 0, 0)`
    } else {
      this.wrapRef.style[translateUtils.transformProperty] = `translate(${translate}px, 0)`
    }
  }

  stopAutoplay() {
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer)
  }

  autoPlay() {
    if (this.props.auto && this.props.auto >= this.props.speed && this.itemsNum > 1) {
      this.autoPlayTimer = setInterval(_ => { this.goNext() }, this.props.auto)
    }
  }

  goNext() {
    if (this.props.loop) {
      this.resetTransition()
      setTimeout(_ => {
        this.setState({ currentIndex: this.state.currentIndex + 1 }, _ => {
          this.setTranslate(this.props.speed, -this.state.currentIndex * this.wrapRef.offsetWidth)
        })
      }, 0)
    } else {
      let currentIndex
      if (this.state.currentIndex >= this.itemsNum - 1) {
        currentIndex = 0
      } else if (this.state.currentIndex < 0) {
        currentIndex = this.itemsNum - 1
      } else {
        currentIndex = this.state.currentIndex + 1
      }
      this.setState({ currentIndex }, _ => {
        this.setTranslate(this.props.speed, -this.state.currentIndex * this.wrapRef.offsetWidth)
      })
    }
  }

  goBefore() {
    if (this.props.loop) {
      this.resetTransition()
      setTimeout(_ => {
        this.setState({ currentIndex: this.state.currentIndex - 1 }, _ => {
          this.setTranslate(this.props.speed, -this.state.currentIndex * this.wrapRef.offsetWidth)
        })
      }, 0)
    } else {
      let currentIndex
      if (this.state.currentIndex <= 0) {
        currentIndex = this.itemsNum - 1
      } else if (this.state.currentIndex > this.itemsNum - 1) {
        currentIndex = 0
      } else {
        currentIndex = this.state.currentIndex - 1
      }
      this.setState({ currentIndex }, _ => {
        this.setTranslate(this.props.speed, -this.state.currentIndex * this.wrapRef.offsetWidth)
      })
    }
  }

  bindTouchStart(e) {
    if (!this.props.disabled && this.items && this.itemsNum > 1) {
      this.stopAutoplay()
      const touch = getTouchData(e)
      assign(this.touches, { startTouch: true, startX: touch.clientX, startY: touch.clientY })
      this.props.loop && this.resetTransition()
    }
  }

  bindTouchMove(e) {
    e.stopPropagation()
    if (this.touches.startTouch) {
      let moveXCal = 0
      const touch = getTouchData(e)
      const offsetWidth = this.wrapRef.offsetWidth
      const moveX = touch.clientX - this.touches.startX
      const moveY = touch.clientY - this.touches.startY
      if (Math.abs(moveY) > Math.abs(moveX)) window.event.returnValue = true
      if (Math.abs(moveX) < (offsetWidth / 3)) {
        moveXCal = moveX
      } else if (Math.abs(moveX) < (offsetWidth * 2 / 3)) {
        moveXCal = -offsetWidth / 3 - (Math.abs(moveX) - offsetWidth / 3) * 2 / 3
      } else {
        moveXCal = -offsetWidth * 5 / 9 - (Math.abs(moveX) - offsetWidth * 2 / 3) / 2
      }
      this.setTranslate(0, -this.state.currentIndex * offsetWidth + moveXCal * 0.72)
    }
  }

  bindTouchEnd(e) {
    if (this.touches.startTouch) {
      let currentIndex = this.state.currentIndex
      const touch = getTouchData(e) || e.changedTouches[0]
      const moveX = touch.clientX - this.touches.startX
      assign(this.touches, { startTouch: false, startX: 0, startY: 0 })
      if (Math.abs(moveX) > this.wrapRef.offsetWidth * this.props.distance) {
        if (this.props.loop) {
          currentIndex = moveX > 0 ? (this.state.currentIndex - 1) : (this.state.currentIndex + 1)
        } else {
          if (moveX < 0 && this.state.currentIndex < this.itemsNum - 1) {
            currentIndex = this.state.currentIndex + 1
          } else if (moveX > 0 && this.state.currentIndex > 0) {
            currentIndex = this.state.currentIndex - 1
          }
        }
      }
      this.setState({ currentIndex }, _ => {
        this.setTranslate(this.props.speed, -this.state.currentIndex * this.wrapRef.offsetWidth)
        this.autoPlay()
      })
    }
  }

  resetTransition() {
    let currentIndex = this.state.currentIndex
    if (this.state.currentIndex > this.itemsNum) {
      currentIndex = 1
    } else if (this.state.currentIndex <= 0) {
      currentIndex = this.itemsNum
    }
    this.setState({ currentIndex }, _ => {
      this.setTranslate(0, -this.state.currentIndex * this.wrapRef.offsetWidth)
    })
  }

  preventBodyDefault(e) {
    this.touches.startTouch && e.preventDefault()
  }

  componentDidMount() {
    this.init()
    if (supportTouch) {
      this.wrapRef.addEventListener('touchstart', this.bindTouchStart)
      this.wrapRef.addEventListener('touchmove', this.bindTouchMove)
      this.wrapRef.addEventListener('touchend', this.bindTouchEnd)
      document.body.addEventListener('touchmove', this.preventBodyDefault, { passive: false })
    } else {
      this.wrapRef.addEventListener('mousedown', this.bindTouchStart)
      this.wrapRef.addEventListener('mousemove', this.bindTouchMove)
      document.addEventListener('mouseup', this.bindTouchEnd)
    }
  }

  render(h) {
    let children = null
    if (this.props.children && this.props.children.length) {
      if (this.props.loop) {
        const array = React.Children.toArray(this.props.children)
        children = [React.cloneElement(array[array.length - 1], { key: 'touch-slider-last' }), ...array, React.cloneElement(array[0], { key: 'touch-slider-first' })]
      } else {
        children = this.props.children
      }
    }
    return (
      <div className={classnames('touch-slider', this.props.className)}>
        <div className='touch-slider__wrap' ref={target => { this.wrapRef = target }}>
          {children}
        </div>
        <ReactShow show={this.props.showIndicators}>
          <div className='touch-slider__indicators'>
            {
              this.items && this.items.map((_, index) => (
                <div key={index} className={classnames('touch-slider__indicators__item', { 'active': (!this.props.loop && this.state.currentIndex === index) || (this.props.loop && (this.state.currentIndex === index + 1 || (this.state.currentIndex === this.itemsNum + 1 && index === 0) || (this.state.currentIndex === 0 && index === this.itemsNum - 1))) })}></div>
              ))
            }
          </div>
        </ReactShow>
      </div>
    )
  }

  componentWillUnmount() {
    this.stopAutoplay()
    if (supportTouch) {
      this.wrapRef.removeEventListener('touchstart', this.bindTouchStart)
      this.wrapRef.removeEventListener('touchmove', this.bindTouchMove)
      this.wrapRef.removeEventListener('touchend', this.bindTouchEnd)
      document.body.removeEventListener('touchmove', this.preventBodyDefault, { passive: false })
    } else {
      this.wrapRef.removeEventListener('mousedown', this.bindTouchStart)
      this.wrapRef.removeEventListener('mousemove', this.bindTouchMove)
      document.removeEventListener('mouseup', this.bindTouchEnd)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) this.init()
  }
}
