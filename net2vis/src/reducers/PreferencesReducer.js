import initialState from "./initialState";
import * as types from "../actions/types";

export default function preferencesReducer(
  state = initialState.preferences,
  action
) {
  switch (action.type) {
    case types.UPDATE_PREFERENCES_SUCCESS:
      return action.preferences;
    case types.LOAD_PREFERENCES_SUCCESS:
      return action.preferences;
    default:
      return state;
  }
}
