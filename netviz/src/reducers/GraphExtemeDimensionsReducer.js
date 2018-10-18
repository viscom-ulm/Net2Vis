
import initialState from './initialState';
import * as types from '../actions/types';

export default function graphExtremeDimensionsReducer(state = initialState.graph_extreme_dimensions, action) {
  switch(action.type) {
    case types.UPDATE_GRAPH_EXTREME_DIMENSIONS:
      var extremes = state;
      extremes.min_x = extremes.min_x > action.extreme_dimensions.min_x ? action.extreme_dimensions.min_x : extremes.min_x;
      extremes.max_x = extremes.max_x > action.extreme_dimensions.max_x ? action.extreme_dimensions.max_x : extremes.max_x;
      extremes.min_y = extremes.min_y > action.extreme_dimensions.min_y ? action.extreme_dimensions.min_y : extremes.min_y;
      extremes.max_y = extremes.max_y > action.extreme_dimensions.max_y ? action.extreme_dimensions.max_y : extremes.max_y;
      return extremes;
    default:
      return state;
  }
}
