import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import LegendItem from './LegendItem';
import * as actions from '../../actions';

class Legend extends React.Component {
  // MouseDown Listener for SVG, recording the Position and registering MouseMove Listener
  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    //this.props.actions.setPreferenceMode('network');
    if(!e.shiftKey) {
      //this.props.actions.deselectLayers();
    } 
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

  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    this.props.actions.setPreferenceMode('color');
    this.props.actions.setSelectedLegendItem(e);
  };
  
  render() {
    if(this.props.legend_toggle) {
      const layer_types_settings = this.props.layer_types_settings;
      const group_t = this.props.legend_transform;
      const legend_transform = `translate(${group_t.x}, ${group_t.y})`;
      var settings = [];
      for (var key in layer_types_settings) {
        settings.push({name: key, color: layer_types_settings[key].color});
      }
      return(
        <div id='Legend'>
          <svg width="100%" height="100%" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
            <g id='legend_group' transform={legend_transform}>
              {settings.map(setting => 
                <LegendItem layer_name={setting.name} layer_color={setting.color} key={setting.name} action={this.handleLayerClicked}/>
              )}
            </g>
          </svg>
        </div>
      );
    } else {
      return null;
    }
  }
}

Legend.propTypes = {
  legend_toggle: PropTypes.bool.isRequired,
  legend_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    legend_toggle: state.display.legend_toggle,
    legend_transform: state.legend_transform,
    layer_types_settings: state.layer_types_settings
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);

/*
          <div className='flexhorizontal flexlegend'>
          {settings.map(setting => 
            <LegendItem layer_name={setting.name} layer_color={setting.color} key={setting.name} action={this.handleLayerClicked}/>
          )}
          </div>
          */