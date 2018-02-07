<template lang="pug">
.touch-slide
  slot
</template>

<script>
export default {
  name: 'touchSlide'
}
</script>

<style lang="stylus">
@import '~yyvip-stylus/base'

.touch-slide
  width 100%
  height 100%
  flex-shrink 0
  > a
    display block
    > img
      width 100%
      height 100%
</style>
