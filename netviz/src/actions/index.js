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
export function setLayersExtremes(network) {
  return {type: types.SET_LAYERS_EXTREMES, network}
}

// Initializes the Network Graph for drawing positions.
export function initializeNetworkGraph(network) {
  return {type: types.INITIALIZE_NETWORK_GRAPH, network}
}

// Called to load the Network
export function loadNetwork() {
  return function(dispatch) {
    return NetworkApi.getNetwork().then(network => {
      dispatch(loadNetworkSuccess(network.data));
      dispatch(setLayersExtremes(network.data));
      dispatch(initializeNetworkGraph(network.data));
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
      return NetworkApi.getNetwork().then(network => {
        dispatch(loadNetworkSuccess(network.data));
        dispatch(setLayersExtremes(network.data));
      }).catch(error => {
        throw(error);
      })
    }).catch(error => {
      throw(error);
    });
  }
}
