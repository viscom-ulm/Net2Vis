import initialState from "./initialState";
import * as types from "../actions/types";
import * as colors from "../colors";

export default function layerTypesSettignsReducer(
  state = initialState.layer_types_settings,
  action
) {
  switch (action.type) {
    case types.LOAD_LAYER_TYPES_SUCCESS:
      if (action.network === undefined) {
        return action.layerTypes;
      }
      var lTypes = action.layerTypes; // Get the layer types
      for (const layer of action.network.layers) {
        // For all layers
        if (lTypes[layer.name] === undefined) {
          // If the layer is not yet in layertypes
          lTypes[layer.name] = {
            // Add the layer type
            color: colors.generateNewColor(lTypes, action.generationMode), // Set the color
            alias: layer.name, // Set the name
            texture: colors.generateNewTexture(lTypes), // Set the fallback texture
            hidden: false,
            dense: layer.properties.dimensions.out.length === 1,
          };
        }
      }
      return lTypes;
    default:
      return state;
  }
}
