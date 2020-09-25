import initialState from "./initialState";
import * as types from "../actions/types";

export default function errorReducer(state = initialState.error, action) {
  switch (action.type) {
    case types.ADD_ERROR:
      return action.data;
    case types.REMOVE_ERROR:
      return {};
    default:
      return state;
  }
}
