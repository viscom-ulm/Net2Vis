import initialState from "./initialState";
import * as types from "../actions/types";

export default function legendPreferencesReducer(
  state = initialState.legend_preferences,
  action
) {
  switch (action.type) {
    case types.UPDATE_LEGEND_PREFERENCES_SUCCESS:
      return action.legend_preferences;
    case types.LOAD_LEGEND_PREFERENCES_SUCCESS:
      return action.legend_preferences;
    default:
      return state;
  }
}
