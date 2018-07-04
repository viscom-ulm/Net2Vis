import initialState from './initialState';

export default function layerSettignsReducer(state = initialState.layer_settings, action) {
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
