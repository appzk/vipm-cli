import { stringify } from 'querystring'

export function createLoginIframe(ticket, busiId, busiUrl, onSuccess, onFail) {
  const apiUrl = '//lgn.yy.com/lgn/jump/authentication.do'
  const params = {
    ticket,
    busiId,
    direct: '1',
    appid: '5060',
    action: 'authenticate',
    busiUrl: encodeURIComponent(busiUrl)
  }

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'display: none; width: 0; height: 0'
  document.body.appendChild(iframe)

  setTimeout(_ => (iframe.src = `${apiUrl}?${stringify(params)}`), 0)

  iframe.onload = function() {
    onSuccess && onSuccess()
  }

  iframe.onerror = function() {
    onFail && onFail()
  }
}
