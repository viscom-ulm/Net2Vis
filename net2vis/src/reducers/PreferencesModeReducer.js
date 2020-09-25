import initialState from "./initialState";
import * as types from "../actions/types";

export default function preferencesModeReducer(
  state = initialState.preferences_mode,
  action
) {
  switch (action.type) {
    case types.SET_PREFERENCE_MODE:
      return action.name;
    default:
      return state;
  }
}
