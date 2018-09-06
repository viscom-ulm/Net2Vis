import initialState from './initialState';
import * as types from '../actions/types';

export default function pereferencesReducer(state = initialState.preferences, action) {
  switch(action.type) {
    case types.CHANGE_LAYERS_MIN_HEIGHT:
      return Object.assign({}, state, {
        layer_display_min_height: {value: action.min_height, type: state.layer_display_min_height.type, description: state.layer_display_min_height.description}
      });
    case types.CHANGE_LAYERS_MAX_HEIGHT:
      return Object.assign({}, state, {
        layer_display_max_height: {value: action.max_height, type: state.layer_display_max_height.type, description: state.layer_display_max_height.description}
      });
    case types.CHANGE_LAYERS_WIDTH:
      return Object.assign({}, state, {
        layer_display_width: {value: action.width, type: state.layer_display_width.type, description: state.layer_display_width.description}
      });
    case types.CHANGE_LAYERS_SPACING_HORIZONTAL:
      return Object.assign({}, state, {
        layers_spacing_horizontal: {value: action.spacing, type: state.layers_spacing_horizontal.type, description: state.layers_spacing_horizontal.description}
      });
    case types.CHANGE_LAYERS_SPACING_VERTICAL:
      return Object.assign({}, state, {
        layers_spacing_vertical: {value: action.spacing, type: state.layers_spacing_vertical.type, description: state.layers_spacing_vertical.description}
      });
    default:
      return state;
  }
}
