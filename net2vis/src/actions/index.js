import NetworkApi from "../api/NetworkApi";
import CodeApi from "../api/CodeApi";
import LayerTypesApi from "../api/LayerTypesApi";
import PreferencesApi from "../api/PreferencesApi";
import LegendPreferencesApi from "../api/LegendPreferencesApi";
import GroupsApi from "../api/GroupsApi";
import ModelApi from "../api/ModelApi";
import * as types from "./types";
import * as sort from "../groups/Sort";
import * as splitting from "../layers/Splitting";
import * as colors from "../colors";

// Set the ID of the current Network
export function setID(id) {
  return { type: types.SET_ID, id };
}

// Displace the main SVG group
export function moveGroup(group_displacement) {
  return { type: types.MOVE_GROUP, group_displacement };
}

// Zoom the main SVG group
export function zoomGroup(group_zoom) {
  return { type: types.ZOOM_GROUP, group_zoom };
}

// Zoom the main SVG group
export function zoomLegend(legend_zoom) {
  return { type: types.ZOOM_LEGEND, legend_zoom };
}

// Displace the legend SVG
export function moveLegend(group_displacement) {
  return { type: types.MOVE_LEGEND, group_displacement };
}

// Toggle the Code View
export function toggleCode() {
  return { type: types.TOGGLE_CODE };
}

// Toggle the Preferences View
export function togglePreferences() {
  return { type: types.TOGGLE_PREFERENCES };
}

// Toggle the Legend View
export function toggleLegend() {
  return { type: types.TOGGLE_LEGEND };
}

// Toggle the Download Alert View
export function toggleAlert() {
  return { type: types.TOGGLE_ALERT };
}

// Toggle the Help View
export function toggleHelp() {
  return { type: types.TOGGLE_HELP };
}

// Toggle the Upload Alert View
export function toggleUpload() {
  return { type: types.TOGGLE_UPLOAD };
}

// Loading LayerTypes was Successful
function loadLayerTypesSuccess(layerTypes, network, generationMode) {
  return {
    type: types.LOAD_LAYER_TYPES_SUCCESS,
    layerTypes,
    network,
    generationMode,
  };
}

// Updating LayerTypes was Succesful
function updateLayerTypesSuccess(layerTypes, network, generationMode) {
  return {
    type: types.LOAD_LAYER_TYPES_SUCCESS,
    layerTypes,
    network,
    generationMode,
  };
}

// Called to update the LayerTypes
export function updateLayerTypes(layerTypes, network, id, generationMode) {
  return function (dispatch) {
    return LayerTypesApi.updateLayerTypes(layerTypes, id)
      .then((layerTypes) => {
        dispatch(
          updateLayerTypesSuccess(
            JSON.parse(layerTypes),
            network,
            generationMode
          )
        );
      })
      .catch((error) => {
        throw error;
      });
  };
}

// Called when the hide state of one of the LayerType changes, sind network compression needs to rerun.
export function updateLayerTypesHideState(
  layerTypes,
  network,
  groups,
  id,
  generationMode
) {
  return function (dispatch) {
    return LayerTypesApi.updateLayerTypes(layerTypes, id)
      .then((layerTypes) => {
        dispatch(
          updateLayerTypesSuccess(
            JSON.parse(layerTypes),
            network,
            generationMode
          )
        );
        dispatch(
          initializeCompressedNetwork(network, groups, JSON.parse(layerTypes))
        );
      })
      .catch((error) => {
        throw error;
      });
  };
}

// Called to delete LayerTypes
export function deleteLayerTypes(layerTypes, network, id, generationMode) {
  return function (dispatch) {
    dispatch(setPreferenceMode("legend"));
    return LayerTypesApi.updateLayerTypes(layerTypes, id)
      .then((layerTypes) => {
        dispatch(
          updateLayerTypesSuccess(
            JSON.parse(layerTypes),
            network,
            generationMode
          )
        );
      })
      .catch((error) => {
        throw error;
      });
  };
}

// Set the Extreme dimensions of the Layers in the Network
function setLayersExtremes(network, preferences, initializeNetworkGraph) {
  return {
    type: types.SET_LAYERS_EXTREMES,
    network,
    preferences,
    initializeNetworkGraph,
  };
}

