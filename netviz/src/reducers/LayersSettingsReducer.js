import initialState from './initialState';

export default function layersSettignsReducer(state = initialState.layers_settings, action) {
  switch(action.type) {
    case 'SET_LAYERS_EXTREMES':
      var max = 0, min = Infinity;
      const layers = action.network.layers;
      for (var i in layers) {
        const dimensions = layers[i].properties.dimensions;
        if (Array.isArray(dimensions)) {
          for (let j = 0; j < 2; j++) {
            max = dimensions[j] > max ? dimensions[j] : max;
            min = dimensions[j] < min ? dimensions[j] : min;  
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
