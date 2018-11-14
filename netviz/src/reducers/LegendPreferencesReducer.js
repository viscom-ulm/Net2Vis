import initialState from './initialState';
import * as types from '../actions/types';

export default function legendPreferencesReducer(state = initialState.legend_preferences, action) {
  switch(action.type) {
    case types.UPDATE_PREFERENCES_SUCCESS:
      return state;
    case types.LOAD_PREFERENCES_SUCCESS:
      return state;
    default:
      return state;
  }
}