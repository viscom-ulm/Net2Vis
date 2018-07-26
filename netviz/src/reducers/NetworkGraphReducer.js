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
  var inputs = find_input_layers(network);
  var longest_path = find_longest_path(network, inputs);
  var graph = add_longest_path(longest_path);
  return graph;
}

// Find the input Layer of the Network
function find_input_layers(network) {
  var layers = [];
  for (var i in network.layers) {
    if (network.layers[i].properties.input.length === 0) {
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
  for (var i in inputs) {
    var path = check_path_recursive(network, inputs[i]);
    if (path.length > longest.length) {
      longest = path;
    }
  }
  return longest;
}

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
      if (path.length > longest.length) {
        longest = path;
      }
    }
    return {
      nodes: [start].concat(longest.nodes),
      length: 1 + longest.length
    }
  }
}

function add_longest_path(path) {
  var graph = [];
  for (var j in path.nodes) {
    graph.push({
      column: j,
      row: 0,
      node: path.nodes[j]
    });
  }
  return graph;
}