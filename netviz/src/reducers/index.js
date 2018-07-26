// Import all Reducers
import { combineReducers } from 'redux';
import network from './NetworkReducer';
import network_graph from './NetworkGraphReducer'
import code from './CodeReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer';
import layer_types_settings from './LayerTypesSettingsReducer';
import layers_settings from './LayersSettingsReducer';

// Combine all Reducers
export default combineReducers({
    network,
    network_graph,
    code,
    group_transform,
    display,
    layer_types_settings,
    layers_settings
})
