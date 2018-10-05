import initialState from './initialState';
import * as types from '../actions/types';

export default function selectionReducer(state = initialState.selection, action) {
  switch(action.type) {
    case types.SELECT_LAYER:
      return state.concat(action.id);
    case types.DESELECT_LAYER:
      return state.filter(item => item !== action.id);
    default:
      return state;
  }
}
