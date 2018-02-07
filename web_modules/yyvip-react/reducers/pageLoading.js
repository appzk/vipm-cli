import { Map } from 'immutable'
import types from '../actions/types'

const initialState = Map({
  pageLoading: false
})

export default function(state = initialState, action) {
  switch (action.type) {
  case types.SHOW_PAGE_LOADING:
    return state.set('pageLoading', true)
  case types.HIDE_PAGE_LOADING:
    return state.set('pageLoading', false)
  default:
    return state
  }
}
