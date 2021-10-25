import initialState from "./initialState";
import * as types from "../actions/types";

export default function displayReducer(state = initialState.display, action) {
  switch (action.type) {
    case types.TOGGLE_CODE:
      return { ...state, code_toggle: !state.code_toggle };
    case types.TOGGLE_PREFERENCES:
      return { ...state, preferences_toggle: !state.preferences_toggle };
    case types.TOGGLE_LEGEND:
      return { ...state, legend_toggle: !state.legend_toggle };
    case types.TOGGLE_ALERT:
      return { ...state, alert_toggle: !state.alert_toggle };
    case types.TOGGLE_HELP:
      return { ...state, help_toggle: !state.help_toggle };
    case types.TOGGLE_UPLOAD:
      return { ...state, upload_toggle: !state.upload_toggle };
    default:
      return state;
  }
}
