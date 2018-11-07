import initialState from './initialState';
import * as types from '../actions/types';
import * as graphs from '../graphs';

export default function compressionReducer(state = initialState.compressed_network, action) {
  switch (action.type) {
    case types.INITIALIZE_COMPRESSED_NETWORK:
      return action.network;
    case types.ADD_GROUP:
      var network = state;
      var occurences = graphs.findGroupOccurences(action.group, network); // Check, where this group can be found
      for (var i in occurences) {
        network =  graphs.concatenateLayers(occurences[i], network, action.group);
      }
      return network;
    default:
      return state;
  }
}