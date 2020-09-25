import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import LegendItem from "./LegendItem";
import * as actions from "../../actions";
import * as legend from "../../legend";
import * as sort from "../../groups/Sort";
import Patterns from "../patterns/PatternComponent";

class Legend extends React.Component {
  // MouseDown Listener for SVG, recording the Position and registering MouseMove Listener
  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY,
    };
    document.addEventListener("mousemove", this.handleMouseMove);
    this.props.actions.setPreferenceMode("legend");
    this.props.actions.setSelectedLegendItem("");
  };

  // MouseUp Listener for SVG, ending the drag option by removing the MouseMove Listener
  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.coords = {};
  };

  // MouseMove Listener, moving the SVG around
  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.props.actions.moveLegend([xDiff, yDiff]);
  };

  // Scroll Listener, handling SVG zoom Actions
  handleScroll = (e) => {
    const delta = e.deltaY / Math.abs(e.deltaY);
    this.props.actions.zoomLegend(-delta);
  };

  // When a layer is clicked, change its selection state
  handleLayerClicked = (e) => {
    this.props.actions.setPreferenceMode("color");
    this.props.actions.setSelectedLegendItem(e);
  };

  render() {
    const group_t = this.props.legend_transform;
    const legendElement = document.getElementById("legendComponent"); // Get the main SVG Element
    var centerTransformation = { x: 0, y: 0 }; // Transformation to center the Graph initially
    if (this.props.legend_bbox.x !== undefined) {
      // If the elements exist already
      centerTransformation.x =
        legendElement.getBoundingClientRect().width / 2.0 -
        (this.props.legend_bbox.width * group_t.scale) / 2.0 -
        this.props.legend_bbox.x * group_t.scale; // Transformation to center the graph in x direction
      centerTransformation.y =
        legendElement.getBoundingClientRect().height / 2.0 -
        (this.props.legend_bbox.height * group_t.scale) / 2.0 -
        this.props.legend_bbox.y * group_t.scale; // Transformation to center the graph in y direction
    }
    const legend_transform = `translate(${
      group_t.x + centerTransformation.x
    }, ${group_t.y + centerTransformation.y}) scale(${group_t.scale})`; // Manipulate the position of the graph
    var groups = JSON.parse(JSON.stringify(this.props.groups));
    var settings = JSON.parse(JSON.stringify(this.props.layer_types_settings));
    sort.sortGroups(groups, settings); // Sort the groups so that the ones that depend on others are at the end
    const legend_representation = legend.getLegend(
      settings,
      groups,
      this.props.legend_preferences
    ); // Generate a representation of the legendItem to be rendered
    return (
      <svg
        width="100%"
        height="100%"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleScroll}
        id="legendComponent"
      >
        <Patterns />
        <g id="legend_group" transform={legend_transform}>
          {legend_representation.active.map((representation) => (
            <LegendItem
              representation={representation}
              key={representation.layer.representer.name}
              action={this.handleLayerClicked}
              selected={this.props.selected_legend_item}
            />
          ))}
        </g>
        <g id="hidden_legend_group" transform={legend_transform}>
          {legend_representation.hidden.map((representation) => (
            <LegendItem
              representation={representation}
              key={representation.layer.representer.name}
              action={this.handleLayerClicked}
              selected={this.props.selected_legend_item}
            />
          ))}
        </g>
      </svg>
    );
  }

  // After the component was rendered, check if the BBox stayed the same
  componentDidUpdate() {
    var currentBBox = document.getElementById("legend_group").getBBox(); // Get the main group of the SVG Element
    const currentHiddenBBox = document
      .getElementById("hidden_legend_group")
      .getBBox(); // Get the hidden group of the SVG Element
    if (currentHiddenBBox.width !== 0) {
      // Hidden elements present
      currentBBox.width =
        currentHiddenBBox.x - currentBBox.x + currentHiddenBBox.width; // Manipulate the width so it includes both active and hidden elements
      currentBBox.height =
        currentBBox.height < currentHiddenBBox.height
          ? currentHiddenBBox.height
          : currentBBox.height; // Manipulate the height, so it only reflects the larger value
      currentBBox.y =
        currentBBox.y > currentHiddenBBox.y
          ? currentHiddenBBox.y
          : currentBBox.y; // Manipulate the y position, so it only reflects the smaller value
    }
    var changed = false; // Changed placeholder
    if (this.props.legend_bbox.x !== currentBBox.x) {
      // X changed
      changed = true;
      this.props.legend_bbox.x = currentBBox.x;
    }
    if (this.props.legend_bbox.y !== currentBBox.y) {
      // Y Changed
      changed = true;
      this.props.legend_bbox.y = currentBBox.y;
    }
    if (this.props.legend_bbox.width !== currentBBox.width) {
      // Width Changed
      changed = true;
      this.props.legend_bbox.width = currentBBox.width;
    }
    if (this.props.legend_bbox.height !== currentBBox.height) {
      // Height changed
      changed = true;
      this.props.legend_bbox.height = currentBBox.height;
    }
    if (changed) {
      // Anything changed
      this.props.actions.setLegendBbox(currentBBox); // Push the new Bbox to the state
    }
  }
}

Legend.propTypes = {
  legend_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  legend_preferences: PropTypes.object.isRequired,
  selected_legend_item: PropTypes.string.isRequired,
  legend_bbox: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    legend_transform: state.legend_transform,
    layer_types_settings: state.layer_types_settings,
    groups: state.groups,
    legend_preferences: state.legend_preferences,
    selected_legend_item: state.selected_legend_item,
    legend_bbox: state.legend_bbox,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
