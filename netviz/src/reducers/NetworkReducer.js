import initialState from './initialState';

export default function networkReducer(state = initialState.network, action) {
  switch (action.type) {
    case 'LOAD_NETWORK_SUCCESS':
      console.log(action.network);
      return action.network;
    default:
      return state;
  }
}
