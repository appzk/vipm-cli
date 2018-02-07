<template lang="pug">
div(:class="$style.scratch", :style="scratchStyle")
  canvas(:class="$style.cover", ref="canvasBox", :width="width", :height="height" @touchstart="bindTouchStart" @touchmove.prevent="bindTouchMove" @touchend="bindTouchEnd" @mousedown="bindTouchStart" @mousemove.prevent="bindTouchMove")
  slot
</template>

<script>
import assign from 'lodash/assign'
import { getDpr, getRem } from '../yyvip-flexible/utils'
import { getTouchData } from '../yyvip-utils/checkBrowser'

export default {
  name: 'scratch',
  props: {
    width: {
      type: Number,
      required: false,
      default: 7.88 * getRem()
    },
    height: {
      type: Number,
      required: false,
      default: 4.98 * getRem()
    },
    onSetCover: {
      type: Function,
      required: false
    },
    lineWidth: {
      type: Number,
      required: false,
      default: 32 * getDpr()
    },
    strokeColor: {
      type: String,
      required: false,
      default: 'ffffff'
    },
    isAutoScratch: {
      type: Boolean,
      required: false,
      default: true
    },
    autoScratchSize: {
      type: Number,
      required: false,
      default: 50
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      offsetTop: 0,
      offsetLeft: 0,
      isStart: false
    }
  },
  created() {
    document.addEventListener('mouseup', this.bindTouchEnd)
  },
  mounted() {
    this.ctx = this.$refs.canvasBox.getContext('2d')
    this.initCover()
  },
  methods: {
    initCover() {
      this.ctx.globalCompositeOperation = 'destination-over'
      if (this.onSetCover) {
        this.onSetCover(this.ctx, this.resetDestination)
      } else {
        this.setCover()
        this.resetDestination()
      }
    },
    resetDestination() {
      this.ctx.globalCompositeOperation = 'destination-out'
      this.ctx.strokeStyle = this.strokeColor
      this.ctx.lineWidth = this.lineWidth
      this.ctx.lineJoin = 'round'
    },
    setCover() {
      this.ctx.fillStyle = '#edece6'
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.$emit('after-default-cover', this.ctx)
    },
    bindTouchStart(e) {
      const { top: offsetTop, left: offsetLeft } = this.$refs.canvasBox.getBoundingClientRect()
      assign(this, { offsetLeft, offsetTop })
      this.isStart = true
      const touch = getTouchData(e)
      this.x = touch.pageX - this.offsetLeft
      this.y = touch.pageY - this.offsetTop
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.lineWidth / 2, 0, Math.PI * 2, true)
      this.ctx.closePath()
      this.ctx.fill()
      this.$emit('on-touch-start', this.ctx)
    },
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
        this.$emit('on-touch-move', this.ctx)
      }
    },
    bindTouchEnd() {
      this.isStart = false
      this.$emit('on-touch-end', this.ctx)
      if (this.isAutoScratch) {
        const size = this.getScratchSize()
        if (size >= this.autoScratchSize) {
          this.ctx.fillRect(0, 0, this.width, this.height)
          this.$emit('auto-scratch', this.ctx, size)
        }
      }
    },
    getScratchSize() {
      let k = 0
      const data = this.ctx.getImageData(0, 0, this.width, this.height).data
      for (let i = 0; i < data.length - 3; i += 4) {
        if (data[i] === 0 && data[i + 1] === 0 && data[i + 2] === 0 && data[i + 3] === 0) k++
      }
      return (k * 100 / (this.width * this.height))
    }
  },
  computed: {
    scratchStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  },
  destroyed() {
    document.removeEventListener('mouseup', this.bindTouchEnd)
  }
}
</script>

<style lang="stylus" module>
@import '~yyvip-stylus/base'

.scratch
  position relative

.cover
  border-radius inherit
  absolutePos(0, null, null, 0)
</style>
