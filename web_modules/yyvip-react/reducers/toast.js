import types from '../actions/types'
import { Map } from 'immutable'

const initialState = Map({
  show: false,
  content: ''
})

export default function(state = initialState, action) {
  switch (action.type) {
  case types.SHOW_TOAST_SAGA:
    const { content } = action.payload
    return state.set('show', true).set('content', content)
  case types.HIDE_TOAST_SAGA:
    return state.set('show', false)
  default:
    return state
  }
}
