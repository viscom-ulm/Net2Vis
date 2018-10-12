import NetworkApi from '../api/NetworkApi';
import CodeApi from '../api/CodeApi';
import LayerTypesApi from '../api/LayerTypesApi';
import PreferencesApi from '../api/PreferencesApi'
import * as types from './types'

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
export function loadLayerTypesSuccess(layerTypes) {
  return {type: types.LOAD_LAYER_TYPES_SUCCESS, layerTypes};
}

// Called to load the LayerTypes
export function loadLayerTypes(id) {
  return function(dispatch) {
    return LayerTypesApi.getLayerTypes(id).then(layerTypes => {
      dispatch(loadLayerTypesSuccess(JSON.parse(layerTypes)));
    }).catch(error => {
      throw(error);
    });
  };
}

// Updating LayerTypes was Succesful
export function updateLayerTypesSuccess(layerTypes) {
  return {type: types.UPDATE_LAYER_TYPES_SUCCESS, layerTypes}
}

// Called to update the LayerTypes
export function updateLayerTypes(layerTypes, id) {
  return function(dispatch) {
    return LayerTypesApi.updateLayerTypes(layerTypes, id).then(layerTypes => {
      dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes)));
    }).catch(error => {
      console.warn('LayerTypes invalid.');
    });
  }
}

// Loading Network was Successful
export function loadNetworkSuccess(network) {
  return {type: types.LOAD_NETWORK_SUCCESS, network};
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
      console.warn('Preferences invalid.');
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

// Helper Function to be called once a Network has been Loaded.
export function networkLoaded(network, dispatch) {
  if(network.success === true) {
    dispatch(removeError());
    dispatch(loadNetworkSuccess(network.data));
    dispatch(setLayersExtremes(network.data));
  } else {
    dispatch(addError(network.data));
  }
}

// Called to load the Network
export function loadNetwork(id) {
  return function(dispatch) {
    return NetworkApi.getNetwork(id).then(network => {
      networkLoaded(network, dispatch);      
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
export function updateCode(code, id) {
  return function(dispatch) {
    return CodeApi.updateCode(code, id).then(code => {
      dispatch(updateCodeSuccess(code));
      return NetworkApi.getNetwork(id).then(network => { // TODO: Check if could be reused from above
        networkLoaded(network, dispatch);      
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