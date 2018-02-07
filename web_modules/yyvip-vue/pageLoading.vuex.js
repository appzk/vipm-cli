import types from './mutationTypes'

const state = {
  pageLoading: false
}

const getters = {
  pageLoading: state => state.pageLoading
}

export const actions = {
  showPageLoading({ commit }) {
    commit(types.SHOW_PAGE_LOADING)
  },
  hidePageLoading({ commit }) {
    commit(types.HIDE_PAGE_LOADING)
  }
}

const mutations = {
  [types.SHOW_PAGE_LOADING](state) {
    state.pageLoading = true
  },
  [types.HIDE_PAGE_LOADING](state) {
    state.pageLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
