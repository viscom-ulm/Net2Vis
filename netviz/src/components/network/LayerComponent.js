import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import TooltipComponent from './TooltipComponent';
import * as actions from '../../actions';

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {  
  // When the Component mounts and no Setting is there, initialize it
  componentWillMount() {
    if(!this.props.settings) { // If the Setting for this LayerType was not defined, initialize it
      var setting = {}; 
      setting.color = 'gray';
      this.props.actions.addSettingForLayerType(setting, this.props.layer.layer.name);
    }
  }

  // Calculate the height values of the layer (begin and end) based on the spatial resolution
  calculateLayerHeight = (extreme_dimensions, dimensions) => {
    var height = [extreme_dimensions.max_size, extreme_dimensions.max_size]; // Initialize the heights to max-values for 1D-Layers
    if(Array.isArray(dimensions.out)) { // Calculate the dimensions of the Layer only if multidimensional Tensor
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of all Layers
      const lay_diff = extreme_layer.max_size - extreme_layer.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = [(dimensions.in[0] - extreme_layer.min_size) / lay_diff, (dimensions.out[0] - extreme_layer.min_size) / lay_diff]; // Calculate the linear interpolation factor for boths sides of the Glyph 
      height = [perc[0] * dim_diff + extreme_dimensions.min_size, perc[1] * dim_diff + extreme_dimensions.min_size]; // Calculate the height for both sides of the Glyph through interpolation
    }
    return height;
  }
  
  // Calculate the SVG Path for a Glyph
  calculateGlyphPath = (extreme_dimensions, layer_height, layer_width) =>  {
    const y_diff = [(extreme_dimensions.max_size - layer_height[0]) / 2, (extreme_dimensions.max_size - layer_height[1]) / 2]; // Calculate the vertical difference to center the Glyph
    const y_pos = [y_diff[0], y_diff[1], y_diff[1] + layer_height[1], y_diff[0] + layer_height[0]]; // Vertical Position of top-left, top-right, bottom-right and bottom-left Points
    console.log(this.props.layer);
    const pathData = [ // Path data for the Glyph
      'M', 0, y_pos[0], // Move to initial Location
      'L', layer_width, y_pos[1], // Draw Line to top-right
      'V', y_pos[2], // Draw Line to bottom-right
      'L', 0, y_pos[3], // Draw Line to bottom-left
      'Z', // Draw Line to Starting Point
    ].join(' ')
    return pathData;
  }

  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    const set = this.props.settings ? this.props.settings : {color: 'white'}; // Need initial Value if not already set, will be set back immediately and thus not visible
    const layer_width = this.props.preferences.layer_display_width.value; // Get the Width of the Layers
    const dimensions = this.props.layer.layer.properties.dimensions; // Get the Dimensions of the current Layer
    const extreme_dimensions = {max_size: this.props.preferences.layer_display_max_height.value, min_size: this.props.preferences.layer_display_min_height.value}; // Get the Extremes of the Display Size for the Glyphs
    const layer_height = this.calculateLayerHeight(extreme_dimensions, dimensions); // Calculate the height of the Layer
    const pathData = this.calculateGlyphPath(extreme_dimensions, layer_height, layer_width); // Calculate the Path of the Layer
    const tooltipRef = React.createRef(); // Reference for the Tooltip
    const properties_object = this.props.layer.layer.properties.properties; // Get the layer Properties
    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g transform={`translate(${this.props.layer.x}, ${this.props.layer.y})`}>
        <path d={pathData} style={{fill:set.color, stroke: 'black'}} ref={tooltipRef}/>
        <TooltipComponent properties_object={properties_object} dimensions={dimensions} tooltipRef={tooltipRef} name={this.props.layer.layer.name}/>
      </g>
    );
  }
};

// PropTypes of this Class, containing the Global Layer Settings
Layer.propTypes = {
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
