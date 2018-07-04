import { combineReducers } from 'redux';
import network from './NetworkReducer';
import code from './CodeReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer';
import layer_settings from './LayerSettingsReducer';
import layers_settings from './LayersSettingsReducer';

export default combineReducers({
    network,
    code,
    group_transform,
    display,
    layer_settings,
    layers_settings
})
