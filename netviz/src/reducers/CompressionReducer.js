import initialState from './initialState';
import * as types from '../actions/types';
import * as graphs from '../graphs';

export default function compressionReducer(state = initialState.compressed_network, action) {
  switch (action.type) {
    case types.INITIALIZE_COMPRESSED_NETWORK:
      var net = action.network;
      for (var i in action.groups) {
        var occur = graphs.findGroupOccurences(action.groups[i], net); // Check, where this group can be found
        for (var j in occur) {
          net = graphs.concatenateLayers(occur[j], net, action.groups[i]);
        }
      }
      return net;
    case types.ADD_GROUP:
      var network = state;
      var occurences = graphs.findGroupOccurences(action.group, network); // Check, where this group can be found
      for (var k in occurences) {
        network =  graphs.concatenateLayers(occurences[k], network, action.group);
      }
      return network;
    default:
      return state;
  }
}