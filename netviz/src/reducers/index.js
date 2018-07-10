// Import all Reducers
import { combineReducers } from 'redux';
import network from './NetworkReducer';
import code from './CodeReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer';
import layer_types_settings from './LayerTypesSettingsReducer';
import layers_settings from './LayersSettingsReducer';

// Combine all Reducers
export default combineReducers({
    network,
    code,
    group_transform,
    display,
    layer_types_settings,
    layers_settings
})
