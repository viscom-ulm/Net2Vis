import initialState from './initialState';
import * as types from '../actions/types';

export default function errorReducer(state = initialState.groups, action) {
  switch (action.type) {
    case types.ADD_GROUP:
      return state.concat(action.group);
    default:
      return state;
  }
}
