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
  //var layers_connections = intialize_connections(network); // Initialize helper variable
  var graph = []; // Initialize Network Graph
  var skips = []; // Initialize the Skips
  var input_layer = find_input_layer(network, graph);
  graph = connect_trivial_layers(network, input_layer);
  
  // while(layers_connections.length > 0) { // Remove items from the helper with no ingoing connections
  //   var input = find_input_layer(layers_connections);
  //   if(layers_connections[input].outputs.length <= 1) { // Atmost one outgoing Connection
  //     graph.push(layers_connections[input].id); // Add the current layer
  //     remove_incoming_connections(layers_connections, layers_connections[input].id); // Remove incoming connection of connected Layer 
  //   } else { // More than one outgoing connection
  //     graph.push(layers_connections[input].id); // Add the current layer
  //     resolve_split(network, layers_connections[input], skips, layers_connections) // Check if this is a split or skip connection
  //   }
  //   layers_connections.splice(input, 1); // Remove the layer from the helper var
  // }

  return {
    graph: graph, 
    skips: skips
  };
}

// Find the input Layer of the Network
function find_input_layer(network, graph) {
  for (var i in network.layers) {
    if (network.layers[i].properties.input.length === 0) {
      return network.layers[i].id;
    }
  }
}

function connect_trivial_layers(network, index) {
  var inp = network.layers[index].properties.input;
  var outp = network.layers[index].properties.output;
  if (inp.length <= 1 && outp.length === 1) {
    return [index].concat(connect_trivial_layers(network, outp[0]));
  } else if (inp.length === 1 && outp.length === 0) {
    return [index];
  } else {
    return [];
  }
}

// // Initialize a variable holding all the connections of the network
// function intialize_connections(network) {
//   var layers_connections = [];
//   for(var layer in network.layers) { // Add all the layers information to the helper var
//     layers_connections.push({id: network.layers[layer].id, inputs: network.layers[layer].properties.input, outputs: network.layers[layer].properties.output});
//   }
//   return layers_connections;
// }

// // Find the current input layer
// function find_input_layer(layers_connections) {
//   for(var l in layers_connections) { // Check connections of all layers
//     if(layers_connections[l].inputs.length === 0) { // Current layer has no ingoing Connections
//       return l; // Current layer is the input
//     }
//   }
// }

// // Tries to understand the Split; currently only working if all merged together again
// function resolve_split(network, current_connection, skips, layers_connections) {
//   var outgoings = current_connection.outputs;
//   var outs = [];
//   for (var output in outgoings) { // Go over all outgoung connections
//     outs.push(find_following(network, skips, layers_connections, outgoings[output])); // Find all layers that follow this split way
//   }
//   merge_to_input(outs);
// }

// // Remove all the layers not needed anymore from connection list
// function remove_layers(layers) {

// }

// // Find following layers
// function find_following(network, skips, layers_connections, id) {
//   var layer = network.layers[id];
//   var ops = layer.properties.output;
//   if(ops.length === 0 || layer.properties.input.length > 1) {
//     return [];
//   } else if (ops.length === 1) {
//     return ops.concat(find_following(network, skips, layers_connections, ops[0]));
//   }
// }

// // Remove incoming connections with layer id 
// function remove_incoming_connections(layers_connections, id) {
//   for (var layer in layers_connections) { // Iterate over all Layers
//     for (var input in layers_connections[layer].inputs) { // Iterate over all Inputs
//       if(layers_connections[layer].inputs[input] === id) { // Current id is the input
//         layers_connections[layer].inputs.splice(input, 1); // Remove the Input
//       }
//     }
//   }
// }