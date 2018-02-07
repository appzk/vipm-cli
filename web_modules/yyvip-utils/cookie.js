export function getCookie(name) {
  let value = `; ${document.cookie}`
  let parts = value.split(`; ${name}=`)
  return parts.length !== 2 ? null : parts.pop().split(';').shift()
}

export function setCookie(name, value, domain = 'yy.com', hours = 7 * 24) {
  let expires = new Date()
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000)
  document.cookie = `${name}=${value};domain=${domain};path=/;expires=${expires.toGMTString()}`
}

export function clearCookie(name, domain = 'yy.com') {
  setCookie(name, '', domain, -1)
}
