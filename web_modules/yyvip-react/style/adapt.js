import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import { firstUpperCase } from '../../yyvip-utils/utils'

export function adapt(style, prefix = ['O', 'ms', 'Moz', 'Webkit'], onPreFix) {
  const result = assign({}, style)
  forEach(style, (item, key) => {
    forEach(prefix, pre => {
      result[`${pre}${firstUpperCase(key)}`] = onPreFix ? onPreFix(item, key, pre) : item
    })
  })
  return result
}

export const display = (x) => (x === 0 ? { display: 'none' } : {})
export const opacity = (x) => ({ opacity: parseFloat((x / 100).toFixed(2)) })
export const transform = (x) => adapt({ transform: `translateY(${100 - x}%)` })
export const scale = (x) => adapt({ transform: `scale(${x / 500 + 0.8})` })
