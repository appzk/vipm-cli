import './touchSlider.styl'
import assign from 'lodash/assign'
import defaultsDeep from 'lodash/defaultsDeep'
import translateUtils from '../../yyvip-utils/translate'
import { getTouchData, supportTouch } from '../../yyvip-utils/checkBrowser'

export default {
  name: 'touchSlider',
  props: {
    speed: {
      type: Number,
      default: 300
    },
    auto: {
      type: [Boolean, Number],
      default: 3000
    },
    loop: {
      type: Boolean,
      default: true
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    distance: {
      type: Number,
      default: 0.2
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      itemsNum: 0,
      wrapRef: null,
      currentIndex: 0,
      autoPlayTimer: null,
      touches: {
        startX: 0,
        startY: 0,
        startTouch: false
      }
    }
  },
  render(h) {
    let children = null
    if (this.$slots.default) {
      if (this.loop) {
        children = [defaultsDeep({}, this.$slots.default[this.$slots.default.length - 1]), ...this.$slots.default, defaultsDeep({}, this.$slots.default[0])]
      } else {
        children = this.$slots.default
      }
    }
    return (
      <div class={{ 'touch-slider': true }}>
        <div class={{ 'touch-slider__wrap': true }} ref='wrap'>
          {children}
        </div>
        <div class={{ 'touch-slider__indicators': true }} v-show={ this.showIndicators }>
          {this.items && this.items.map((_, $index) => <div class={{ 'touch-slider__indicators__item': true, 'active': (!this.loop && this.currentIndex === $index) || (this.loop && (this.currentIndex === $index + 1 || (this.currentIndex === this.itemsNum + 1 && $index === 0) || (this.currentIndex === 0 && $index === this.itemsNum - 1))) }}></div>)}
        </div>
      </div>
    )
  },
  methods: {
    init() {
      this.stopAutoplay()
      this.items = this.$slots.default
      if (this.items) {
        this.itemsNum = this.items.length
        this.currentIndex = Number(this.loop)
        this.setTranslate(0, -this.$refs.wrap.offsetWidth * this.currentIndex)
        this.autoPlay()
      }
    },
    setTranslate(speed, translate) {
      const wrap = this.$refs.wrap
      wrap.style[translateUtils.transitionDurationProperty] = speed + 'ms'
      if (translateUtils.translate3d) {
        wrap.style[translateUtils.transformProperty] = `translate3d(${translate}px, 0, 0)`
      } else {
        wrap.style[translateUtils.transformProperty] = `translate(${translate}px, 0)`
      }
    },
    stopAutoplay() {
      if (this.autoPlayTimer) clearInterval(this.autoPlayTimer)
    },
    autoPlay() {
      if (this.auto && this.auto >= this.speed && this.itemsNum > 1) {
        this.autoPlayTimer = setInterval(_ => { this.goNext() }, this.auto)
      }
    },
    goNext() {
      if (this.loop) {
        this.resetTransition()
        setTimeout(_ => this.setTranslate(this.speed, -(++this.currentIndex * this.$refs.wrap.offsetWidth)), 0)
      } else {
        if (this.currentIndex >= this.itemsNum - 1) {
          this.currentIndex = 0
        } else if (this.currentIndex < 0) {
          this.currentIndex = this.itemsNum - 1
        } else {
          this.currentIndex++
        }
        this.setTranslate(this.speed, -this.currentIndex * this.$refs.wrap.offsetWidth)
      }
    },
    goBefore() {
      if (this.loop) {
        this.resetTransition()
        setTimeout(_ => this.setTranslate(this.speed, -(--this.currentIndex * this.$refs.wrap.offsetWidth)), 0)
      } else {
        if (this.currentIndex <= 0) {
          this.currentIndex = this.itemsNum - 1
        } else if (this.currentIndex > this.itemsNum - 1) {
          this.currentIndex = 0
        } else {
          this.currentIndex--
        }
        this.setTranslate(this.speed, -this.currentIndex * this.$refs.wrap.offsetWidth)
      }
    },
    bindTouchStart(e) {
      if (!this.disabled && this.items && this.itemsNum > 1) {
        this.stopAutoplay()
        const touch = getTouchData(e)
        assign(this.touches, { startTouch: true, startX: touch.clientX, startY: touch.clientY })
        this.loop && this.resetTransition()
      }
    },
    bindTouchMove(e) {
      e.stopPropagation()
      if (this.touches.startTouch) {
        let moveXCal = 0
        const touch = getTouchData(e)
        const offsetWidth = this.$refs.wrap.offsetWidth
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
        this.setTranslate(0, -this.currentIndex * offsetWidth + moveXCal * 0.72)
      }
    },
    bindTouchEnd(e) {
      if (this.touches.startTouch) {
        const touch = getTouchData(e) || e.changedTouches[0]
        const moveX = touch.clientX - this.touches.startX
        assign(this.touches, { startTouch: false, startX: 0, startY: 0 })
        if (Math.abs(moveX) > this.$refs.wrap.offsetWidth * this.distance) {
          if (this.loop) {
            this.currentIndex = moveX > 0 ? (this.currentIndex - 1) : (this.currentIndex + 1)
          } else {
            if (moveX < 0 && this.currentIndex < this.itemsNum - 1) {
              this.currentIndex++
            } else if (moveX > 0 && this.currentIndex > 0) {
              this.currentIndex--
            }
          }
        }
        this.setTranslate(this.speed, -this.currentIndex * this.$refs.wrap.offsetWidth)
        this.autoPlay()
      }
    },
    resetTransition() {
      if (this.currentIndex > this.itemsNum) {
        this.currentIndex = 1
      } else if (this.currentIndex <= 0) {
        this.currentIndex = this.itemsNum
      }
      this.setTranslate(0, -this.currentIndex * this.$refs.wrap.offsetWidth)
    },
    preventBodyDefault(e) {
      this.touches.startTouch && e.preventDefault()
    }
  },
  mounted() {
    this.init()
    const wrap = this.$refs.wrap
    if (supportTouch) {
      wrap.addEventListener('touchstart', this.bindTouchStart)
      wrap.addEventListener('touchmove', this.bindTouchMove)
      wrap.addEventListener('touchend', this.bindTouchEnd)
      document.body.addEventListener('touchmove', this.preventBodyDefault, { passive: false })
    } else {
      wrap.addEventListener('mousedown', this.bindTouchStart)
      wrap.addEventListener('mousemove', this.bindTouchMove)
      document.addEventListener('mouseup', this.bindTouchEnd)
    }
  },
  updated() {
    if (this.items !== this.$slots.default) {
      if (typeof this.items === 'object' && typeof this.$slots.default === 'object') {
        if (this.itemsNum !== this.$slots.default.length) this.init()
      } else {
        this.init()
      }
    }
  },
  destroyed() {
    this.stopAutoplay()
    const wrap = this.$refs.wrap
    if (supportTouch) {
      wrap.removeEventListener('touchstart', this.bindTouchStart)
      wrap.removeEventListener('touchmove', this.bindTouchMove)
      wrap.removeEventListener('touchend', this.bindTouchEnd)
      document.body.removeEventListener('touchmove', this.preventBodyDefault, { passive: false })
    } else {
      wrap.removeEventListener('mousedown', this.bindTouchStart)
      wrap.removeEventListener('mousemove', this.bindTouchMove)
      document.removeEventListener('mouseup', this.bindTouchEnd)
    }
  }
}
