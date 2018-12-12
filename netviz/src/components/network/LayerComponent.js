import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';

import TooltipComponent from './TooltipComponent';
import FeaturesLabelComponent from './FeaturesLabelComponent';
import SampleComponent from './SampleComponent';

import * as paths from '../../paths';
import * as colors from '../../colors';

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {  
  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    if (this.props.selection.includes(this.props.layer.layer.id)) { // If selected
      this.props.actions.deselectLayer(this.props.layer.layer.id); // Deselect
      this.props.actions.setSelectedLegendItem('');
      this.props.actions.setPreferenceMode('network');
    } else { // If not selected
      if (e.shiftKey && this.props.selection.length !== 0) {
        this.props.complexAction(this.props.layer, this.props.selection); // A complex selection is to be made
        this.props.actions.setSelectedLegendItem('');
        this.props.actions.setPreferenceMode('network');
      } else {
        this.props.actions.selectLayer(this.props.layer.layer.id); // Select
        this.props.actions.setSelectedLegendItem(this.props.layer.layer.name);
        this.props.actions.setPreferenceMode('color');
      }
    }
  };

  // Calculate the height values of the layer (begin and end) based on the spatial resolution
  calculateLayerHeight = (extreme_dimensions, dimensions) => {
    var height = [extreme_dimensions.max_size, extreme_dimensions.max_size]; // Initialize the height placeholder
    if(Array.isArray(dimensions.out)) { // Calculate the dimensions of the Layer for a multidimensional Tensor
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of all Layers
      const lay_diff = extreme_layer.max_size - extreme_layer.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = [(dimensions.in[0] - extreme_layer.min_size) / lay_diff, (dimensions.out[0] - extreme_layer.min_size) / lay_diff]; // Calculate the linear interpolation factor for boths sides of the Glyph 
      height = [perc[0] * dim_diff + extreme_dimensions.min_size, perc[1] * dim_diff + extreme_dimensions.min_size]; // Calculate the height for both sides of the Glyph through interpolation
    } else { // Not a convolutional Layer
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of all Dense Layers
      const lay_diff = extreme_layer.max_dense - extreme_layer.min_dense; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      var perc = (dimensions.out - extreme_layer.min_dense) / lay_diff; // Calculate the linear interpolation factor for boths sides of the Glyph 
      if (perc < 1.0) { // If this is not the flatten layer
        height = [perc * dim_diff + extreme_dimensions.min_size, perc * dim_diff + extreme_dimensions.min_size]; // Calculate the height for both sides of the Glyph through interpolation
      }
    }
    return height;
  }
  
  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    const set = this.props.settings ? this.props.settings : {color: 'white'}; // Need initial Value if not already set, will be set back immediately and thus not visible
    const name = set.alias ? set.alias : this.props.layer.layer.name;
    const dimensions = this.props.layer.layer.properties.dimensions; // Get the Dimensions of the current Layer
    const extreme_dimensions = {max_size: this.props.preferences.layer_display_max_height.value, min_size: this.props.preferences.layer_display_min_height.value}; // Get the Extremes of the Display Size for the Glyphs
    const layer_height = this.calculateLayerHeight(extreme_dimensions, dimensions); // Calculate the height of the Layer
    const pathData = paths.calculateGlyphPath(extreme_dimensions, layer_height, this.props.layer, this.props.edges); // Calculate the Path of the Layer
    const tooltipRef = React.createRef(); // Reference for the Tooltip
    const properties_object = this.props.layer.layer.properties.properties; // Get the layer Properties
    var stroke = colors.darkenColor(set.color); // Set the default stroke color to black
    if (this.props.selection.includes(this.props.layer.layer.id)) { // Check if layer is selected
      stroke = "red"; // Set stroke color to red
    }
    const features = Array.isArray(dimensions.out) ? dimensions.out[dimensions.out.length-1] : dimensions.out;
    const dimensionsLabelX = this.props.layer.x + (this.props.layer.width / 2.0) + (this.props.preferences.layers_spacing_horizontal.value) + (this.props.preferences.stroke_width.value);
    var inputSample = undefined; // Placeholder for label if this is an input of the Net
    if (this.props.layer.layer.properties.input.length === 0) { // If no inputs
      inputSample = {
        dimensions: dimensions.in, // Dimensions for this label are the input dimensions of the layer
        x: (2.0 * this.props.layer.x) - dimensionsLabelX - layer_height[0], // X position of the label to be left of layer
        edge: { // Edge position is layer y
          points: [{y: this.props.layer.y}]
        }
      }
    }
    var outputSample = undefined; // Placeholder for label if this is an output of the net
    if (this.props.layer.layer.properties.output.length === 0) { // If no outputs
      inputSample = {
        dimensions: dimensions.out, // Dimensions for this label are the output dimensions of the layer
        x: dimensionsLabelX, // X position of the label ro be right of layer
        edge: { // Edge position is layer y
          points: [{y: this.props.layer.y}]
        }
      }
    }
    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g>
        <g transform={`translate(${this.props.layer.x - (this.props.layer.width/2.0)}, ${this.props.layer.y})`}>
          <path d={pathData} style={{fill:set.color, stroke: stroke, strokeWidth: this.props.preferences.stroke_width.value, strokeLinejoin: 'round'}} ref={tooltipRef} onClick={this.handleLayerClicked}/>
          <TooltipComponent properties_object={properties_object} dimensions={dimensions} tooltipRef={tooltipRef} name={name}/>
          {
            this.props.preferences.show_features.value &&
            <FeaturesLabelComponent features={features} x={this.props.layer.width / 2.0} layer_height={layer_height} extreme_dimensions={extreme_dimensions} layer={this.props.layer} edges={this.props.edges}/>
          }
        </g>
        {
          this.props.preferences.show_samples.value && inputSample !== undefined && Array.isArray(dimensions.out) &&
          <SampleComponent extent={layer_height[0]} x={inputSample.x} edge={inputSample.edge} layer_max_height={this.props.preferences.layer_display_max_height.value} strokeWidth={this.props.preferences.stroke_width.value / 2.0}/>
        }
        {
          this.props.preferences.show_samples.value && outputSample !== undefined && Array.isArray(dimensions.out) &&
          <SampleComponent extent={layer_height[1]} x={outputSample.x} edge={outputSample.edge} layer_max_height={this.props.preferences.layer_display_max_height.value} strokeWidth={this.props.preferences.stroke_width.value / 2.0}/>
        }
      </g>
    );
  }
};

// PropTypes of this Class, containing the Global Layer Settings
Layer.propTypes = {
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  layer: PropTypes.object.isRequired,
  settings: PropTypes.object,
  edges: PropTypes.array.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    selection: state.selection
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
