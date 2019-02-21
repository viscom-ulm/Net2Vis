import initialState from './initialState';
import * as types from '../actions/types';
import * as colors from '../colors';

export default function layerTypesSettignsReducer(state = initialState.layer_types_settings, action) {
  switch(action.type) {
    case types.LOAD_LAYER_TYPES_SUCCESS:
      if (action.network === undefined) {
        return action.layerTypes;
      }
      var lTypes = action.layerTypes; // Get the layer types
      for (var i in action.network.layers) { // For all layers
        if (lTypes[action.network.layers[i].name] === undefined) { // If the layer is not yet in layertypes
          lTypes[action.network.layers[i].name] = { // Add the layer type
            color: colors.generateNewColor(lTypes, action.generationMode), // Set the color
            alias:  action.network.layers[i].name, // Set the name
            texture: colors.generateNewTexture(lTypes) // Set the fallback texture
          }
        }
      }
      return lTypes;
    default:
      return state;
  }
}
