import initialState from './initialState';

export default function layerTypesSettignsReducer(state = initialState.layer_types_settings, action) {
  switch(action.type) {
    case('ADD_LAYER_SETTING'):
      return Object.assign({}, state, {
        [action.name]: {
          color: action.setting.color
        }
      });
    default:
      return state;
  }
}
