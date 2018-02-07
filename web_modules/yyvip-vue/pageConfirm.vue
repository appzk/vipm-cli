<template lang="pug">
page-modal(:showPageModal="showPageModal", :onClickMask="onClickMask", :hideOnClickMask="hideOnClickMask", :hidePageModal="hidePageModal", :pageModalClass="pageModalClass", :showClose="showClose", :onClickClose="onClickClose", :hideOnClickClose="hideOnClickClose")
  .page-confirm__body(slot="body")
    slot
  .b__page-confirm__foot(slot="foot")
    .__cancel(@click.stop.prevent="bindCancel($event)") {{ cancelButtonText }}
    .__confirm(@click.stop.prevent="bindConfirm($event)") {{ confirmButtonText }}
</template>

<script>
import pageModal from 'yyvip-vue/pageModal'

export default {
  name: 'pageConfirm',
  components: {
    pageModal
  },
  props: {
    showClose: {
      type: Boolean,
      required: false,
      default: false
    },
    onClickClose: {
      type: Function,
      required: false
    },
    hideOnClickClose: {
      type: Boolean,
      required: false,
      default: true
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
      required: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: '取消'
    },
    onCancel: {
      type: Function,
      required: false
    },
    hideOnCancel: {
      type: Boolean,
      required: false,
      default: true
    },
    confirmButtonText: {
      type: String,
      required: false,
      default: '确定'
    },
    onConfirm: {
      type: Function,
      required: false
    },
    hideOnConfirm: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    bindCancel(e) {
      this.onCancel && this.onCancel(e)
      this.hideOnCancel && this.hidePageModal && this.hidePageModal(e)
    },
    bindConfirm(e) {
      this.onConfirm && this.onConfirm(e)
      this.hideOnConfirm && this.hidePageModal && this.hidePageModal(e)
    }
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'

.page-confirm__foot
  height 88spx
  line-height 88spx
  webkitBoxCenter()
  border-top 1PX solid border-grey
  &__cancel,
  &__confirm
    flex 1
    box-sizing border-box
  &__cancel
    color color-grey
  &__confirm
    color color-blue
    border-left 1PX solid border-grey
</style>
