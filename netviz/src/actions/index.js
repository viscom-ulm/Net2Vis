import NetworkApi from '../api/NetworkApi';
import CodeApi from '../api/CodeApi';

// Constants for Action calls
export const LOAD_NETWORK_SUCCESS = 'LOAD_NETWORK_SUCCESS';
export const SET_LAYERS_EXTREMES = 'SET_LAYERS_EXTREMES';
export const LOAD_CODE_SUCCESS = 'LOAD_CODE_SUCCESS';
export const UPDATE_CODE_SUCESS = 'UPDATE_CODE_SUCCESS'
export const MOVE_GROUP = 'MOVE_GROUP';
export const ZOOM_GROUP = 'ZOOM_GROUP';
export const TOGGLE_CODE = 'TOGGLE_CODE';
export const TOGGLE_PREFERENCES = 'TOGGLE_PREFERENCES';
export const TOGGLE_LEGEND = 'TOGGLE_LEGEND';
export const ADD_LAYER_TYPE_SETTING = 'ADD_LAYER_TYPE_SETTING';

// Displace the main SVG group
export function moveGroup(group_displacement) {
  return {type: MOVE_GROUP, group_displacement};
}

// Zoom the main SVG group
export function zoomGroup(group_zoom) {
  return {type: ZOOM_GROUP, group_zoom};
}

// Toggle the Code View
export function toggleCode() {
  return {type: TOGGLE_CODE};
}

// Toggle the Preferences View
export function togglePreferences() {
  return {type: TOGGLE_PREFERENCES};
}

// Toggle the Legend View
export function toggleLegend() {
  return {type: TOGGLE_LEGEND};
}

// Add setting for a Layer Type
export function addSettingForLayerType(setting, name) {
  return {type: ADD_LAYER_TYPE_SETTING, setting, name};
}

// Set the Extreme dimensions of the Layers in the Network
export function setLayersExtremes(network) {
  return {type: SET_LAYERS_EXTREMES, network}
}

// Loading Network was Successful
export function loadNetworkSuccess(network) {
  return {type: LOAD_NETWORK_SUCCESS, network};
}

// Called to load the Network
export function loadNetwork() {
  return function(dispatch) {
    return NetworkApi.getNetwork().then(network => {
      dispatch(loadNetworkSuccess(network.data));
      dispatch(setLayersExtremes(network.data));
    }).catch(error => {
      throw(error);
    })
  };
}

// Loading Code was Successful
export function loadCodeSuccess(code) {
  return {type: LOAD_CODE_SUCCESS, code};
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
  return {type: UPDATE_CODE_SUCESS, code}
}

// Called to update the Code
export function updateCode(code) {
  return function(dispatch) {
    return CodeApi.updateCode(code).then(code => {
      dispatch(updateCodeSuccess(code));
    }).catch(error => {
      throw(error);
    });
  }
}
