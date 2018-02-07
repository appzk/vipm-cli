import { type } from './utils'
import { aori } from './checkBrowser'

function empty() {}

function device(map) {
  if (aori === 'android' || aori === 'ios') return map[aori]()
}

// ios基本方法接口
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) { return callback(window.WebViewJavascriptBridge) }
  if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback) }
  window.WVJBCallbacks = [callback]
  const WVJBIframe = document.createElement('iframe')
  WVJBIframe.style.display = 'none'
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)
}

export function wrapClientFn(obj, fn, onNotFound, ...args) {
  if (type(window[obj]) === 'object' && type(window[obj][fn]) === 'function') {
    return window[obj][fn](...args)
  } else if (type(onNotFound) === 'function') {
    return onNotFound()
  }
}

export function joinChannel(sid = 80012, ssid = 0) {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokeJoinChannel', { sid, subsid: ssid }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'joinChannel', empty, JSON.stringify({ sid, subid: ssid }))
    }
  })
}

export function joinChannelUseUid(uid) {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokeNianNianChannel', { uid }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'InvokeNianNianChannel', empty, JSON.stringify({ uid }))
    }
  })
}

export function joinFirstChannel() {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokerandomChannel', {}, empty)
      })
    },
    android() {
      wrapClientFn('jsClient', 'sendCommand', empty, 'join_channel_random', '')
    }
  })
}

// 进频道 手Y(http://git.yypm.com/yyue/yynews-201701-feat-mob/blob/master/src/js/lib/yyClient.js)
export function joinChannelOfYY(sid = 80012, ssid = 0) {
  window.YYApiCore.invokeClientMethod('ui', 'goto', {
    uri: `yymobile://Channel/Live/${sid}/${ssid}`
  })
}

// 进入陪聊直播间
export function joinSingleLive(uid) {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokeSingleLive', { uid }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'jumpPage', empty, JSON.stringify({ page: 'join_single_live_channel', uid }))
    }
  })
}

// 进入个人页面
export function jumpPersonalPage() {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokePage', { idx: 3 }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'jumpPersonalPage', empty)
    }
  })
}

// 进入首页
export function jumpHomePage() {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokePage', { idx: 0 }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'jumpPage', empty, JSON.stringify({ page: 'live' }))
    }
  })
}

// 进入消息页面
export function jumpMessagePage() {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokePage', { idx: 2 }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'jumpPage', empty, JSON.stringify({ page: 'message' }))
    }
  })
}

// 摇一摇
export function jumpShakePage() {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokePage', { idx: 4 }, empty)
      })
    },
    android() {
      wrapClientFn('yyliveworld', 'jumpPage', empty, JSON.stringify({ page: 'shake' }))
    }
  })
}

// 红包兑换
export function jumpYYMoneyPage() {
  device({
    ios: function() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('InvokePage', { idx: 5 }, empty)
      })
    },
    android: function() {
      wrapClientFn('yyliveworld', 'jumpPage', empty, JSON.stringify({ page: 'exchange' }))
    }
  })
}

// 写日志
export function writeMessage(message) {
  device({
    ios() {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('logToWrite', message, empty)
      })
    }
  })
}

// 检查是否登录
export function checkLogin() {
  device({
    android() {
      wrapClientFn('yyliveworld', 'checkLoginState', empty, 'onLoginStateChecked')
    }
  })
}

// 获取Ticket
export function getTicket() {
  device({
    android() {
      wrapClientFn('yyliveworld', 'getTicket', empty, 'onTicketGot')
    }
  })
}
