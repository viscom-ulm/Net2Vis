import initialState from './initialState';

export default function codeReducer(state = initialState.code, action) {
  switch (action.type) {
    case 'LOAD_CODE_SUCCESS':
      return action.code;
    case 'UPDATE_CODE_SUCCESS':
      return action.code;
    default:
      return state;
  }
}
