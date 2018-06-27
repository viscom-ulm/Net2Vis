import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Layer from './LayerComponent'

class LayerList extends React.Component {

  render() {
    const layers = this.props.layers;
    const group_t = this.props.group_transform;
    const transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale})`;
    return(
      <g transform={transform}>
        {layers.map(layer => 
          <Layer layer={layer} key={layer.id}/>
        )}
      </g>
    );
  }
}

LayerList.propTypes = {
  layers: PropTypes.array.isRequired,
  group_transform: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  if (state.network.layers) {
    return {
      layers: state.network.layers,
      group_transform: state.group_transform
    };
  } else {
    return {
      layers: [],
      group_transform: {x:0, y:0, scale: 1}
    };
  }
}

export default connect(mapStateToProps)(LayerList);
