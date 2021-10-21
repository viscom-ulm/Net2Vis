import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../../actions";

import TooltipComponent from "./TooltipComponent";
import FeaturesLabelComponent from "./FeaturesLabelComponent";
import NameLabelComponent from "./NameLabelComponent";
import SampleComponent from "./SampleComponent";

import * as paths from "../../paths";
import * as colors from "../../colors";

// Layer Component providing individual Layer Visualizations
class Layer extends React.Component {
  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    if (this.props.selection.includes(this.props.layer.layer.id)) {
      // If selected
      this.props.actions.deselectLayer(this.props.layer.layer.id); // Deselect
      this.props.actions.setSelectedLegendItem("");
      this.props.actions.setPreferenceMode("network");
    } else {
      // If not selected
      if (e.shiftKey && this.props.selection.length !== 0) {
        this.props.complexAction(this.props.layer, this.props.selection); // A complex selection is to be made
        this.props.actions.setSelectedLegendItem("");
        this.props.actions.setPreferenceMode("network");
      } else {
        this.props.actions.selectLayer(this.props.layer.layer.id); // Select
        this.props.actions.setSelectedLegendItem(this.props.layer.layer.name);
        this.props.actions.setPreferenceMode("color");
      }
    }
  };

  // Calculate the height values of the layer (begin and end) based on the spatial resolution
  calculateLayerHeight = (extreme_dimensions, dimensions, channels_first) => {
    var height = [extreme_dimensions.max_size, extreme_dimensions.max_size]; // Initialize the height placeholder
    if (dimensions.out.length > 1) {
      // Calculate the dimensions of the Layer for a multidimensional Tensor
      const spatial_index = channels_first ? 1 : 0;
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of all Layers
      const lay_diff = extreme_layer.max_size - extreme_layer.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff =
        extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = [
        (dimensions.in[spatial_index] - extreme_layer.min_size) / lay_diff,
        (dimensions.out[spatial_index] - extreme_layer.min_size) / lay_diff,
      ]; // Calculate the linear interpolation factor for boths sides of the Glyph
      if (perc[0] < 1.0 || perc[1] < 1.0) {
        // Only change the height, if they are smaller than max
        height = [
          perc[0] * dim_diff + extreme_dimensions.min_size,
          perc[1] * dim_diff + extreme_dimensions.min_size,
        ]; // Calculate the height for both sides of the Glyph through interpolation
        height[0] =
          height[0] > extreme_dimensions.max_size
            ? extreme_dimensions.max_size
            : height[0]; // Cap the height if something goes wrong
        height[1] =
          height[1] > extreme_dimensions.max_size
            ? extreme_dimensions.max_size
            : height[1]; // Cap the height if something goes wrong
      }
    } else {
      // Not a convolutional Layer
      const extreme_layer = this.props.layer_extreme_dimensions; // Get the Extremes of the Dimensions of all Dense Layers
      const lay_diff = extreme_layer.max_dense - extreme_layer.min_dense; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff =
        extreme_dimensions.max_size - extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      var perc = (dimensions.out - extreme_layer.min_dense) / lay_diff; // Calculate the linear interpolation factor for boths sides of the Glyph
      if (perc < 1.0) {
        // Only change the height, if they are smaller than max
        height = [
          perc * dim_diff + extreme_dimensions.min_size,
          perc * dim_diff + extreme_dimensions.min_size,
        ]; // Calculate the height for both sides of the Glyph through interpolation
        height[0] =
          height[0] > extreme_dimensions.max_size
            ? extreme_dimensions.max_size
            : height[0]; // Cap the height if something goes wrong
        height[1] =
          height[1] > extreme_dimensions.max_size
            ? extreme_dimensions.max_size
            : height[1]; // Cap the height if something goes wrong
      }
    }
    return height;
  };

  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    const set = this.props.settings
      ? this.props.settings
      : { color: "white", texture: "white" }; // Need initial Value if not already set, will be set back immediately and thus not visible
    const name = set.alias ? set.alias : this.props.layer.layer.name;
    const dimensions = this.props.layer.layer.properties.dimensions; // Get the Dimensions of the current Layer
    const extreme_dimensions = {
      max_size: this.props.preferences.layer_display_max_height.value,
      min_size: this.props.preferences.layer_display_min_height.value,
    }; // Get the Extremes of the Display Size for the Glyphs
    const layer_height = this.calculateLayerHeight(
      extreme_dimensions,
      dimensions,
      this.props.preferences.channels_first.value
    ); // Calculate the height of the Layer
    const pathData = paths.calculateGlyphPath(
      extreme_dimensions,
      layer_height,
      this.props.layer,
      this.props.edges
    ); // Calculate the Path of the Layer
    const tooltipRef = React.createRef(); // Reference for the Tooltip
    const properties_object = this.props.layer.layer.properties.properties; // Get the layer Properties
    const features = this.props.preferences.channels_first.value
      ? dimensions.out[0]
      : dimensions.out[dimensions.out.length - 1];
    const dimensionsLabelX =
      this.props.layer.x +
      this.props.layer.width / 2.0 +
      this.props.preferences.layers_spacing_horizontal.value +
      this.props.preferences.stroke_width.value;
    var inputSample = undefined; // Placeholder for label if this is an input of the Net
    if (this.props.layer.layer.properties.input.length === 0) {
      // If no inputs
      inputSample = {
        dimensions: dimensions.in, // Dimensions for this label are the input dimensions of the layer
        x: 2.0 * this.props.layer.x - dimensionsLabelX - layer_height[0], // X position of the label to be left of layer
        edge: {
          // Edge position is layer y
          points: [{ y: this.props.layer.y }],
        },
      };
    }
    var outputSample = undefined; // Placeholder for label if this is an output of the net
    if (this.props.layer.layer.properties.output.length === 0) {
      // If no outputs
      outputSample = {
        dimensions: dimensions.out, // Dimensions for this label are the output dimensions of the layer
        x: dimensionsLabelX, // X position of the label ro be right of layer
        edge: {
          // Edge position is layer y
          points: [{ y: this.props.layer.y }],
        },
      };
    }
    var isGroup = false;
    var borderModifier = 1.0;
    for (var group in this.props.groups) {
      if (this.props.groups[group].name === this.props.layer.layer.name) {
        isGroup = true;
        borderModifier = 3.0;
      }
    }
    // Colors of the Layer
    var fill = colors.getFillColor(
      set,
      this.props.preferences.no_colors.value,
      isGroup
    );
    var stroke = colors.getStrokeColor(
      set,
      this.props.preferences.no_colors.value,
      isGroup,
      this.props.selection.includes(this.props.layer.layer.id),
      dimensions.out.length === 1
    );

    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g>
        <g
          transform={`translate(${this.props.layer.x - this.props.layer.width / 2.0
            }, ${this.props.layer.y})`}
        >
          <path
            d={pathData}
            style={{
              fill: fill,
              stroke: stroke,
              strokeWidth:
                borderModifier * this.props.preferences.stroke_width.value,
              strokeLinejoin: "round",
            }}
            ref={tooltipRef}
            onClick={this.handleLayerClicked}
          />
          <TooltipComponent
            properties_object={properties_object}
            dimensions={dimensions}
            tooltipRef={tooltipRef}
            name={name}
          />
          {this.props.preferences.show_features.value && (
            <FeaturesLabelComponent
              features={features}
              x={this.props.layer.width / 2.0}
              layer_height={layer_height}
              extreme_dimensions={extreme_dimensions}
              layer={this.props.layer}
              edges={this.props.edges}
            />
          )}
          {this.props.preferences.show_name.value && (
            <NameLabelComponent
              name={name}
              x={this.props.layer.width / 2.0}
              layer_height={layer_height}
              extreme_dimensions={extreme_dimensions}
              layer={this.props.layer}
              edges={this.props.edges}
              features_above={this.props.preferences.show_features.value}
            />
          )}
        </g>
        {this.props.preferences.show_samples.value &&
          inputSample !== undefined &&
          dimensions.out.length > 1 && (
            <SampleComponent
              extent={layer_height[0]}
              x={inputSample.x}
              edge={inputSample.edge}
              layer_max_height={
                this.props.preferences.layer_display_max_height.value
              }
              strokeWidth={this.props.preferences.stroke_width.value / 2.0}
            />
          )}
        {this.props.preferences.show_samples.value &&
          outputSample !== undefined &&
          dimensions.out.length > 1 && (
            <SampleComponent
              extent={layer_height[1]}
              x={outputSample.x}
              edge={outputSample.edge}
              layer_max_height={
                this.props.preferences.layer_display_max_height.value
              }
              strokeWidth={this.props.preferences.stroke_width.value / 2.0}
            />
          )}
      </g>
    );
  }
}

// PropTypes of this Class, containing the Global Layer Settings
Layer.propTypes = {
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  layer: PropTypes.object.isRequired,
  settings: PropTypes.object,
  edges: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    selection: state.selection,
    groups: state.groups,
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
