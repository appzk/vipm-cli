import assign from 'lodash/assign'
import { stringify } from 'querystring'

function sendReq(img, url, str) {
  img.src = `${url}?${str}`
}

function sendAnalysis(urlList, str) {
  let currentIndex = 0
  let img = new Image()
  img.onload = clear
  img.onabort = clear
  img.onerror = _ => {
    if (currentIndex++ < urlList.length) {
      sendReq(img, urlList[currentIndex], str)
    } else {
      clear()
    }
  }

  function clear() {
    img.onload = null
    img.onabort = null
    img.onerror = null
    img = null
  }

  sendReq(img, urlList[currentIndex], str)
}

export default class HiidoAnalysis {
  constructor(params = {}, opts = {}, onlyProduction = true) {
    this.params = params
    this.onlyProduction = onlyProduction
    this.urlPath = opts.urlPath || 'j.gif'
    this.hostPath = `${window.location.protocol}//${opts.hostPath || 'ylog.hiido.com'}/`
    this.ipList = opts.ipList || ['183.61.2.95', '183.61.2.96', '183.61.2.97', '183.61.2.98']
  }

  getDomainUrl() {
    return this.hostPath + this.urlPath
  }

  getIpUrl(ip) {
    return `${window.location.protocol}//${ip}/${this.urlPath}`
  }

  setUid(uid) {
    this.params.uid = uid
  }

  send(params, useIp) {
    if (this.onlyProduction && LOCAL_ROOT !== 'prod') return
    const urlList = this.ipList.map(item => this.getIpUrl(item))
    if (!useIp) urlList.unshift(this.getDomainUrl())
    const paramsStr = stringify(assign({
      act: 'webvipfront',
      time: Math.floor(new Date().getTime() / 1000),
      uid: 0,
      bak1: '_',
      bak2: '_'
    }, this.params, params))
    sendAnalysis(urlList, paramsStr)
  }
}
