<template lang="pug">
.carousel-3d-slide(:style="slideStyle", :class="{current: isCurrent, 'carousel-3d-current': isCurrent, 'carousel-3d-others': !isCurrent}", @click="goTo()")
  slot
</template>

<script>
import assign from 'lodash/assign'

export default {
  name: 'slide',
  props: {
    index: {
      type: Number
    }
  },
  data() {
    return {
      zIndex: 999,
      parent: this.$parent
    }
  },
  computed: {
    isCurrent() {
      return this.index === this.parent.currentIndex
    },
    slideStyle() {
      let styles = {}
      if (!this.isCurrent) {
        const rIndex = this.getSideIndex(this.parent.rightIndices)
        const lIndex = this.getSideIndex(this.parent.leftIndices)
        if (rIndex >= 0 || lIndex >= 0) {
          styles = rIndex >= 0 ? this.calculatePosition(rIndex, true, this.zIndex) : this.calculatePosition(lIndex, false, this.zIndex)
          styles.opacity = 1
          styles.visibility = 'visible'
        }
        if (this.parent.hasHiddenSlides) {
          if (this.matchIndex(this.parent.leftOutIndex)) {
            styles = this.calculatePosition(this.parent.leftIndices.length - 1, false, this.zIndex)
          } else if (this.matchIndex(this.parent.rightOutIndex)) {
            styles = this.calculatePosition(this.parent.rightIndices.length - 1, true, this.zIndex)
          }
        }
      }
      return assign(styles, {
        width: `${this.parent.slideWidth}px`,
        height: `${this.parent.slideHeight}px`,
        'border-width': `${this.parent.border}px`,
        transition: `transform ${this.parent.animationSpeed}ms, opacity ${this.parent.animationSpeed}ms, visibility ${this.parent.animationSpeed}ms`,
        '-webkit-transition': `-webkit-transform ${this.parent.animationSpeed}ms, opacity ${this.parent.animationSpeed}ms, visibility ${this.parent.animationSpeed}ms`
      })
    }
  },
  methods: {
    getSideIndex(array) {
      let index = -1
      array.forEach((pos, i) => {
        if (this.matchIndex(pos)) index = i
      })
      return index
    },
    matchIndex(index) {
      return (index >= 0) ? this.index === index : (this.parent.total + index) === this.index
    },
    calculatePosition(i, positive, zIndex) {
      const iPos = i + 1
      const y = parseInt(this.parent.perspective)
      const z = parseInt(this.parent.inverseScaling) + (iPos * 100)
      const leftRemain = (this.parent.space === 'auto') ? parseInt(iPos * (this.parent.width / 1.5)) : parseInt(iPos * this.parent.space)
      const transform = (positive) ? `translateX(${leftRemain}px) translateZ(-${z}px) rotateY(-${y}deg)` : `translateX(-${leftRemain}px) translateZ(-${z}px) rotateY(${y}deg)`
      const webkitTransform = transform
      const top = this.parent.space === 'auto' ? 0 : parseInt(iPos * this.parent.space)
      return { top, transform, webkitTransform, zIndex: zIndex - (Math.abs(i) + 1) }
    },
    goTo() {
      if (this.parent.clickable === true) {
        this.parent.goFar(this.index)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../../yyvip-stylus/base'
.carousel-3d-slide
  margin 0
  opacity 0
  text-align left
  overflow hidden
  visibility hidden
  box-sizing border-box
  background-color border-grey
  absolutePos(0, null, null, null)
  border 1PX solid rgba(0, 0, 0, 0.4)
  &.current
    z-index 999
    opacity 1 !important
    transform none !important
    visibility visible !important
</style>
