import initialState from "./initialState";
import * as types from "../actions/types";

export default function selectionReducer(
  state = initialState.selection,
  action
) {
  switch (action.type) {
    case types.SELECT_LAYER: // One new Layer To Select
      return state.concat(action.id);
    case types.SELECT_LAYERS: // Multiple New Layers to select
      var toSelect = [];
      for (var i in action.layers) {
        toSelect.push(action.layers[i].id);
      }
      return toSelect;
    case types.DESELECT_LAYER: // One Layer to deselect
      return state.filter((item) => item !== action.id);
    case types.DESELECT_LAYERS: // Deselect all Layers
      return [];
    default:
      return state;
  }
}
