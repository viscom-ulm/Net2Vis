import NetworkApi from '../api/NetworkApi';
import CodeApi from '../api/CodeApi';
import * as types from './types'

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

// Loading Network was Successful
export function loadNetworkSuccess(network) {
  return {type: types.LOAD_NETWORK_SUCCESS, network};
}

// Set the Extreme dimensions of the Layers in the Network
export function setLayersExtremes(network, preferences, initializeNetworkGraph) {
  return {type: types.SET_LAYERS_EXTREMES, network, preferences, initializeNetworkGraph}
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
export function loadNetwork() {
  return function(dispatch) {
    return NetworkApi.getNetwork().then(network => {
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
export function loadCode() {
  return function(dispatch) {
    return CodeApi.getCode().then(code => {
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
export function updateCode(code) {
  return function(dispatch) {
    return CodeApi.updateCode(code).then(code => {
      dispatch(updateCodeSuccess(code));
      return NetworkApi.getNetwork().then(network => { // TODO: Check if could be reused from above
        networkLoaded(network, dispatch);      
      }).catch(error => {
        throw(error);
      })
    }).catch(error => {
      console.warn('Current Network not executable.')
    });
  }
}

// Updating Layers Min Height
export function changeLayersMinHeight(min_height) {
  return {type: types.CHANGE_LAYERS_MIN_HEIGHT, min_height}
}

// Updating Layers Max Height
export function changeLayersMaxHeight(max_height) {
  return {type: types.CHANGE_LAYERS_MAX_HEIGHT, max_height}
}

// Updating Layers Width
export function changeLayersWidth(width) {
  return {type: types.CHANGE_LAYERS_WIDTH, width}
}

// Updating Layers Spacing
export function changeLayersSpacingHorizontal(spacing) {
  return {type: types.CHANGE_LAYERS_SPACING_HORIZONTAL, spacing}
}

// Updating Layers Spacing
export function changeLayersSpacingVertical(spacing) {
  return {type: types.CHANGE_LAYERS_SPACING_VERTICAL, spacing}
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

// Set the item of the Legend that is currently selected.
export function setPreferenceMode(name) {
  return {type: types.SET_PREFERENCE_MODE, name}
}