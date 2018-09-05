import initialState from './initialState';
import * as types from '../actions/types';

export default function pereferencesReducer(state = initialState.preferences, action) {
  switch(action.type) {
    case types.SET_LAYERS_EXTREMES:
      var max = 0, min = Infinity;
      const layers = action.network.layers;
      for (var i in layers) {
        const dimensions = layers[i].properties.dimensions;
        if (Array.isArray(dimensions.out)) {
          for (let j = 0; j < dimensions.out.length - 1; j++) {
            max = dimensions.out[j] > max ? dimensions.out[j] : max;
            min = dimensions.out[j] < min ? dimensions.out[j] : min;  
          }
        }
        if (Array.isArray(dimensions.in)) {
          for (let j = 0; j < dimensions.in.length - 1; j++) {
            max = dimensions.in[j] > max ? dimensions.in[j] : max;
            min = dimensions.in[j] < min ? dimensions.in[j] : min;  
          }
        }
      }
      return Object.assign({}, state, {
        layer_extreme_dimensions: {
          max_size: max,
          min_size: min
        }
      });
    case types.CHANGE_LAYERS_MIN_HEIGHT:
      var max_size = state.layer_display_height.max_size;
      return Object.assign({}, state, {
        layer_display_height: {
          min_size: action.min_height,
          max_size: max_size
        }
      });
    case types.CHANGE_LAYERS_MAX_HEIGHT:
      var min_size = state.layer_display_height.min_size;
      return Object.assign({}, state, {
        layer_display_height: {
          min_size: min_size,
          max_size: action.max_height
        }
      });
    case types.CHANGE_LAYERS_WIDTH:
      return Object.assign({}, state, {
        layer_display_width: action.width
      });
    case types.CHANGE_LAYERS_SPACING_HORIZONTAL:
      return Object.assign({}, state, {
        layers_spacing_horizontal: action.spacing
      });
    case types.CHANGE_LAYERS_SPACING_VERTICAL:
      return Object.assign({}, state, {
        layers_spacing_vertical: action.spacing
      });
    default:
      return state;
  }
}
