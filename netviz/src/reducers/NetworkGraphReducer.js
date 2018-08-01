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
      column: parseInt(j, 10),
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
  var missin_nodes = find_missing_nodes(graph, network);
  var depths = Array.apply(null, Array(graph.length)).map(Number.prototype.valueOf,1);
  while (missin_nodes.length > 0) { // Add all missing Nodes
    add_connected_node(missin_nodes, graph, depths);
  }
}

// Find all nodes of the Network that have not been added to the Graph yet.
function find_missing_nodes(graph, network) {
  var missing = [];
  for (var i in network.layers) { // For all Layers
    var in_graph = false;
    for (var j in graph) { // And all Graph Elements
      if (network.layers[i] === graph[j].node) { // Check if Layer in Graph
        in_graph = true;
      }
    }
    if (!in_graph) missing.push(network.layers[i]); // If Layer is missing, add it to the missing List
  }
  return missing;
}

// Add a missing node that is connected to the Graph at some Point.
function add_connected_node(missin_nodes, graph, depths) {
  for (var i in missin_nodes) { // For all missing Nodes
    for (var j in graph) { // And all nodes of the Graph
      for (var k_in in missin_nodes[i].properties.input) { // Iterate over all the inputs of the missing node
        if (graph[j].node.id === missin_nodes[i].properties.input[k_in]) { // If the current input is Part of the Graph
          var column_in = graph[j].column;
          graph.push({ // Add a new node a column after the input in a new row 
            column: column_in + 1,
            row: depths[column_in + 1],
            node: missin_nodes[i]
          });
          depths[column_in + 1] = depths[column_in + 1] + 1; // Make sure that the row count for this column gets incremented
          missin_nodes.splice(i, 1); // Remove the node from missing nodes
          return; // Return from the Function
        }
      }
      for (var k_out in missin_nodes[i].properties.output) { // Iterate over all the outputs of the missing node
        if (graph[j].node.id === missin_nodes[i].properties.output[k_out]) { // If the current output is Part of the Graph
          var column_out = graph[j].column;
          graph.push({ // Add a new node a column before the output in a new row 
            column: column_out - 1,
            row: depths[column_out - 1],
            node: missin_nodes[i]
          });
          depths[column_out - 1] = depths[column_out - 1] + 1; // Make sure that the row count for this column gets incremented
          missin_nodes.splice(i, 1); // Remove the node from missing nodes
          return; // Return from the Function
        }
      }
    }
  }
}