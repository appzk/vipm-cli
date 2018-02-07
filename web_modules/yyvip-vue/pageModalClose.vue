<template lang="pug">
.b__page-modal-close(v-show="show" v-bind:class="pageModalClass")
  .__main
    .__box
      slot
    .__close-btn(@click.self.stop.prevent="bindClickClose($event)") X
</template>

<script>
export default {
  name: 'pageModalClose',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    onClickClose: {
      type: Function,
      required: false
    },
    hidePageModal: {
      type: Function,
      required: false
    },
    pageModalClass: {
      type: Object,
      required: false,
      default: () => ({ 'page-modal-close--default': true })
    }
  },
  methods: {
    bindClickClose(e) {
      this.onClickClose && this.onClickClose(e)
      this.hidePageModal && this.hidePageModal(e)
    }
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'
.page-modal-close
  fontDpr(14)
  color color-main
  text-align center
  &__main
    z-index 9899
    fullPageMask()
    webkitBoxVCenter()
    &__box
      z-index 9900
    &__close-btn
      color #fff
      fontDpr(20)
      width 80spx
      preHeight(80spx)
      margin-top 60spx
      text-align center
      border-radius 50%
      border 3PX solid #fff

.page-modal-close--default
  .page-modal-close
    &__main
      &__box
        width 560spx
        background #fff
        border-radius 24spx
</style>
