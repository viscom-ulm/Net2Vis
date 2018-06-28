import initialState from './initialState';

export default function displayReducer(state = initialState.display, action) {
  switch (action.type) {
    case 'TOGGLE_CODE':
      return {code: !state.code, preferences: state.preferences, legend: state.legend}
    case 'TOGGLE_PREFERENCES':
      return {code: state.code, preferences: !state.preferences, legend: state.legend}
    case 'TOGGLE_LEGEND':
      return {code: state.code, preferences: state.preferences, legend: !state.legend}
    default:
      return state;
  }
}
