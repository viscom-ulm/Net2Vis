import initialState from './initialState';
import * as types from '../actions/types';

export default function transformReducer(state = initialState.group_transform, action) {
  switch (action.type) {
    case types.MOVE_GROUP:
      var x = state.x - action.group_displacement[0];
      var y = state.y - action.group_displacement[1];
      return {x: x, y: y, scale: state.scale};
    case types.ZOOM_GROUP:
      var factor = 1.0;
      if(action.group_zoom > 0) {
        factor = 1.0/(action.group_zoom / 2.0);
      } else {
        factor = 1.0*((-action.group_zoom) / 2.0);
      }
      var scale = state.scale * factor;
      return {x: state.x, y: state.y, scale: scale};
    default:
      return state;
  }
}
