import initialState from "./initialState";
import * as types from "../actions/types";

export default function layerExtremeDimensionsReducer(
  state = initialState.layer_extreme_dimensions,
  action
) {
  switch (action.type) {
    case types.SET_LAYERS_EXTREMES:
      var max = 0,
        min = Infinity;
      var max_f = 0,
        min_f = Infinity;
      var max_d = 0,
        min_d = Infinity;
      const layers = action.network.layers;
      for (var i in layers) {
        const dimensions = layers[i].properties.dimensions;
        if (dimensions.out.length > 1) {
          for (let j = 0; j < dimensions.out.length - 1; j++) {
            max = dimensions.out[j] > max ? dimensions.out[j] : max;
            min = dimensions.out[j] < min ? dimensions.out[j] : min;
          }
          max_f =
            dimensions.out[dimensions.out.length - 1] > max_f
              ? dimensions.out[dimensions.out.length - 1]
              : max_f;
          min_f =
            dimensions.out[dimensions.out.length - 1] < min_f
              ? dimensions.out[dimensions.out.length - 1]
              : min_f;
        } else if (dimensions.in.length === 1) {
          const dimensions = layers[i].properties.dimensions;
          max_d = dimensions.out[0] > max_d ? dimensions.out[0] : max_d;
          min_d = dimensions.out[0] < min_d ? dimensions.out[0] : min_d;
        }
        if (dimensions.in.length > 1) {
          for (let j = 0; j < dimensions.in.length - 1; j++) {
            max = dimensions.in[j] > max ? dimensions.in[j] : max;
            min = dimensions.in[j] < min ? dimensions.in[j] : min;
          }
        }
      }
      return {
        max_size: max,
        min_size: min,
        max_features: max_f,
        min_features: min_f,
        max_dense: max_d,
        min_dense: min_d,
      };
    default:
      return state;
  }
}
