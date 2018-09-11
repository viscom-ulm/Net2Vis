import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import * as dagre from 'dagre';

import * as actions from '../../actions';
import Layer from './LayerComponent'

// Network Component providing all the Network Visualization
class Network extends React.Component {
  // When this Component mounts, load the Network from the Backend
  componentWillMount() {
    if(this.props.network_graph.length === 0) {
      this.props.actions.loadNetwork();
    }
  }

  // Render the individual Network Layers
  render() {
    const item = this.props.network_graph;
    var g = new dagre.graphlib.Graph();
    g.setGraph({rankdir: 'LR', ranksep: 0});
    g.setDefaultEdgeLabel(function() { return {}; });
    for (var i in item) {
      var layer = item[i];
      g.setNode(layer.node.id, {width: 80, height: 100, layer: layer})
    }
    for (var i in item) {
      var layer = item[i];
      for (var j in layer.node.properties.output) {
        g.setEdge(layer.node.id, layer.node.properties.output[j]);
      }
    }
    dagre.layout(g);
    const nodes = Object.values(g._nodes);
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale}) rotate(0 0 0)`;
    return(
      <g transform={transform}>
        {nodes.map(layer => 
          <Layer layer={layer.layer} settings={layer_types_settings[layer.layer.node.name]} key={layer.layer.node.id} x={layer.x} y={layer.y}/>
        )}
      </g>
    );
}
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Layer Types 
Network.propTypes = {
  network_graph: PropTypes.array.isRequired,
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
