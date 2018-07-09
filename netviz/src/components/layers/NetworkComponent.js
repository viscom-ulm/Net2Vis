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
    if(this.props.layers.length === 0) {
      this.props.actions.loadNetwork();
    }
  }

  // Render the individual Network Layers
  render() {
    const layers = this.props.layers;
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale})`;
    return(
      <g transform={transform}>
        {layers.map(layer => 
          <Layer layer={layer} settings={layer_types_settings[layer.name]} key={layer.id}/>
        )}
      </g>
    );
  }
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Laye Types 
Network.propTypes = {
  layers: PropTypes.array.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  if (state.network.layers) { // Check if the Network has already been loaded
    return {
      layers: state.network.layers,
      group_transform: state.group_transform,
      layer_types_settings: state.layer_types_settings
    };
  } else { // If not, no Layers are present
    return {
      layers: [],
      group_transform: state.group_transform,
      layer_types_settings: state.layer_types_settings
    };
  }
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
