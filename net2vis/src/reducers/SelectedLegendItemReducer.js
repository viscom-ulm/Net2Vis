import initialState from "./initialState";
import * as types from "../actions/types";

export default function selectedLegendItemReducer(
  state = initialState.selected_legend_item,
  action
) {
  switch (action.type) {
    case types.SET_SELECTED_LEGEND_ITEM:
      return action.name;
    default:
      return state;
  }
}