// Loading Preferences was Successful
function loadPreferencesSuccess(preferences) {
  return { type: types.LOAD_PREFERENCES_SUCCESS, preferences };
}

// Updating Preferences was Succesful
function updatePreferencesSuccess(preferences) {
  return { type: types.UPDATE_PREFERENCES_SUCCESS, preferences };
}

// Called to update the Preferences
export function updatePreferences(preferences, id) {
  return function (dispatch) {
    return PreferencesApi.updatePreferences(preferences, id)
      .then((preferences) => {
        dispatch(updatePreferencesSuccess(JSON.parse(preferences)));
      })
      .catch((error) => {
        console.warn("Preferences invalid: " + error);
      });
  };
}

// Add an error to the Code.
function addError(data) {
  return { type: types.ADD_ERROR, data };
}

// Removes all error from the Code.
function removeError() {
  return { type: types.REMOVE_ERROR };
}

// Initializes the compressed version of the network.
function initializeCompressedNetwork(network, groups, layerTypes) {
  return {
    type: types.INITIALIZE_COMPRESSED_NETWORK,
    network,
    groups,
    layerTypes,
  };
}

// Loading Network was Successful
function loadNetworkSuccess(network) {
  return { type: types.LOAD_NETWORK_SUCCESS, network };
}

// Helper Function to be called once a Network has been Loaded.
function networkLoaded(network, groups, layerTypes, dispatch) {
  dispatch(removeError());
  dispatch(updateAlertSnack({ open: false, message: "" }));
  dispatch(loadNetworkSuccess(network));
  dispatch(setLayersExtremes(network));
  dispatch(initializeCompressedNetwork(network, groups, layerTypes));
}

