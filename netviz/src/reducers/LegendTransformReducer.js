import initialState from './initialState';
import * as types from '../actions/types';

export default function legendTransformReducer(state = initialState.legend_transform, action) {
  switch (action.type) {
    case types.MOVE_LEGEND:
      var x = state.x - action.group_displacement[0];
      var y = state.y - action.group_displacement[1];
      return {x: x, y: y};
    default:
      return state;
  }
}
