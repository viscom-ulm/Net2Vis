import initialState from "./initialState";
import * as types from "../actions/types";

export default function legendBboxReducer(
  state = initialState.legend_bbox,
  action
) {
  switch (action.type) {
    case types.SET_LEGEND_BBOX:
      return action.bbox;
    default:
      return state;
  }
}
