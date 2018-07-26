import initialState from './initialState';
import * as types from '../actions/types';

export default function layerTypesSettignsReducer(state = initialState.layer_types_settings, action) {
  switch(action.type) {
    case(types.ADD_LAYER_TYPE_SETTING):
      return Object.assign({}, state, {
        [action.name]: {
          color: action.setting.color
        }
      });
    default:
      return state;
  }
}
