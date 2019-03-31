import initialState from './initialState';
import * as types from '../actions/types';

export default function displayReducer(state = initialState.display, action) {
  switch (action.type) {
    case types.TOGGLE_CODE:
      return {code_toggle: !state.code_toggle, preferences_toggle: state.preferences_toggle, legend_toggle: state.legend_toggle}
    case types.TOGGLE_PREFERENCES:
      return {code_toggle: state.code_toggle, preferences_toggle: !state.preferences_toggle, legend_toggle: state.legend_toggle}
    case types.TOGGLE_LEGEND:
      return {code_toggle: state.code_toggle, preferences_toggle: state.preferences_toggle, legend_toggle: !state.legend_toggle}
    default:
      return state;
  }
}
