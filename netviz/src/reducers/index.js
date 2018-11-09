// Import all Reducers
import { combineReducers } from 'redux';
import id from './IDReducer';
import network from './NetworkReducer';
import code from './CodeReducer';
import group_transform from './TransformReducer';
import legend_transform from './LegendTransformReducer';
import display from './DisplayReducer';
import layer_types_settings from './LayerTypesSettingsReducer';
import preferences from './PreferencesReducer';
import error from './ErrorReducer';
import layer_extreme_dimensions from './LayerExtremeDimensionsReducer';
import selection from './SelectionReducer';
import preferences_mode from './PreferencesModeReducer';
import selected_legend_item from './SelectedLegendItemReducer';
import graph_extreme_dimensions from './GraphExtemeDimensionsReducer';
import groups from './GroupsReducer';
import compressed_network from './CompressionReducer';

// Combine all Reducers
export default combineReducers({
    id,
    network,
    code,
    group_transform,
    legend_transform,
    display,
    layer_types_settings,
    preferences,
    error,
    layer_extreme_dimensions,
    selection,
    preferences_mode,
    selected_legend_item,
    graph_extreme_dimensions,
    groups,
    compressed_network
})
