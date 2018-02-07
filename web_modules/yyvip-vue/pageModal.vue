<template lang="pug">
.b__page-modal(v-show="showPageModalMask", :class="pageModalClass")
  .__main(@click.self.stop.prevent="bindClickMask($event)")
    transition(:name="pageModalTransition" @before-enter="syncMaskShow" @after-leave="syncMaskShow")
      .__box(v-show="showPageModal")
        .__close(v-if="showClose" @click.stop.prevent="bindClose($event)")
          .__icon
        .__body
          slot(name="body")
        .__foot
          slot(name="foot")
</template>

<script>
export default {
  name: 'pageModal',
  props: {
    showClose: {
      type: Boolean,
      required: false,
      default: false
    },
    showPageModal: {
      type: Boolean,
      required: true
    },
    onClickMask: {
      type: Function,
      required: false
    },
    hideOnClickMask: {
      type: Boolean,
      required: false,
      default: true
    },
    hidePageModal: {
      type: Function,
      required: false
    },
    pageModalClass: {
      type: Object,
      required: false,
      default: () => ({ 'page-modal--default': true })
    },
    pageModalTransition: {
      type: String,
      required: false,
      default: 'page-modal-transition'
    },
    onClickClose: {
      type: Function,
      required: false
    },
    hideOnClickClose: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      showPageModalMask: this.showPageModal
    }
  },
  methods: {
    syncMaskShow() {
      this.showPageModalMask = this.showPageModal
    },
    bindClickMask(e) {
      this.onClickMask && this.onClickMask(e)
      this.hideOnClickMask && this.hidePageModal && this.hidePageModal(e)
    },
    bindClose(e) {
      this.onClickClose && this.onClickClose(e)
      this.hideOnClickClose && this.hidePageModal && this.hidePageModal(e)
    }
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'
.page-modal
  fontDpr(14)
  color color-main
  text-align center
  &__main
    z-index 9899
    fullPageMask()
    webkitBoxCenter()
    &__box
      z-index 9900
      position relative

.page-modal--default
  .page-modal
    &__main
      &__box
        width 560spx
        background #fff
        border-radius 12spx
        &__close
          padding 20spx
          absolutePos(0, 0, null, null)
          &__icon
            bgImg('../yyvip-img/close.png', 19spx, 19spx)
        &__body
          padding 40spx 30spx
        &__foot
          fontDpr(16)

.page-modal-transition
  &-enter-active,
  &-leave-active
    transition all 0.3s ease-in-out
  &-enter,
  &-leave-to
    opacity 0
    transform scale(0.8)
</style>
