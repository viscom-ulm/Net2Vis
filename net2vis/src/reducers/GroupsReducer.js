import initialState from "./initialState";
import * as types from "../actions/types";

export default function groupsReducer(state = initialState.groups, action) {
  switch (action.type) {
    case types.LOAD_GROUPS_SUCCESS:
      return action.groups;
    case types.UPDATE_GROUPS:
      return action.groups;
    default:
      return state;
  }
}
