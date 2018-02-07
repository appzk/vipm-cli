<template lang="pug">
page-confirm(:showPageModal="showPageModal", :onClickMask="onClickMask", :hideOnClickMask="hideOnClickMask", :hidePageModal="hidePageModal", :pageModalClass="pageModalClass", :showClose="showClose", :onClickClose="onClickClose", :hideOnClickClose="hideOnClickClose", :confirmButtonText="confirmButtonText", :onConfirm="onConfirm", :hideOnConfirm="hideOnConfirm", :cancelButtonText="cancelButtonText", :onCancel="onCancel", :hideOnCancel="hideOnCancel")
  p.message-confirm-title {{title}}
  p.message-confirm-message(v-if="message") {{message}}
</template>

<script>
import pageConfirm from '../pageConfirm'

export default {
  name: 'messageConfirm',
  components: {
    pageConfirm
  },
  props: {
    title: {
      type: String,
      required: false,
      default: '提示'
    },
    message: {
      type: String,
      required: false
    },
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
  }
}
</script>

<style lang="stylus">
@import '../../yyvip-stylus/base'

.message-confirm-title
  fontDpr(16)
  font-weight 700
  margin -20px 0 20px
.message-confirm-message
  padding 10px 0 0
</style>
