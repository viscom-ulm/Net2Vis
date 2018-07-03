import initialState from './initialState';

export default function displayReducer(state = initialState.display, action) {
  switch (action.type) {
    case 'TOGGLE_CODE':
      return {code_toggle: !state.code_toggle, preferences_toggle: state.preferences_toggle, legend_toggle: state.legend_toggle}
    case 'TOGGLE_PREFERENCES':
      return {code_toggle: state.code_toggle, preferences_toggle: !state.preferences_toggle, legend_toggle: state.legend_toggle}
    case 'TOGGLE_LEGEND':
      return {code_toggle: state.code_toggle, preferences_toggle: state.preferences_toggle, legend_toggle: !state.legend_toggle}
    default:
      return state;
  }
}
