<template lang="pug">
.yy-page-loading-mask(v-show="pageLoading")
  .yy-loading.yy-page-loading
</template>

<script>
export default {
  name: 'yyPageLoading',
  props: {
    pageLoading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'

.yy-page-loading-mask
  z-index 9999
  fullPageMask()

.yy-loading
  bgImg('../yyvip-img/yy-loading.png', 106spx, 106spx)
  animation yypageloadingplay 1.0s linear infinite

.yy-page-loading
  z-index 10000
  centerBox(106spx, 106spx)

@keyframes yypageloadingplay
  0%
    transform rotate(0deg)
  100%
    transform rotate(360deg)
</style>
