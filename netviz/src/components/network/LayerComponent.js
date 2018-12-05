import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import TooltipComponent from './TooltipComponent';
import * as actions from '../../actions';
import EdgeComponent from './EdgeComponent';
import * as paths from '../../paths';

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {  
  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    if (this.props.selection.includes(this.props.layer.layer.id)) { // If selected
      this.props.actions.deselectLayer(this.props.layer.layer.id); // Deselect
    } else { // If not selected
      if (e.shiftKey) {
        if (this.props.selection.length === 0) { // If no Layer was selected
          this.props.actions.selectLayer(this.props.layer.layer.id); // Select the Layer
        } else { // A Layer has already been selected
          this.props.complexAction(this.props.layer, this.props.selection); // A complex selection is to be made
        }
      } else {
        this.props.actions.selectLayer(this.props.layer.layer.id); // Select
      }
    }
  };

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
    const current_edges = paths.getOutgoingEdges(this.props.layer, this.props.edges); // Get relevant Edges going out from the current Layer
    var stroke = "black"; // Set the default stroke color to black
    if (this.props.selection.includes(this.props.layer.layer.id)) { // Check if layer is selected
      stroke = "red"; // Set stroke color to red
    }
    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g>
        {current_edges.map((edge, index) =>
          <EdgeComponent edge={edge.points} layer_max_height={this.props.preferences.layer_display_max_height.value} horizontal_spacing={this.props.preferences.layers_spacing_horizontal} color={'black'} key={index}/>
        )}
        <g transform={`translate(${this.props.layer.x - (this.props.layer.width/2.0)}, ${this.props.layer.y})`}>
          <path d={pathData} style={{fill:set.color, stroke: stroke, strokeLinejoin: 'round'}} ref={tooltipRef} onClick={this.handleLayerClicked}/>
          <TooltipComponent properties_object={properties_object} dimensions={dimensions} tooltipRef={tooltipRef} name={name}/>
        </g>
      </g>
    );
  }
};

// PropTypes of this Class, containing the Global Layer Settings
Layer.propTypes = {
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired
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
