import NetworkApi from '../api/NetworkApi';
import CodeApi from '../api/CodeApi';
import LayerTypesApi from '../api/LayerTypesApi';
import PreferencesApi from '../api/PreferencesApi';
import LegendPreferencesApi from '../api/LegendPreferencesApi';
import GroupsApi from '../api/GroupsApi';
import * as types from './types';

// Set the ID of the current Network
export function setID(id) {
  return {type:types.SET_ID, id};
}

// Displace the main SVG group
export function moveGroup(group_displacement) {
  return {type: types.MOVE_GROUP, group_displacement};
}

// Zoom the main SVG group
export function zoomGroup(group_zoom) {
  return {type: types.ZOOM_GROUP, group_zoom};
}

// Zoom the main SVG group
export function zoomLegend(legend_zoom) {
  return {type: types.ZOOM_LEGEND, legend_zoom};
}

// Displace the legend SVG
export function moveLegend(group_displacement) {
  return {type: types.MOVE_LEGEND, group_displacement};
}

// Toggle the Code View
export function toggleCode() {
  return {type: types.TOGGLE_CODE};
}

// Toggle the Preferences View
export function togglePreferences() {
  return {type: types.TOGGLE_PREFERENCES};
}

// Toggle the Legend View
export function toggleLegend() {
  return {type: types.TOGGLE_LEGEND};
}

// Add setting for a Layer Type
export function addSettingForLayerType(setting, name) {
  return {type: types.ADD_LAYER_TYPE_SETTING, setting, name};
}

// Loading LayerTypes was Successful
export function loadLayerTypesSuccess(layerTypes, network, generationMode) {
  return {type: types.LOAD_LAYER_TYPES_SUCCESS, layerTypes, network, generationMode};
}

// Called to load the LayerTypes
export function loadLayerTypes(id, generationMode) {
  return function(dispatch) {
    return LayerTypesApi.getLayerTypes(id).then(layerTypes => {
      dispatch(loadLayerTypesSuccess(JSON.parse(layerTypes), generationMode));
    }).catch(error => {
      throw(error);
    });
  };
}

// Updating LayerTypes was Succesful
export function updateLayerTypesSuccess(layerTypes, network) {
  return {type: types.LOAD_LAYER_TYPES_SUCCESS, layerTypes, network}
}

// Called to update the LayerTypes
export function updateLayerTypes(layerTypes, network, id) {
  return function(dispatch) {
    return LayerTypesApi.updateLayerTypes(layerTypes, id).then(layerTypes => {
      dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes), network));
    }).catch(error => {
      throw(error);
    });
  }
}

// Called to delete LayerTypes
export function deleteLayerTypes(layerTypes, network, id) {
  return function(dispatch) {
    dispatch(setPreferenceMode('legend'));
    return LayerTypesApi.updateLayerTypes(layerTypes, id).then(layerTypes => {
      dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes), network));
    }).catch(error => {
      throw(error);
    });
  }
}

// Set the Extreme dimensions of the Layers in the Network
export function setLayersExtremes(network, preferences, initializeNetworkGraph) {
  return {type: types.SET_LAYERS_EXTREMES, network, preferences, initializeNetworkGraph}
}

// Loading Preferences was Successful
export function loadPreferencesSuccess(preferences) {
  return {type: types.LOAD_PREFERENCES_SUCCESS, preferences};
}

// Called to load the Preferences
export function loadPreferences(id) {
  return function(dispatch) {
    return PreferencesApi.getPreferences(id).then(preferences => {
      dispatch(loadPreferencesSuccess(JSON.parse(preferences)));
    }).catch(error => {
      throw(error);
    });
  };
}

// Updating Preferences was Succesful
export function updatePreferencesSuccess(preferences) {
  return {type: types.UPDATE_PREFERENCES_SUCCESS, preferences}
}

// Called to update the Preferences
export function updatePreferences(preferences, id) {
  return function(dispatch) {
    return PreferencesApi.updatePreferences(preferences, id).then(preferences => {
      dispatch(updatePreferencesSuccess(JSON.parse(preferences)));
    }).catch(error => {
      console.warn('Preferences invalid: ' + error);
    });
  }
}

// Add an error to the Code.
export function addError(data) {
  return {type: types.ADD_ERROR, data}
}

// Removes all error from the Code.
export function removeError() {
  return {type: types.REMOVE_ERROR}
}

// Initializes the compressed version of the network.
export function initializeCompressedNetwork(network, groups) {
  return{type: types.INITIALIZE_COMPRESSED_NETWORK, network, groups}
}

// Loading Network was Successful
export function loadNetworkSuccess(network) {
  return {type: types.LOAD_NETWORK_SUCCESS, network};
}

// Helper Function to be called once a Network has been Loaded.
export function networkLoaded(network, groups, dispatch) {
  if(network.success === true) {
    dispatch(removeError());
    dispatch(loadNetworkSuccess(network.data));
    dispatch(setLayersExtremes(network.data));
    dispatch(initializeCompressedNetwork(network.data, groups));
  } else {
    dispatch(addError(network.data));
  }
}

// Called to load the Network
export function loadNetwork(id, groups) {
  return function(dispatch) {
    return NetworkApi.getNetwork(id).then(network => {
      networkLoaded(network, groups, dispatch);      
    }).catch(error => {
      throw(error);
    })  
  };  
}  

// Loading Code was Successful
export function loadCodeSuccess(code) {
  return {type: types.LOAD_CODE_SUCCESS, code};
}

// Called to load the Code
export function loadCode(id) {
  return function(dispatch) {
    return CodeApi.getCode(id).then(code => {
      dispatch(loadCodeSuccess(code));
    }).catch(error => {
      throw(error);
    })
  };
}

