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
    if (!('layers' in this.props.network)) {
      this.props.actions.loadNetwork(this.props.id);
      this.props.actions.loadLayerTypes(this.props.id);
      this.props.actions.loadPreferences(this.props.id);
    }
  }

  // Render the individual Network Layers
  render() {
    const graph = graphs.buildGraphFromNetwork(this.props.network, this.props.layer_extreme_dimensions, this.props.preferences);
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
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale}) rotate(0 0 0)`;
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
  network: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
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
