import initialState from './initialState';
import * as types from '../actions/types';

export default function pereferencesReducer(state = initialState.layer_extreme_dimensions, action) {
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
      return {
        max_size: max,
        min_size: min
      }
    default:
      return state;
  }
}