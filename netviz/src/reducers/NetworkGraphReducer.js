import initialState from './initialState';
import * as types from '../actions/types';

export default function networkGraphReducer(state = initialState.network_graph, action) {
  switch (action.type) {
    case types.INITIALIZE_NETWORK_GRAPH:    
      return build_graph_from_network(action.network);
    default:
      return state;
  }
}

// Build the network graph upon the Network representation
function build_graph_from_network(network) {
  var layers_connections = []; // Initialize helper variable
  var graph = []; // Initialize Network Graph
  var skips = []; // Initialize the Skips
  for(var layer in network.layers) { // Add all the layers information to the helper var
    layers_connections.push({id: network.layers[layer].id, inputs: network.layers[layer].properties.input, outputs: network.layers[layer].properties.output});
  }
  while(layers_connections.length > 0) { // Remove items from the helper with no ingoing connections
    for(var l in layers_connections) {
      if(layers_connections[l].inputs.length === 0) { // Current layer has no ingoing Connections
        if(layers_connections[l].outputs.length <= 1) { // Atmost one outgoing Connection
          graph.push(layers_connections[l].id); // Add the current layer
          remove_incoming_connections(layers_connections, layers_connections[l].id); // Remove incoming connection of connected Layer 
        } else { // More than one outgoing connection
          split_or_skip(network, layers_connections[l].id) // Check if this is a split or skip connection
        }
        layers_connections.splice(0, 1); // Remove the layer from the helper var
      }
    }  
  }
  return {
    graph: graph, 
    skips: skips
  };
}

function split_or_skip(network, id) {

}

// Remove incoming connections with layer id 
function remove_incoming_connections(layers_connections, id) {
  for (var layer in layers_connections) { // Iterate over all Layers
    for (var input in layers_connections[layer].inputs) { // Iterate over all Inputs
      if(layers_connections[layer].inputs[input] === id) { // Current id is the input
        layers_connections[layer].inputs.splice(input); // Remove the Input
      }
    }
  }
}