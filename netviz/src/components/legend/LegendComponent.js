import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import LegendItem from './LegendItem';
import * as actions from '../../actions';
import * as legend from '../../legend';

class Legend extends React.Component {
  // MouseDown Listener for SVG, recording the Position and registering MouseMove Listener
  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    this.props.actions.setPreferenceMode('legend');
  };
  
  // MouseUp Listener for SVG, ending the drag option by removing the MouseMove Listener
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
  };
  
  // MouseMove Listener, moving the SVG around
  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.props.actions.moveLegend([xDiff,yDiff]);
  };

  // Scroll Listener, handling SVG zoom Actions
  handleScroll = (e) => {
    this.props.actions.zoomLegend(e.deltaY);
  }

  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    this.props.actions.setPreferenceMode('color');
    this.props.actions.setSelectedLegendItem(e);
  };
  
  render() {
    const group_t = this.props.legend_transform;
    const legend_transform = `translate(${group_t.x}, ${group_t.y}) scale(${group_t.scale})`;
    const legend_representation = legend.getLegend(this.props.layer_types_settings, this.props.groups, this.props.legend_preferences);
    return(
      <svg width="100%" height="100%" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onWheel={this.handleScroll}>
        <g id='legend_group' transform={legend_transform}>
          {legend_representation.map(representation => 
            <LegendItem representation={representation} key={representation.layer.representer.name} action={this.handleLayerClicked}/>
          )}
        </g>
      </svg>
    );
  }
}

Legend.propTypes = {
  legend_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  legend_preferences: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    legend_transform: state.legend_transform,
    layer_types_settings: state.layer_types_settings,
    groups: state.groups,
    legend_preferences: state.legend_preferences
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
