import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import { Tooltip } from "react-svg-tooltip";

import * as actions from '../../actions';

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {  
  // When the Component mounts and no Setting is there, initialize it
  componentWillMount() {
    if(!this.props.settings) { // If the Setting for this LayerType was not defined, initialize it
      var setting = {}; 
      setting.color = 'gray';
      this.props.actions.addSettingForLayerType(setting, this.props.layer.name);
    }
  }

  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    const set = this.props.settings ? this.props.settings : {color: 'white'}; // Need initial Value if not already set, will be set back immediately and thus not visible
    const dimensions = this.props.layer.properties.dimensions; // Get the Dimensions of the current Layer
    const layer_width = this.props.preferences.layer_display_width.value; // Get the Width of the Layers
    // Calculate the height of the Layer
    const extreme_dimensions = {max_size: this.props.preferences.layer_display_max_height.value, min_size: this.props.preferences.layer_display_min_height.value}; // Get the Extremes of the Display Size for the Glyphs
    var height = [extreme_dimensions.max_size, extreme_dimensions.max_size]; // Initialize the heights of the Glyph
    if(Array.isArray(dimensions.out)) { // Calculate the dimensions of the Layer only if multidimensional Tensor
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of the current Layer
      const lay_diff = extreme_layer.max_size - extreme_layer.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = [(dimensions.in[0] - extreme_layer.min_size) / lay_diff, (dimensions.out[0] - extreme_layer.min_size) / lay_diff]; // Calculate the interpolation factor for boths sides of the Glyph 
      height = [perc[0] * dim_diff + extreme_dimensions.min_size, perc[1] * dim_diff + extreme_dimensions.min_size]; // Calculate the height for both sides of the Glyph
    }
    // Calculate the Positions of the Layer
    const y_diff = [(extreme_dimensions.max_size - height[0]) / 2, (extreme_dimensions.max_size - height[1]) / 2]; // Calculate the vertical difference to center the Glyph
    const y_pos = [y_diff[0], y_diff[1], y_diff[1]+height[1], y_diff[0]+height[0]]; // Vertical Position of top-left, top-right, bottom-right and bottom-left Points  
    const pathData = [ // Path data for the Glyph
      'M', 0, y_pos[0], // Move to initial Location
      'L', layer_width, y_pos[1], // Draw Line to top-right
      'V', y_pos[2], // Draw Line to bottom-right
      'L', 0, y_pos[3], // Draw Line to bottom-left
      'Z', // Draw Line to Starting Point
    ].join(' ')
    // Get Information for the Tooltip
    const tooltipRef = React.createRef(); // Reference for the Tooltip
    const properties_object = this.props.layer.properties.properties; // Get the layer Properties
    const keys = Object.keys(properties_object); // Get the Keys from the Object
    var properties = []; // Get all Properties
    for (var i in keys) {
      if(properties_object[keys[i]]) {
        properties.push({key: keys[i], prop: properties_object[keys[i]].toString()});
      }
    }
    // Add Dimensions to Properties
    properties.push({key: 'Dimensions in', prop: dimensions.in.toString()})
    properties.push({key: 'Dimensions out', prop: dimensions.out.toString()})
    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g transform={`translate(${this.props.x}, ${this.props.y})`}>
        <path d={pathData} style={{fill:set.color, stroke: 'black'}} ref={tooltipRef}/>
        <Tooltip for={tooltipRef}>
          <rect
            x={10}
            y={10}
            width={200}
            height={14 + (properties.length * 15)}
            rx={0.5}
            ry={0.5}
            fill="black"
            fillOpacity="0.6"
          />
          <text x={13} y={20} fontSize={10} fill="white">Type: {this.props.layer.name}</text>
          {properties.map((pro, index) =>
            <text x={13} y={35 + (index * 15)} fontSize={10} key={index} fill="white">{pro.key}: {pro.prop}</text>  
          )}
        </Tooltip>
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
