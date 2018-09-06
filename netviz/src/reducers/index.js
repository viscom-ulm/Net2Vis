// Import all Reducers
import { combineReducers } from 'redux';
import network from './NetworkReducer';
import network_graph from './NetworkGraphReducer'
import code from './CodeReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer';
import layer_types_settings from './LayerTypesSettingsReducer';
import preferences from './PreferencesReducer';
import error from './ErrorReducer';
import layer_extreme_dimensions from './LayerExtremeDimensionsReducer'

// Combine all Reducers
export default combineReducers({
    network,
    network_graph,
    code,
    group_transform,
    display,
    layer_types_settings,
    preferences,
    error,
    layer_extreme_dimensions
})
