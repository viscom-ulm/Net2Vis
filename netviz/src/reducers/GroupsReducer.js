import initialState from './initialState';
import * as types from '../actions/types';
import * as addition from '../groups/Addition';

export default function groupsReducer(state = initialState.groups, action) {
  switch (action.type) {
    case types.LOAD_GROUPS_SUCCESS:
      return action.groups;
    case types.ADD_GROUP:
      state = addition.groupAdded(state, action.group);
      return state.concat(action.group);
    case types.UPDATE_GROUPS:
      return action.groups;
    default:
      return state;
  }
}
