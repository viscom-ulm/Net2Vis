import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../../actions";

import EdgeComponent from "./EdgeComponent";
import DimensionsLabelComponent from "./DimensionsLabelComponent";

import * as paths from "../../paths";

// Layer Component providing individual Layer Visualizations
class Edges extends React.Component {
  // Render the Layer
  render() {
    // Get the Properties to use them in the Rendering
    const dimensions = this.props.layer.layer.properties.dimensions; // Get the Dimensions of the current Layer
    const current_edges = paths.getOutgoingEdges(
      this.props.layer,
      this.props.edges
    ); // Get relevant Edges going out from the current Layer
    const dimensionsLabelX =
      this.props.layer.x +
      this.props.layer.width / 2.0 +
      this.props.preferences.layers_spacing_horizontal.value / 2.0;
    var additionalLabelInput = undefined; // Placeholder for label if this is an input of the Net
    if (this.props.layer.layer.properties.input.length === 0) {
      // If no inputs
      additionalLabelInput = {
        dimensions: dimensions.in, // Dimensions for this label are the input dimensions of the layer
        x:
          2.0 * this.props.layer.x -
          dimensionsLabelX -
          this.props.preferences.stroke_width.value, // X position of the label to be left of layer
        edge: {
          // Edge position is layer y
          points: [{ y: this.props.layer.y }],
        },
      };
    }
    var additionalLabelOutput = undefined; // Placeholder for label if this is an output of the net
    if (this.props.layer.layer.properties.output.length === 0) {
      // If no outputs
      additionalLabelOutput = {
        dimensions: dimensions.out, // Dimensions for this label are the output dimensions of the layer
        x: dimensionsLabelX, // X position of the label ro be right of layer
        edge: {
          // Edge position is layer y
          points: [{ y: this.props.layer.y }],
        },
      };
    }
    // Return a Shape with the calculated parameters and add the Property Tooltip
    return (
      <g>
        {current_edges.map((edge, index) => (
          <g key={index}>
            <EdgeComponent
              edge={edge.points}
              layer_max_height={
                this.props.preferences.layer_display_max_height.value
              }
              horizontal_spacing={
                this.props.preferences.layers_spacing_horizontal
              }
              color={"black"}
            />
            {this.props.preferences.show_dimensions.value &&
              dimensions.out.length > 1 && (
                <DimensionsLabelComponent
                  dimensions={dimensions.out}
                  x={dimensionsLabelX}
                  edge={edge.points}
                  layer_max_height={
                    this.props.preferences.layer_display_max_height.value
                  }
                  channels_first={this.props.preferences.channels_first.value}
                />
              )}
          </g>
        ))}
        {this.props.preferences.show_dimensions.value &&
          additionalLabelInput !== undefined &&
          dimensions.out.length > 1 && (
            <DimensionsLabelComponent
              dimensions={additionalLabelInput.dimensions}
              x={additionalLabelInput.x}
              edge={additionalLabelInput.edge}
              layer_max_height={
                this.props.preferences.layer_display_max_height.value
              }
              channels_first={this.props.preferences.channels_first.value}
            />
          )}
        {this.props.preferences.show_dimensions.value &&
          additionalLabelOutput !== undefined &&
          dimensions.out.length > 1 && (
            <DimensionsLabelComponent
              dimensions={additionalLabelOutput.dimensions}
              x={additionalLabelOutput.x}
              edge={additionalLabelOutput.edge}
              layer_max_height={
                this.props.preferences.layer_display_max_height.value
              }
              channels_first={this.props.preferences.channels_first.value}
            />
          )}
      </g>
    );
  }
}

// PropTypes of this Class, containing the Global Layer Settings
Edges.propTypes = {
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  layer: PropTypes.object.isRequired,
  edges: PropTypes.array.isRequired,
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    selection: state.selection,
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Edges);
