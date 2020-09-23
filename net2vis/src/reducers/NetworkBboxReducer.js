import initialState from "./initialState";
import * as types from "../actions/types";

export default function networkBboxReducer(
  state = initialState.network_bbox,
  action
) {
  switch (action.type) {
    case types.SET_NETWORK_BBOX:
      return action.bbox;
    default:
      return state;
  }
}