// Updating Code was Succesful
export function updateCodeSuccess(code) {
  return {type: types.UPDATE_CODE_SUCESS, code}
}

// Called to update the Code
export function updateCode(code, id, groups, generationMode) {
  return function(dispatch) {
    return CodeApi.updateCode(code, id).then(code => {
      dispatch(updateCodeSuccess(code));
      return NetworkApi.getNetwork(id).then(network => { 
        networkLoaded(network, groups, dispatch);      
        return LayerTypesApi.getLayerTypes(id).then(layerTypes => {
          dispatch(loadLayerTypesSuccess(JSON.parse(layerTypes), network.data, generationMode));
        });
      }).catch(error => {
        throw(error);
      })
    }).catch(error => {
      console.warn('Current Network not executable.')
    });
  }
}

// Select Layer
export function selectLayer(id) {
  return {type: types.SELECT_LAYER, id}
}

// Select multiple Layers
export function selectLayers(layers) {
  return {type: types.SELECT_LAYERS, layers}
}

// Deselect Layer
export function deselectLayer(id) {
  return {type: types.DESELECT_LAYER, id}
}

// Deselect Layer
export function deselectLayers() {
  return {type: types.DESELECT_LAYERS}
}

// Set the mode of the preference pane.
export function setPreferenceMode(name) {
  return {type: types.SET_PREFERENCE_MODE, name}
}

// Set the item of the Legend that is currently selected.
export function setSelectedLegendItem(name) {
  return {type: types.SET_SELECTED_LEGEND_ITEM, name}
}

// Check that all components are reloaded from the Server in the correct order.
export function reloadAllState(id, generationMode) {
  return function(dispatch) {
    return CodeApi.getCode(id).then(code => {
      dispatch(loadCodeSuccess(code));
      return GroupsApi.getGroups(id).then(groups => {
        dispatch(loadGroupsSuccess(JSON.parse(groups)));
        return NetworkApi.getNetwork(id).then(network => { 
          networkLoaded(network, JSON.parse(groups), dispatch);      
          return PreferencesApi.getPreferences(id).then(preferences => {
            dispatch(loadPreferencesSuccess(JSON.parse(preferences)));
            return LayerTypesApi.getLayerTypes(id).then(layerTypes => {
              dispatch(loadLayerTypesSuccess(JSON.parse(layerTypes), network.data, generationMode));
              return LegendPreferencesApi.getLegendPreferences(id).then(legend_preferences => {
                dispatch(loadLegendPreferencesSuccess(JSON.parse(legend_preferences)));
              });
            });
          });
        }).catch(error => {
          throw(error);
        });
      }).catch(error => {
        console.log(error);
        console.warn('Error in Grouping');
      });
    }).catch(error => {
      console.warn('Current Network not executable.')
    });
  }
}

// Loading Groups was Successful
export function loadGroupsSuccess(groups) {
  return {type: types.LOAD_GROUPS_SUCCESS, groups};
}

// Add a new Grouping
export function addGroup(groups, network, layerTypes, id) {
  return function(dispatch) {
    return GroupsApi.updateGroups(groups, id).then(groups => {
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      dispatch(initializeCompressedNetwork(network, JSON.parse(groups)));
      return LayerTypesApi.updateLayerTypes(layerTypes, id).then(layerTypes => {
        dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes)));
      });
    });
  }
}

// Updating Groups was Successful
export function updateGroupsSuccess(groups) {
  return {type: types.UPDATE_GROUPS, groups}
}

// Update the Groups
export function updateGroups(groups, network, id) {
  return function(dispatch) {
    return GroupsApi.updateGroups(groups, id).then(groups => {
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      dispatch(initializeCompressedNetwork(network, JSON.parse(groups)));
    });
  }
}

// Delete groups from the network.
export function deleteGroups(groups, layerTypes, network, id) {
  return function(dispatch) {
    dispatch(setPreferenceMode('legend'));
    return GroupsApi.updateGroups(groups, id).then(groups => {
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      dispatch(initializeCompressedNetwork(network, JSON.parse(groups)));
      return LayerTypesApi.updateLayerTypes(layerTypes, id).then(layerTypes => {
        dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes), network));
      });
    });
  }
}

// Loading LegendPreferences was Successful
export function loadLegendPreferencesSuccess(legend_preferences) {
  return {type: types.LOAD_LEGEND_PREFERENCES_SUCCESS, legend_preferences};
}

// Called to load the Preferences
export function loadLegendPreferences(id) {
  return function(dispatch) {
    return LegendPreferencesApi.getLegendPreferences(id).then(legend_preferences => {
      dispatch(loadLegendPreferencesSuccess(JSON.parse(legend_preferences)));
    }).catch(error => {
      throw(error);
    });
  };
}

// Updating Preferences was Succesful
export function updateLegendPreferencesSuccess(legend_preferences) {
  return {type: types.UPDATE_LEGEND_PREFERENCES_SUCCESS, legend_preferences}
}

// Called to update the Preferences
export function updateLegendPreferences(preferences, id) {
  return function(dispatch) {
    return LegendPreferencesApi.updateLegendPreferences(preferences, id).then(preferences => {
      dispatch(updateLegendPreferencesSuccess(JSON.parse(preferences)));
    }).catch(error => {
      console.warn('Preferences invalid: ' + error);
    });
  }
}

// Set the color mode for the selection
export function setColorSelectionMode(mode) {
  return {type: types.SET_SELECTION_COLOR_MODE, mode};
}

// Set the color mode for the Generation
export function setColorGenerationMode(mode) {
  return {type: types.SET_GENERATION_COLOR_MODE, mode};
}
