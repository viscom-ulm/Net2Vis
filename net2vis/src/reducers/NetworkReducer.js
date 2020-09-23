import initialState from "./initialState";
import * as types from "../actions/types";

export default function networkReducer(state = initialState.network, action) {
  switch (action.type) {
    case types.LOAD_NETWORK_SUCCESS:
      return action.network;
    default:
      return state;
  }
}