// Split replacement has been changed.
export function splitChanged(groups, generationMode, preferences, id) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  return function (dispatch) {
    return PreferencesApi.updatePreferences(preferences, id)
      .then((preferences) => {
        var prefs = JSON.parse(preferences);
        dispatch(updatePreferencesSuccess(prefs));
        return NetworkApi.getNetwork(id)
          .then((network) => {
            loader.style.display = "none";
            if (network.success === true) {
              var net = network.data;
              if (prefs.add_splitting.value) {
                net = splitting.addSplitLayers(net);
              }
              return LayerTypesApi.getLayerTypes(id).then((layerTypes) => {
                networkLoaded(net, groups, JSON.parse(layerTypes), dispatch);
                dispatch(
                  loadLayerTypesSuccess(
                    JSON.parse(layerTypes),
                    net,
                    generationMode
                  )
                );
              });
            } else {
              dispatch(
                updateAlertSnack({
                  open: true,
                  message: "Code not executeable.",
                })
              );
              dispatch(addError(network.data));
            }
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        console.warn("Preferences invalid: " + error);
      });
  };
}

// Loading Code was Successful
function loadCodeSuccess(code) {
  return { type: types.LOAD_CODE_SUCCESS, code };
}

// Called to load the Code
export function loadCode(id) {
  return function (dispatch) {
    return CodeApi.getCode(id)
      .then((code) => {
        dispatch(loadCodeSuccess(code));
      })
      .catch((error) => {
        throw error;
      });
  };
}

// Called to delte the model file
export function deleteModel(id) {
  return function (dispatch) {
    return ModelApi.deleteModel(id)
      .then((code) => {
        dispatch(loadCodeSuccess(code));
      })
      .catch((error) => {
        throw error;
      });
  };
}

// Updating Code was Succesful
function updateCodeSuccess(code) {
  return { type: types.UPDATE_CODE_SUCESS, code };
}

// Called to update the Code
export function updateCode(code) {
  return { type: types.UPDATE_CODE_SUCESS, code };
}

export function updateCodeBackend(
  code,
  id,
  groups,
  generationMode,
  preferences
) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  return function (dispatch) {
    return CodeApi.updateCode(code, id)
      .then((code) => {
        dispatch(updateCodeSuccess(code));
        return NetworkApi.getNetwork(id)
          .then((network) => {
            loader.style.display = "none";
            if (network.success === true) {
              var net = network.data;
              if (preferences.add_splitting.value) {
                net = splitting.addSplitLayers(net);
              }
              return LayerTypesApi.getLayerTypes(id).then((layerTypes) => {
                networkLoaded(net, groups, JSON.parse(layerTypes), dispatch);
                dispatch(
                  loadLayerTypesSuccess(
                    JSON.parse(layerTypes),
                    net,
                    generationMode
                  )
                );
              });
            } else {
              dispatch(
                updateAlertSnack({
                  open: true,
                  message: "Code not executeable.",
                })
              );
              dispatch(addError(network.data));
            }
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        console.warn("Current Network not executable.", error);
      });
  };
}

export function updateModelBackend(
  file,
  id,
  groups,
  generationMode,
  preferences
) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  return function (dispatch) {
    dispatch(toggleUpload());
    return ModelApi.updateModel(file, id)
      .then((code) => {
        dispatch(updateCodeSuccess(code));
        return NetworkApi.getNetwork(id)
          .then((network) => {
            loader.style.display = "none";
            if (network.success === true) {
              var net = network.data;
              if (preferences.add_splitting.value) {
                net = splitting.addSplitLayers(net);
              }
              return LayerTypesApi.getLayerTypes(id).then((layerTypes) => {
                networkLoaded(net, groups, JSON.parse(layerTypes), dispatch);
                dispatch(
                  loadLayerTypesSuccess(
                    JSON.parse(layerTypes),
                    net,
                    generationMode
                  )
                );
              });
            } else {
              dispatch(
                updateAlertSnack({
                  open: true,
                  message: "Code not executeable.",
                })
              );
              dispatch(addError(network.data));
            }
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        console.warn("Current Network not executable.", error);
      });
  };
}

// Select Layer
export function selectLayer(id) {
  return { type: types.SELECT_LAYER, id };
}

// Select multiple Layers
export function selectLayers(layers) {
  return { type: types.SELECT_LAYERS, layers };
}

// Deselect Layer
export function deselectLayer(id) {
  return { type: types.DESELECT_LAYER, id };
}

// Deselect Layer
export function deselectLayers() {
  return { type: types.DESELECT_LAYERS };
}

// Set the mode of the preference pane.
export function setPreferenceMode(name) {
  return { type: types.SET_PREFERENCE_MODE, name };
}

// Set the item of the Legend that is currently selected.
export function setSelectedLegendItem(name) {
  return { type: types.SET_SELECTED_LEGEND_ITEM, name };
}

// Loading Groups was Successful
function loadGroupsSuccess(groups) {
  return { type: types.LOAD_GROUPS_SUCCESS, groups };
}

// Add a new Grouping
export function addGroup(groups, network, layerTypes, id) {
  return function (dispatch) {
    return GroupsApi.updateGroups(groups, id).then((groups) => {
      sort.sortGroups(groups, layerTypes);
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      dispatch(
        initializeCompressedNetwork(network, JSON.parse(groups), layerTypes)
      );
      return LayerTypesApi.updateLayerTypes(layerTypes, id).then(
        (layerTypes) => {
          dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes)));
        }
      );
    });
  };
}

// Updating Groups was Successful
function updateGroupsSuccess(groups) {
  return { type: types.UPDATE_GROUPS, groups };
}

// Update the Groups
export function updateGroups(groups, layerTypes, network, id) {
  return function (dispatch) {
    return GroupsApi.updateGroups(groups, id).then((groups) => {
      sort.sortGroups(groups, layerTypes);
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      dispatch(
        initializeCompressedNetwork(network, JSON.parse(groups), layerTypes)
      );
    });
  };
}

// Delete groups from the network.
export function deleteGroups(groups, layerTypes, network, id) {
  return function (dispatch) {
    dispatch(setPreferenceMode("network"));
    return GroupsApi.updateGroups(groups, id).then((groups) => {
      sort.sortGroups(groups, layerTypes);
      dispatch(updateGroupsSuccess(JSON.parse(groups)));
      return LayerTypesApi.updateLayerTypes(layerTypes, id).then(
        (layerTypes) => {
          dispatch(
            initializeCompressedNetwork(
              network,
              JSON.parse(groups),
              JSON.parse(layerTypes)
            )
          );
          dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes), network));
        }
      );
    });
  };
}

