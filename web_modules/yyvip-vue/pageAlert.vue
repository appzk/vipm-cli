<template lang="pug">
page-modal(:showPageModal="showPageModal", :onClickMask="onClickMask", :hideOnClickMask="hideOnClickMask", :hidePageModal="hidePageModal", :pageModalClass="pageModalClass", :showClose="showClose", :onClickClose="onClickClose", :hideOnClickClose="hideOnClickClose")
  .page-alert__body(slot="body")
    slot
  .page-alert__foot(slot="foot" @click.stop.prevent="bindConfirm($event)") {{ alertButtonText }}
</template>

<script>
import pageModal from 'yyvip-vue/pageModal'

export default {
  name: 'pageAlert',
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
    alertButtonText: {
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
    bindConfirm(e) {
      this.onConfirm && this.onConfirm(e)
      this.hideOnConfirm && this.hidePageModal && this.hidePageModal(e)
    }
  }
}
</script>

<style lang="stylus">
@import '../yyvip-stylus/base'

.page-alert__foot
  height 88spx
  color color-blue
  line-height 88spx
  border-top 1PX solid border-grey
</style>
