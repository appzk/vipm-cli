import $ from 'zepto'

import './toast.styl'
import tpl from './toast.art'
import { randomString } from '../../yyvip-utils/utils'

let timer = 0
const $toast = $(tpl({ id: randomString() }))

export function updateToastClass(string) {
  $toast.removeClass('toast--default').addClass(string)
}

export function showToast(data = {}) {
  const { content = '', timeout = 3000 } = data
  clearTimeout(timer)
  $toast.text(content).appendTo($('body'))
  timer = setTimeout(() => {
    hideToast()
  }, timeout)
}

export function hideToast() {
  clearTimeout(timer)
  $toast.remove()
}
