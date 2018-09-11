import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';
import Layer from './LayerComponent'

// Network Component providing all the Network Visualization
class Network extends React.Component {
  // When this Component mounts, load the Network from the Backend
  componentWillMount() {
    if (!('_nodes' in this.props.network_graph)) {
      this.props.actions.loadNetwork();
    }
  }

  // Render the individual Network Layers
  render() {
    const graph = this.props.network_graph;
    var nodes = [];
    if ('_nodes' in this.props.network_graph) {
      nodes = Object.values(graph._nodes);
    }
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale}) rotate(0 0 0)`;
    return(
      <g transform={transform}>
        {nodes.map(layer => 
          <Layer layer={layer.layer} settings={layer_types_settings[layer.layer.name]} key={layer.layer.id} x={layer.x} y={layer.y}/>
        )}
      </g>
    );
  }
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Layer Types 
Network.propTypes = {
  network_graph: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    network_graph: state.network_graph,
    group_transform: state.group_transform,
    layer_types_settings: state.layer_types_settings
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
