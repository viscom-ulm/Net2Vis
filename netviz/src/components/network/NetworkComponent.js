import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';
import Layer from './LayerComponent';
import * as graphs from '../../graphs';

// Network Component providing all the Network Visualization
class Network extends React.Component {
  // When this Component mounts, load the Network from the Backend
  componentWillMount() {
    if (!('layers' in this.props.compressed_network)) {
      this.props.actions.reloadAllState(this.props.id);
    }
  }

  // Render the individual Network Layers
  render() {
    const graph = graphs.buildGraphFromNetwork(this.props.compressed_network, this.props.layer_extreme_dimensions, this.props.preferences);
    var nodes = [];
    graph.nodes().forEach(function(e) {
      nodes.push(graph.node(e));
    });
    var edges = [];
    graph.edges().forEach(function(e) {
      edges.push({v: e.v, w: e.w, points: graph.edge(e)});
    });
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    var networkElement = document.getElementById('networkComponent'); // Get the main SVG Element
    var mainGroup = document.getElementById('main_group'); // Get the main group of the SVG Element
    var centerTransformation = {x: 0, y: 0} // Transformation to center the Graph initially
    if(networkElement !== null && mainGroup !== null) { // If the elements exist already
      centerTransformation.x = (networkElement.getBoundingClientRect().width / 2.0) - (mainGroup.getBoundingClientRect().width / 2.0); // Transformation to center the graph in x direction
      centerTransformation.y = (networkElement.getBoundingClientRect().height / 2.0) - (mainGroup.getBoundingClientRect().height); // Transformation to center the graph in y direction
    }
    const transform = `translate(${(group_t.x + centerTransformation.x)}, ${(group_t.y + centerTransformation.y)}) scale(${group_t.scale})`; // Manipulate the position of the graph
    return(
      <g id='main_group' transform={transform}>
        {nodes.map(layer => 
          <Layer layer={layer} settings={layer_types_settings[layer.layer.name]} key={layer.layer.id} nodes={nodes} edges={edges}/>
        )}
      </g>
    );
  }
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Layer Types 
Network.propTypes = {
  id: PropTypes.string.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    group_transform: state.group_transform,
    layer_types_settings: state.layer_types_settings,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    compressed_network: state.compressed_network
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
