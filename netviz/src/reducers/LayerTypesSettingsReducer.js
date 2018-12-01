import initialState from './initialState';
import * as types from '../actions/types';
import * as colors from '../colors';

export default function layerTypesSettignsReducer(state = initialState.layer_types_settings, action) {
  switch(action.type) {
    case(types.ADD_LAYER_TYPE_SETTING):
      return Object.assign({}, state, {
        [action.name]: {
          color: action.setting.color,
          alias: action.setting.alias
        }
      });
    case types.UPDATE_LAYER_TYPES_SUCCESS:
      if (action.network === undefined) {
        return action.layerTypes;
      }
      var lTypes = action.layerTypes; // Get the layer types
      for (var i in action.network.layers) { // For all layers
        if (lTypes[action.network.layers[i].name] === undefined) { // If the layer is not yet in layertypes
          lTypes[action.network.layers[i].name] = { // Add the layer type
            color: colors.generateNewColor(lTypes), // Set the color
            alias:  action.network.layers[i].name // Set the name
          }
        }
      }
      return lTypes;
    case types.LOAD_LAYER_TYPES_SUCCESS:
      var lTypes = action.layerTypes; // Get the layer types
      for (var i in action.network.layers) { // For all layers
        if (lTypes[action.network.layers[i].name] === undefined) { // If the layer is not yet in layertypes
          lTypes[action.network.layers[i].name] = { // Add the layer type
            color: colors.generateNewColor(lTypes), // Set the color
            alias:  action.network.layers[i].name // Set the name
          }
        }
      }
      return lTypes;
    default:
      return state;
  }
}
