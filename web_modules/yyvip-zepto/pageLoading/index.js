import $ from 'zepto'

import './pageLoading.styl'
import tpl from './pageLoading.art'
import { randomString } from '../../yyvip-utils/utils'

const id = randomString()
$('body').append(tpl({ id }))
const $id = $('#' + id)

export function showPageLoading() {
  $id.show()
}

export function hidePageLoading() {
  $id.hide()
}
