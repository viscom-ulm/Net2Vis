import initialState from './initialState';
import * as types from '../actions/types';

// Reducer for building the NetworkGraph state.
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
  var graph = [];  
  add_longest_path(graph, network);
  add_missing_splits(graph, network);
  return graph;
}

// Add the longest Path to the Graph
function add_longest_path(graph, network) {
  var inputs = find_input_layers(network); // Get the inpout Layers
  var longest_path = find_longest_path(network, inputs); // Get the longest Path
  for (var j in longest_path.nodes) { // Add each Node
    graph.push({
      column: j,
      row: 0,
      node: longest_path.nodes[j]
    });
  }
}

// Find the input Layer of the Network
function find_input_layers(network) {
  var layers = [];
  for (var i in network.layers) { // Go over all layers
    if (network.layers[i].properties.input.length === 0) { // Check if the Layer is an input Layer
      layers.push(network.layers[i]);
    }
  }
  return layers;
}

// Find the longest path in the Network
function find_longest_path(network, inputs) {
  var longest = {
    nodes: [],
    length: 0
  };
  for (var i in inputs) { // For all input Nodes, traverse the Graph
    var path = check_path_recursive(network, inputs[i]);
    if (path.length > longest.length) { // Return only the longest Graph
      longest = path;
    }
  }
  return longest;
}

// Recursively traverse the graph, going in all direction from one node.
function check_path_recursive(network, start) {
  if (start.properties.output.length === 0) { // Path ends here, just return this Node.
    return { 
      nodes: [start], 
      length: 1
    }
  } else if(start.properties.output.length === 1) { // Path goes on in one direction, add the following to the current node.
    var prev = check_path_recursive(network, network.layers[start.properties.output[0]]);
    return {
      nodes: [start].concat(prev.nodes),
      length: 1 + prev.length
    }
  } else { // Path splits here, return the longest of the splits.
    var longest = {
      nodes:[],
      length: 0
    }
    for (var i in start.properties.output) { // Go in all split directions.
      var path = check_path_recursive(network, network.layers[start.properties.output[i]]);
      if (path.length > longest.length) { // Only return the longest of the Splits
        longest = path;
      }
    }
    return {
      nodes: [start].concat(longest.nodes),
      length: 1 + longest.length
    }
  }
}

// Add the missing nodes where the graph has split.
function add_missing_splits(graph, network) {
  var node_missing = true;
  while(node_missing) {
    node_missing = false;
    for (var i in graph) {
      if(graph[i].node.properties.output.length > 1) {
        check_in_graph(graph[i].node.properties.output);
      }
      if(graph[i].node.properties.input.length > 1) {
        check_in_graph(graph[i].node.properties.input);
      }
    }
  }
}