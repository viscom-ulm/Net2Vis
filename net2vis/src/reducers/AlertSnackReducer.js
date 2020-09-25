import initialState from "./initialState";
import * as types from "../actions/types";

export default function alertSnackReducer(
  state = initialState.alert_snack,
  action
) {
  switch (action.type) {
    case types.UPDATE_ALERT_SNACK_SUCCESS:
      return action.alertSnack;
    default:
      return state;
  }
}
