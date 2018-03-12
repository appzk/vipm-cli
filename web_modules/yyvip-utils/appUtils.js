import jsonp from './jsonp'
import assign from 'lodash/assign'
import { stringify } from 'querystring'
import { aori, isQQ, isQZ, isWeixin, getIosVersion } from './checkBrowser'
import { type, randomString, asyncLoadScript, replaceFunctionFromObject } from './utils'

import '../yyvip-stylus/openInBrowserTip.styl'

const qqScript = '//open.mobile.qq.com/sdk/qqapi.js?_bid=152'
const weixinScript = '//res.wx.qq.com/open/js/jweixin-1.0.0.js'
const qzScript = '//qzonestyle.gtimg.cn/qzone/phone/m/v4/widget/mobile/jsbridge.js?_bid=339'

class OpenInBrowserTip {
  constructor() {
    this.init()
    return this
  }

  init() {
    this.eId = randomString()
    const tip = document.createElement('div')
    tip.setAttribute('id', this.eId)
    tip.setAttribute('class', 'opne-in-browser-tip')
    tip.innerHTML = '<div class="opne-in-browser-tip__img"><div class="opne-in-browser-tip__img__text">点击右上角<br/>在浏览器中打开</div></div>'
    document.body.appendChild(tip)

    tip.addEventListener('click', function(e) {
      e.preventDefault()
      e.stopPropagation()
      this.hide()
    }.bind(this))
  }

  update(opts) {
    assign(this, opts)
  }

  hide() {
    document.getElementById(this.eId).style.display = 'none'
    this.onHide && this.onHide()
    return this
  }

  show() {
    document.getElementById(this.eId).style.display = 'block'
    this.onShow && this.onShow()
    return this
  }
}

export const openInBrowserTip = new OpenInBrowserTip()

function adaptedApp(opts, cb) {
  const { universalUrl, yingyongbaoUrl } = opts
  if (aori === 'ios' && getIosVersion() >= 9 && universalUrl) {
    window.location.href = universalUrl
  } else if (isQQ || isWeixin) {
    if (yingyongbaoUrl) {
      window.location.href = yingyongbaoUrl
    } else {
      opts.onWeixin && opts.onWeixin()
    }
  } else {
    cb && cb()
  }
}

function openIframeJump(opts) {
  let timer = null
  const { schemeUrl, onOpen, onTimeout, timeout = 2000 } = opts
  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none; width: 0; height: 0'
  document.body.appendChild(iframe)
  iframe.src = schemeUrl
  onOpen && onOpen()
  timer = setTimeout(function() {
    onTimeout && onTimeout()
    clearTimeout(timer)
  }, timeout)

  function onVisibilityChangeCreator(type) {
    return function onVisibilityChange() {
      if (document.hidden || document.webkitHidden) clearTimeout(timer)
      document.removeEventListener(type, onVisibilityChange)
    }
  }

  function onPagehide() {
    clearTimeout(timer)
    document.removeEventListener('pagehide', onPagehide)
  }

  document.addEventListener('visibilitychange', onVisibilityChangeCreator('visibilitychange'))
  document.addEventListener('webkitvisibilitychange', onVisibilityChangeCreator('webkitvisibilitychange'))
  window.addEventListener('pagehide', onPagehide)
}

export const openApp = (opts) => {
  adaptedApp(opts, function() {
    openIframeJump(opts)
  })
}

export const downloadApp = (opts) => {
  const { iosDownload, androidDownload, onDownload, onNoDownload } = opts
  if (opts.onWeixin) {
    replaceFunctionFromObject(opts, 'onWeixin', fn => () => {
      if (aori === 'ios' && iosDownload) {
        window.location.href = iosDownload
      } else {
        fn()
      }
    })
  }
  adaptedApp(opts, function() {
    const download = aori === 'ios' ? iosDownload : androidDownload
    if (download) {
      onDownload && onDownload()
      let downTimer = setTimeout(function() {
        window.location.href = download
        clearTimeout(downTimer)
      }, 0)
    } else {
      onNoDownload && onNoDownload()
    }
  })
}

export const simpleOpenAndDownloadApp = (opts) => {
  openInBrowserTip.update({ onShow: opts.onTipShow, onHide: opts.onTipHide })
  let newOpts = assign({ onWeixin: () => openInBrowserTip.show() }, opts)
  openApp(assign({
    onTimeout: () => downloadApp(newOpts)
  }, newOpts))
}

export const simpleOpenApp = (opts) => {
  openInBrowserTip.update({ onShow: opts.onTipShow, onHide: opts.onTipHide })
  openApp(assign({ onWeixin: () => openInBrowserTip.show() }, opts))
}

export const simpleDownloadApp = (opts) => {
  openInBrowserTip.update({ onShow: opts.onTipShow, onHide: opts.onTipHide })
  downloadApp(assign({ onWeixin: () => openInBrowserTip.show() }, opts))
}

const qqShareCallbackConfig = {
  0: 'onMenuShareQQ',
  1: 'onMenuShareQZone',
  2: 'onMenuShareAppMessage',
  3: 'onMenuShareTimeline'
}
const shareCallbackCreator = (platform, cb) => () => cb && cb(platform)