// Loading LegendPreferences was Successful
function loadLegendPreferencesSuccess(legend_preferences) {
  return { type: types.LOAD_LEGEND_PREFERENCES_SUCCESS, legend_preferences };
}

// Updating Preferences was Succesful
function updateLegendPreferencesSuccess(legend_preferences) {
  return { type: types.UPDATE_LEGEND_PREFERENCES_SUCCESS, legend_preferences };
}

// Called to update the Preferences
export function updateLegendPreferences(preferences, id) {
  return function (dispatch) {
    return LegendPreferencesApi.updateLegendPreferences(preferences, id)
      .then((preferences) => {
        dispatch(updateLegendPreferencesSuccess(JSON.parse(preferences)));
      })
      .catch((error) => {
        console.warn("Preferences invalid: " + error);
      });
  };
}

// Set the color mode for the selection
export function setColorSelectionMode(mode) {
  return { type: types.SET_SELECTION_COLOR_MODE, mode };
}

// Set the color mode for the Generation
export function setColorGenerationMode(mode, layerTypes, network, id) {
  var layTypes = {};
  for (var i in layerTypes) {
    var layType = {
      color: colors.generateNewColor(layTypes, mode),
      alias: layerTypes[i].alias,
      texture: layerTypes[i].texture,
      hidden: layerTypes[i].hidden,
    };
    layTypes[i] = layType;
  }
  return function (dispatch) {
    return LayerTypesApi.updateLayerTypes(layTypes, id).then((layerTypes) => {
      dispatch(updateLayerTypesSuccess(JSON.parse(layerTypes), network, mode));
      dispatch(setColorGenerationModeSuccess(mode));
    });
  };
}

function setColorGenerationModeSuccess(mode) {
  return { type: types.SET_GENERATION_COLOR_MODE, mode };
}

// Set the Network Bbox
export function setNetworkBbox(bbox) {
  return { type: types.SET_NETWORK_BBOX, bbox };
}

// Set the Legend Bbox
export function setLegendBbox(bbox) {
  return { type: types.SET_LEGEND_BBOX, bbox };
}

export function updateAlertSnack(alertSnack) {
  return { type: types.UPDATE_ALERT_SNACK_SUCCESS, alertSnack };
}

// Check that all components are reloaded from the Server in the correct order.
export function reloadAllState(id, generationMode) {
  const loader = document.getElementById("loader");
  loader.style.display = "flex";
  return function (dispatch) {
    return stateRefresh(id, generationMode, dispatch);
  };
}

async function stateRefresh(id, generationMode, dispatch) {
  return CodeApi.getCode(id)
    .then((code) => {
      dispatch(loadCodeSuccess(code));
      return GroupsApi.getGroups(id)
        .then((groups) => {
          dispatch(loadGroupsSuccess(JSON.parse(groups)));
          return NetworkApi.getNetwork(id)
            .then((network) => {
              loader.style.display = "none";
              if (network.success === true) {
                var net = network.data;
                return PreferencesApi.getPreferences(id).then((preferences) => {
                  var prefs = JSON.parse(preferences);
                  if (prefs.add_splitting.value) {
                    net = splitting.addSplitLayers(net);
                  }
                  dispatch(loadPreferencesSuccess(JSON.parse(preferences)));
                  return LayerTypesApi.getLayerTypes(id).then((layerTypes) => {
                    networkLoaded(
                      net,
                      JSON.parse(groups),
                      JSON.parse(layerTypes),
                      dispatch
                    );
                    dispatch(
                      loadLayerTypesSuccess(
                        JSON.parse(layerTypes),
                        net,
                        generationMode
                      )
                    );
                    return LegendPreferencesApi.getLegendPreferences(id).then(
                      (legend_preferences) => {
                        dispatch(
                          loadLegendPreferencesSuccess(
                            JSON.parse(legend_preferences)
                          )
                        );
                      }
                    );
                  });
                });
              } else {
                dispatch(
                  updateAlertSnack({
                    open: true,
                    message: "Code not executeable.",
                  })
                );
                dispatch(addError(network.data));
              }
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          console.log(error);
          console.warn("Error in Grouping");
        });
    })
    .catch((error) => {
      console.warn("Current Network not executable.");
    });
}