import { Network } from '../types/NetworkTypes';
import { NetworkAction } from '../actions';
import { GET_NETWORK_ACTION } from '../constants';

export const initialNetworkState: Network = new Network();

function networkReducer(state: Network = initialNetworkState,
                        action: NetworkAction): Network {
  switch (action.type) {
  case GET_NETWORK_ACTION:
    return state.with(action.payload);
  default:
    return state;
  }
}

export default networkReducer;
