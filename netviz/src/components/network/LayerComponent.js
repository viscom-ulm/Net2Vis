import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {  
  // When the Component mounts and no Setting is there, initialize it
  componentWillMount() {
    if(!this.props.settings) { // If the Setting for this LayerType was not defined, initialize it
      var setting = {}; 
      setting.color = 'blue';
      this.props.actions.addSettingForLayerType(setting, this.props.layer.name);
    }
  }
  
  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    var set = this.props.settings ? this.props.settings : {color: 'white'}; // Need initial Value if nor already set
    var dimensions = this.props.layer.properties.dimensions; // Get the Dimensions of the current Layer
    var extreme_dimensions = this.props.layers_settings.layer_display_size; // Get the Extremes of the Display Size for the Glyphs
    var height = [extreme_dimensions.max_size, extreme_dimensions.max_size]; // Initialize the heights of the Glyph
    if(Array.isArray(dimensions.out)) { // Calculate the dimensions of the Layer only if multidimensional Tensor
      var extreme_layer = this.props.layers_settings.layer_extreme_dimensions; // Get the Extremes of the Dimensions of the current Layer
      var lay_diff = extreme_layer.max_size - extreme_layer.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      var dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      var perc = [(dimensions.in[0] - extreme_layer.min_size) / lay_diff, (dimensions.out[0] - extreme_layer.min_size) / lay_diff]; // Calculate the interpolation factor for boths sides of the Glyph 
      height = [perc[0] * dim_diff + extreme_dimensions.min_size, perc[1] * dim_diff + extreme_dimensions.min_size]; // Calculate the height for both sides of the Glyph
    }
    var y_diff = [(extreme_dimensions.max_size - height[0]) / 2, (extreme_dimensions.max_size - height[1]) / 2]; // Calculate the vertical difference to center the Glyph
    var y_pos = [y_diff[0], y_diff[1], y_diff[1]+height[1], y_diff[0]+height[0]]; // Vertical Position of top-left, top-right, bottom-right and bottom-left Points  
    var pathData = [ // Path data for the Glyph
      'M', 0, y_pos[0], // Move to initial Location
      'L', 100, y_pos[1], // Draw Line to top-right
      'L', 100, y_pos[2], // Draw Line to bottom-right
      'L', 0, y_pos[3], // Draw Line to bottom-left
      'L', 0, y_pos[0], // Draw Line to top-left
    ].join(' ')
    // Return a Shape with the calculated parameters
    return (
      <g transform={`translate(${100 + (100 * this.props.layer.id)}, 100)`}>
        <path d={pathData} style={{fill:set.color, stroke: 'black'}} />
      </g>
    );
  }
};

// PropTypes of this Class, containing the Global Layer Settings
Layer.propTypes = {
  layers_settings: PropTypes.object.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    layers_settings: state.layers_settings
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
