import initialState from './initialState';
import * as types from '../actions/types';
import * as occurences from '../groups/Occurences';
import * as concatenate from '../groups/Concatenation';

export default function compressionReducer(state = initialState.compressed_network, action) {
  switch (action.type) {
    case types.INITIALIZE_COMPRESSED_NETWORK:
      var net = action.network;
      for (var i in action.groups) {
        if (action.groups[i].active) {
          var occur = occurences.findGroupOccurences(action.groups[i], net); // Check, where this group can be found
          for (var j in occur) {
            net = concatenate.concatenateLayers(occur[j], net, action.groups[i]);
          }
        }
      }
      return net;
    case types.ADD_GROUP:
      var network = state;
      var occurence = occurences.findGroupOccurences(action.group, network); // Check, where this group can be found
      for (var k in occurence) {
        network =  concatenate.concatenateLayers(occurence[k], network, action.group);
      }
      return network;
    default:
      return state;
  }
}