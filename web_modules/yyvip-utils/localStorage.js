const local = 'localStorage'
const session = 'sessionStorage'
const get = (type) => (key) => window[type].getItem(key)
const set = (type) => (key, value) => {
  window[type].removeItem(key)
  try {
    window[type].setItem(key, value)
  } catch (e) {}
}
const clear = (type) => (key) => window[type].removeItem(key)

export const getLocal = get(local)
export const setLocal = set(local)
export const clearLocal = clear(local)
export const getSession = get(session)
export const setSession = set(session)
export const clearSession = clear(session)