function emptyFunction() {}

function doWeixinShare(data) {
  const wx = window.wx
  const { title, desc, link, imgUrl, swapTitle, callback } = data
  wx.config(assign({ debug: false, jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] }, data.wxConfig))
  wx.ready(() => {
    const config = { title, desc, link, imgUrl, type: '', dataUrl: '' }
    wx.onMenuShareQQ(assign({ success: shareCallbackCreator('onMenuShareQQ', callback) }, config))
    wx.onMenuShareQZone(assign({ success: shareCallbackCreator('onMenuShareQZone', callback) }, config))
    wx.onMenuShareAppMessage(assign({ success: shareCallbackCreator('onMenuShareAppMessage', callback) }, config))
    if (swapTitle) {
      wx.onMenuShareTimeline(assign({ success: shareCallbackCreator('onMenuShareTimeline', callback) }, config, { title: desc, desc: title }))
    } else {
      wx.onMenuShareTimeline(assign({ success: shareCallbackCreator('onMenuShareTimeline', callback) }, config))
    }
  })
}

function doWeixinRecord(data) {
  const wx = window.wx
  let hook = data.hook
  wx.config(assign({ debug: false, jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice'] }, data.wxConfig))
  wx.ready(_ => hook())
}

export function initWeixinShare(data) {
  if (type(data.wxConfig) !== 'object') return
  if (window.wx) {
    doWeixinShare(data)
  } else {
    asyncLoadScript(weixinScript, () => doWeixinShare(data))
  }
}

export function initWeixinRecord(data) {
  if (type(data.wxConfig) !== 'object') return
  if (window.wx) {
    doWeixinRecord(data)
  } else {
    asyncLoadScript(weixinScript, () => doWeixinRecord(data))
  }
}

function doQQShare(data) {
  const mqq = window.mqq
  const { title, desc, link, imgUrl, swapTitle, callback } = data
  const config = { title, desc, share_url: link, image_url: imgUrl }
  try {
    if (callback) {
      mqq.ui.setOnShareHandler((type) => {
        if (type === 3 && swapTitle) config.title = desc
        config.back = true
        config.share_type = type
        mqq.ui.shareMessage(config, (result) => {
          if (result.retCode === 0) shareCallbackCreator(qqShareCallbackConfig[type], callback)()
        })
      })
    } else {
      mqq.data.setShareInfo(config)
    }
  } catch (e) {}
}

function initQQShare(data) {
  if (window.mqq) {
    doQQShare(data)
  } else {
    asyncLoadScript(qqScript, () => doQQShare(data))
  }
}

function doQZShare(data) {
  const QZAppExternal = window.QZAppExternal
  const { title, desc, link, imgUrl, swapTitle } = data
  if (QZAppExternal && QZAppExternal.setShare) {
    const descList = []
    const linkList = []
    const titleList = []
    const imgUrlList = []
    for (let i = 0; i < 5; i++) {
      linkList.push(link)
      imgUrlList.push(imgUrl)
      if (i === 4 && swapTitle) {
        titleList.push(desc)
        descList.push(title)
      } else {
        titleList.push(title)
        descList.push(desc)
      }
    }
    QZAppExternal.setShare(emptyFunction, { type: 'share', image: imgUrlList, title: titleList, summary: descList, shareURL: linkList })
  }
}

function initQZShare(data) {
  if (window.QZAppExternal) {
    doQZShare(data)
  } else {
    asyncLoadScript(qzScript, () => doQZShare(data))
  }
}

export function setShareConfig(opts) {
  if (type(opts) !== 'object') return
  isQQ && initQQShare(opts)
  isQZ && initQZShare(opts)
  isWeixin && initWeixinShare(opts)
}

export function initShare(opts, wxReqUrl, wxData) {
  if (type(opts) !== 'object') return
  if (!opts.title || !opts.desc) return
  const config = assign({}, opts)
  if (!opts.link) config.link = window.location.href
  if (isWeixin) {
    jsonp(`${wxReqUrl}?${stringify(wxData || { requestUrl: window.location.href.split('#')[0] })}`, null, (error, json) => {
      if (error) console.log(error)
      else if (type(json) === 'object' && type(json.data) === 'object') {
        config.wxConfig = assign({}, json.data)
        setShareConfig(config)
      }
    })
  } else {
    setShareConfig(config)
  }
}

// 初始化微信录音相关接口
export function initRecord(opts, wxReqUrl, wxData) {
  if (type(opts) !== 'object') return
  const config = assign({}, opts)
  if (!opts.hook) config.hook = _ => {}
  if (isWeixin) {
    jsonp(`${wxReqUrl}?${stringify(wxData || { requestUrl: window.location.href.split('#')[0] })}`, null, (error, json) => {
      if (error) console.log(error)
      else if (type(json) === 'object' && type(json.data) === 'object') {
        config.wxConfig = assign({}, json.data)
        initWeixinRecord(config)
      }
    })
  } else {
    initWeixinRecord(config)
  }
}
