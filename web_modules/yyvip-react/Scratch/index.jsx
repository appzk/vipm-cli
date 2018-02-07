import React, { PureComponent} from 'react'
import assign from 'lodash/assign'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getDpr, getRem } from '../../yyvip-flexible/utils'
import { supportTouch, getTouchData } from '../../yyvip-utils/checkBrowser'

import './scratch.styl'

const noop = () => {}

export default class Scratch extends PureComponent {
  static defaultProps = {
    width: 7.88 * getRem(),
    height: 4.98 * getRem(),
    lineWidth: 32 * getDpr(),
    strokeColor: 'ffffff',
    isAutoScratch: true,
    autoScratchSize: 50,
    styleClass: 'scratch--default',
    afterDefaultCover: noop,
    onTouchStart: noop,
    onTouchMove: noop,
    onTouchEnd: noop,
    onAutoScratch: noop
  }

  constructor(...args) {
    super(...args)
    this.x = 0
    this.y = 0
    this.offsetTop = 0
    this.offsetLeft = 0
    this.isStart = false
    this.ctx = null
    this.scratchRef = null
    this.bindTouchEnd = this.bindTouchEnd.bind(this)
    this.bindTouchStart = this.bindTouchStart.bind(this)
    this.bindTouchMove = this.bindTouchMove.bind(this)
    this.bindTouchEnd = this.bindTouchEnd.bind(this)
  }

  componentDidMount() {
    if (!supportTouch) document.addEventListener('mouseup', this.bindTouchEnd)
    this.ctx = this.scratchRef.getContext('2d')
    this.initCover()
  }

  componentWillUnmount() {
    if (!supportTouch) document.removeEventListener('mouseup', this.bindTouchEnd)
  }

  initCover() {
    const { onSetCover, strokeColor, lineWidth } = this.props
    this.ctx.globalCompositeOperation = 'destination-over'
    onSetCover ? onSetCover(this.ctx) : this.setCover()
    this.ctx.globalCompositeOperation = 'destination-out'
    assign(this.ctx, { strokeColor, lineWidth })
    this.ctx.lineJoin = 'round'
  }

  setCover() {
    const { width, height, afterDefaultCover } = this.props
    this.ctx.fillStyle = '#edece6'
    this.ctx.fillRect(0, 0, width, height)
    afterDefaultCover(this.ctx)
  }

  bindTouchStart(e) {
    const touch = getTouchData(e)
    const { lineWidth, onTouchStart } = this.props
    const { top: offsetTop, left: offsetLeft } = this.scratchRef.getBoundingClientRect()
    assign(this, { offsetLeft, offsetTop, isStart: true })
    this.x = touch.pageX - this.offsetLeft
    this.y = touch.pageY - this.offsetTop
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, lineWidth / 2, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fill()
    onTouchStart(this.ctx)
  }

  bindTouchMove(e) {
    if (this.isStart) {
      this.ctx.beginPath()
      const touch = getTouchData(e)
      this.ctx.moveTo(this.x, this.y)
      this.ctx.lineTo(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop)
      this.x = touch.pageX - this.offsetLeft
      this.y = touch.pageY - this.offsetTop
      this.ctx.closePath()
      this.ctx.stroke()
      this.ctx.canvas.style.color = '#' + ((Math.random() * 10000000) | 0).toString(16)
      this.props.onTouchMove(this.ctx)
    }
  }

  bindTouchEnd() {
    this.isStart = false
    const { isAutoScratch, autoScratchSize, onTouchEnd, onAutoScratch, width, height } = this.props
    onTouchEnd(this.ctx)
    if (isAutoScratch) {
      const size = this.getScratchSize()
      if (size >= autoScratchSize) {
        this.ctx.fillRect(0, 0, width, height)
        onAutoScratch(this.ctx, size)
      }
    }
  }

  getScratchSize() {
    let k = 0
    const { width, height } = this.props
    const data = this.ctx.getImageData(0, 0, width, height).data
    for (let i = 0; i < data.length - 3; i += 4) {
      if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0 && data[i + 3] === 0) k++
    }
    return (k * 100 / (width * height))
  }

  render() {
    let events = {}
    const { width, height, children, styleClass } = this.props
    const scratchStyle = {
      width: `${width}px`,
      height: `${height}px`
    }
    if (supportTouch) {
      assign(events, {
        onTouchStart: this.bindTouchStart,
        onTouchMove: this.bindTouchMove,
        onTouchEnd: this.bindTouchEnd
      })
    } else {
      assign(events, {
        onMouseDown: this.bindTouchStart,
        onMouseMove: this.bindTouchMove
      })
    }
    return (
      <div className={classnames('scratch', styleClass)} style={scratchStyle}>
        <canvas className='scratch__cover' ref={(target) => { this.scratchRef = target }} width={width} height={height} {...events}></canvas>
        {children}
      </div>
    )
  }
}

Scratch.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node,
  onSetCover: PropTypes.func,
  lineWidth: PropTypes.number,
  strokeColor: PropTypes.string,
  isAutoScratch: PropTypes.bool,
  autoScratchSize: PropTypes.number,
  afterDefaultCover: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchMove: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onAutoScratch: PropTypes.func,
  styleClass: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.string
  ])
}
