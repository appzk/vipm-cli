<template lang="pug">
page-alert(:showPageModal="showPageModal", :onClickMask="onClickMask", :hideOnClickMask="hideOnClickMask", :hidePageModal="hidePageModal", :pageModalClass="pageModalClass", :showClose="showClose", :onClickClose="onClickClose", :hideOnClickClose="hideOnClickClose", :alertButtonText="alertButtonText", :onConfirm="onConfirm", :hideOnConfirm="hideOnConfirm")
  p.message-alert-title {{title}}
  p.message-alert-message(v-if="message") {{message}}
</template>

<script>
import pageAlert from '../pageAlert'

export default {
  name: 'messageAlert',
  components: {
    pageAlert
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
    hidePageModal: {
      type: Function,
      required: false
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
  }
}
</script>

<style lang="stylus">
@import '../../yyvip-stylus/base'

.message-alert-title
  fontDpr(16)
  font-weight 700
  margin -20px 0 20px
.message-alert-message
  padding 10px 0 0
</style>
