import * as types from './index';
import NetworkApi from '../api/NetworkApi';

export function loadNetworkSuccess(network) {
  return {type: types.LOAD_NETWORK_SUCCESS, network};
}

export function loadNetwork() {
  return function(dispatch) {
    return NetworkApi.getNetwork().then(network => {
      dispatch(loadNetworkSuccess(network.data));
    }).catch(error => {
      throw(error);
    })
  };
}