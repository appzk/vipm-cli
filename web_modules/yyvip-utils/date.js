import { type } from './utils'
import forEach from 'lodash/forEach'

export function convertToDate(date = new Date()) {
  const typeDate = type(date)
  if (typeDate === 'date') return date
  if (typeDate === 'string') date = date.replace(/-/g, '/')
  return new Date(date)
}

export function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
}

export function getDaysOfMonth(year, month) {
  return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
}

export function dateFormat(date = new Date(), fmt = 'yyyy-MM-dd') {
  const newDate = convertToDate(date)

  let rules = {
    'M+': newDate.getMonth() + 1,
    'd+': newDate.getDate(),
    'h+': newDate.getHours(),
    'm+': newDate.getMinutes(),
    's+': newDate.getSeconds()
  }

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  forEach(rules, (value, key) => {
    if (new RegExp('(' + key + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? value : ('00' + value).substr(('' + value).length))
  })

  return fmt
}

export const getSubMonth = sub => (date = new Date()) => {
  const state = {
    0: {
      year: 0,
      month: 0
    },
    1: {
      year: 1,
      month: -12
    },
    2: {
      year: -1,
      month: 12
    }
  }
  const newDate = convertToDate(date)
  const month = newDate.getMonth()
  const year = newDate.getFullYear()
  const newDay = newDate.getDate()
  const newMonth = month + (isNaN(sub) ? 0 : parseInt(sub))
  const newState = state[newMonth < 0 ? 2 : (newMonth > 11 ? 1 : 0)]
  newDate.setMonth(newMonth + newState.month)
  newDate.setYear(year + newState.year)
  newDate.setDate(Math.min(newDay, getDaysOfMonth(year + newState.year, newMonth + newState.month)))
  return newDate
}

export const getRelativeDays = (days) => (date = new Date()) => {
  return new Date(convertToDate(date).getTime() + days * 24 * 3600 * 1000)
}
