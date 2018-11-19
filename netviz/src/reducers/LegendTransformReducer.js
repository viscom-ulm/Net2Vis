import initialState from './initialState';
import * as types from '../actions/types';

export default function legendTransformReducer(state = initialState.legend_transform, action) {
  switch (action.type) {
    case types.MOVE_LEGEND:
      var x = state.x - action.group_displacement[0];
      var y = state.y - action.group_displacement[1];
      return {x: x, y: y, scale: state.scale};
    case types.ZOOM_LEGEND: // Zoming the Legend Graph
      var factor = 1.0;
      if(action.legend_zoom > 0) { // Zooming out
        factor = 1.0/(action.legend_zoom / 2.0); // Ensure, that the factor is of appropriate Size
      } else if (action.legend_zoom < 0) { // Zooming in
        factor = 1.0*((-action.legend_zoom) / 2.0); // Ensure, that the factor is of appropriate Size
      }
      var scale = state.scale * factor; // Multiply the previous scale with the current factor
      return {x: state.x, y: state.y, scale: scale};
    default:
      return state;
  }
}
