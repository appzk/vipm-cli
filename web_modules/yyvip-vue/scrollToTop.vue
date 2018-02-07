<template lang="pug">
transition(name="scroll-to-top")
  p.b__scroll-to-top(v-if="showToTop" @click.stop.prevent="scrollToTop" v-bind:class="classObject")
</template>

<script>
import { getDpr } from '../yyvip-flexible/utils'
import { scrollTop } from '../yyvip-utils/checkBrowser'

const dpr = getDpr()

export default {
  name: 'scrollToTop',
  data() {
    return {
      showToTop: false
    }
  },
  props: {
    scrollToTopClass: {
      type: Object,
      required: false,
      default: () => ({ 'scroll-to-top--default': true })
    }
  },
  computed: {
    classObject() {
      return this.scrollToTopClass
    }
  },
  methods: {
    handleScroll() {
      this.showToTop = scrollTop() > 25 * dpr
    },
    scrollToTop() {
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
  },
  created() {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'
.scroll-to-top
  right 0spx
  bottom 60spx
  z-index 999
  position fixed
  &-enter,
  &-leave-active
    opacity 0
  &-enter-active
  &-leave-active
    transition opacity 1s ease
  &--default
    width 60spx
    height 60spx
    background url('../yyvip-img/scroll-to-top.jpg') center center no-repeat
    background-size 60spx 60spx
</style>
