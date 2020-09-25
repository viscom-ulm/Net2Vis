// Import all Reducers
import { combineReducers } from "redux";
import id from "./IDReducer";
import network from "./NetworkReducer";
import code from "./CodeReducer";
import group_transform from "./TransformReducer";
import legend_transform from "./LegendTransformReducer";
import display from "./DisplayReducer";
import layer_types_settings from "./LayerTypesSettingsReducer";
import preferences from "./PreferencesReducer";
import error from "./ErrorReducer";
import layer_extreme_dimensions from "./LayerExtremeDimensionsReducer";
import selection from "./SelectionReducer";
import preferences_mode from "./PreferencesModeReducer";
import selected_legend_item from "./SelectedLegendItemReducer";
import groups from "./GroupsReducer";
import compressed_network from "./CompressionReducer";
import legend_preferences from "./LegendPreferencesReducer";
import color_mode from "./ColorModeReducer";
import network_bbox from "./NetworkBboxReducer";
import legend_bbox from "./LegendBboxReducer";
import alert_snack from "./AlertSnackReducer";

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
  groups,
  compressed_network,
  legend_preferences,
  color_mode,
  network_bbox,
  legend_bbox,
  alert_snack,
});
