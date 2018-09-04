import initialState from './initialState';
import * as types from '../actions/types';

export default function errorReducer(state = initialState.error, action) {
  switch (action.type) {
    case types.ADD_ERROR:
      console.log(action.data);
      return action.data
    case types.REMOVE_ERROR:
      return {};
    default:
      return state;
  }
}

