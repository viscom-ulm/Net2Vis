import initialState from './initialState';
import * as types from '../actions/types';
import * as dagre from 'dagre';

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
  var graph = new dagre.graphlib.Graph();
  graph.setGraph({rankdir: 'LR', ranksep: 0});
  graph.setDefaultEdgeLabel(function() { return {}; });
  for (var i in network.layers) {
    var layer = network.layers[i];
    graph.setNode(layer.id, {width: 80, height: 100, layer: layer})
  }
  for (var i in network.layers) {
    var layer = network.layers[i];
    for (var j in layer.properties.output) {
      graph.setEdge(layer.id, layer.properties.output[j]);
    }
  }
  dagre.layout(graph);
  return graph;
}
