import initialState from './initialState';
import * as types from '../actions/types';

export default function layersSettignsReducer(state = initialState.layers_settings, action) {
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
      }
      return Object.assign({}, state, {
        layer_extreme_dimensions: {
          max_size: max,
          min_size: min
        }
      });
    default:
      return state;
  }
}
