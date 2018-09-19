import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as dagre from 'dagre';

import * as actions from '../../actions';
import Layer from './LayerComponent';
import EdgeComponent from './EdgeComponent';

// Network Component providing all the Network Visualization
class Network extends React.Component {
  // When this Component mounts, load the Network from the Backend
  componentWillMount() {
    if (!('layers' in this.props.network)) {
      this.props.actions.loadNetwork();
    }
  }

  // Build the network graph upon the Network representation
  build_graph_from_network = (network, layer_extreme_dimensions, preferences) => {
    var graph = new dagre.graphlib.Graph(); // Initialize the dagre Graph
    graph.setGraph({rankdir: 'LR', ranksep: 0, nodesep: (layer_extreme_dimensions.max_size/2)}); // Set Graph Properties
    graph.setDefaultEdgeLabel(function() { return {}; }); // Default Egde Label needs to be set
    for (var i in network.layers) { // Add all Layers to the Graph
      const layer = network.layers[i]; // Get the current Layer
      const max_layer_dim = Math.max(layer.properties.dimensions.in[0], layer.properties.dimensions.out[0]) // Get the maximum dimension of the layer (in vs out)
      const lay_diff =  layer_extreme_dimensions.max_size - layer_extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = preferences.layer_display_max_height.value - preferences.layer_display_min_height.value; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = (max_layer_dim - layer_extreme_dimensions.min_size) / lay_diff; // Calculate the interpolation factor for boths sides of the Glyph 
      const height = perc * dim_diff + preferences.layer_display_min_height.value; // Calculate the height for both sides of the Glyph 
      graph.setNode(layer.id, {width: preferences.layer_display_width.value, height: height, layer: layer}); // Add a Node to the Graph
    }
    for (var j in network.layers) { // Add all Edges to the Graph
      var layer_current = network.layers[j]; // Get the current Layer
      for (var k in layer_current.properties.output) { // Go over all outputs of the current Layer
        graph.setEdge(layer_current.id, layer_current.properties.output[k]); // Add the Edge to the Graph
      }
    }
    dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
    return graph;
  }

  // Render the individual Network Layers
  render() {
    const graph = this.build_graph_from_network(this.props.network, this.props.layer_extreme_dimensions, this.props.preferences);
    var nodes = [];
    graph.nodes().forEach(function(e) {
      nodes.push(graph.node(e));
    });
    var edges = [];
    graph.edges().forEach(function(e) {
      var points = graph.edge(e).points;
      var distinct = [];
      for(var i in points) {
        if(!distinct.includes(points[i].x)) {
          distinct.push(points[i].x);
        }
      }
      if(distinct.length > 1) {
        edges.push(graph.edge(e));
      }
    });
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale}) rotate(0 0 0)`;
    return(
      <g id='main_group' transform={transform}>
        {nodes.map(layer => 
          <Layer layer={layer} settings={layer_types_settings[layer.layer.name]} key={layer.layer.id} nodes={nodes}/>
        )}
        {edges.map((edge, index) =>
          <EdgeComponent edge={edge} key={index}/>
        )}
      </g>
    );
  }
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Layer Types 
Network.propTypes = {
  network: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    network: state.network,
    group_transform: state.group_transform,
    layer_types_settings: state.layer_types_settings,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
