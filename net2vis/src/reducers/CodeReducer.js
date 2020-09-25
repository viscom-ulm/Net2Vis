import initialState from "./initialState";
import * as types from "../actions/types";

export default function codeReducer(state = initialState.code, action) {
  switch (action.type) {
    case types.LOAD_CODE_SUCCESS:
      return action.code;
    case types.UPDATE_CODE_SUCESS:
      return action.code;
    default:
      return state;
  }
}
