import types from './mutationTypes'

let timer = 0

const state = {
  toastState: false,
  toastContent: undefined
}

const getters = {
  getToastState: state => state.toastState,
  getToastContent: state => state.toastContent
}

export const actions = {
  showToast({ commit }, data = {}) {
    const { content, timeout = 3000 } = data
    clearTimeout(timer)
    commit(types.SHOW_TOAST, content)
    timer = setTimeout(() => {
      clearTimeout(timer)
      commit(types.HIDE_TOAST)
    }, timeout)
  },
  hideToast({ commit }) {
    clearTimeout(timer)
    commit(types.HIDE_TOAST)
  }
}

const mutations = {
  [types.SHOW_TOAST](state, data) {
    state.toastState = true
    state.toastContent = data
  },
  [types.HIDE_TOAST](state) {
    state.toastState = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
