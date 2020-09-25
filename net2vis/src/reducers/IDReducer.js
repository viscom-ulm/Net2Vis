import initialState from "./initialState";
import * as types from "../actions/types";

export default function idReducer(state = initialState.id, action) {
  switch (action.type) {
    case types.SET_ID:
      return action.id;
    default:
      return state;
  }
}
