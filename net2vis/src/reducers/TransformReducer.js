import initialState from "./initialState";
import * as types from "../actions/types";

export default function transformReducer(
  state = initialState.group_transform,
  action
) {
  switch (action.type) {
    case types.MOVE_GROUP:
      var x = state.x - action.group_displacement[0];
      var y = state.y - action.group_displacement[1];
      return { x: x, y: y, scale: state.scale };
    case types.ZOOM_GROUP: // Zoming the Network Graph
      let factor = 1.2;
      if (action.group_zoom > 0) {
        // Zooming out
        factor = 1.0 / (action.group_zoom / factor); // Ensure, that the factor is of appropriate Size
      } else if (action.group_zoom < 0) {
        // Zooming in
        factor = -action.group_zoom / 1.1 / factor; // Ensure, that the factor is of appropriate Size
      }
      var scale = state.scale * factor; // Multiply the previous scale with the current factor
      return { x: state.x, y: state.y, scale: scale };
    default:
      return state;
  }
}
