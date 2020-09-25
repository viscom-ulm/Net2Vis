import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../../actions";

import Layer from "./LayerComponent";
import Edges from "./EdgesComponent";

import * as graphs from "../../graphs";
import * as selection from "../../selection";
import * as common from "../../layers/Common";

// Network Component providing all the Network Visualization
class Network extends React.Component {
  // When the shift key is held when clicking a layer, a complex selection is triggered
  complexSelectionTriggered = (layer, selected) => {
    var paths = selection.allPaths(
      this.props.compressed_network.layers[
        common.getLayerByID(selected[0], this.props.compressed_network.layers)
      ],
      layer.layer,
      this.props.compressed_network
    ); // Get all Paths from the start node to the end node
    for (var i in paths) {
      // For all Paths
      if (paths[i][paths[i].length - 1].id !== layer.layer.id) {
        // If one did not reach the end Node
        this.props.actions.updateAlertSnack({
          open: true,
          message: "Selection not possible. Layers cannot be sequentialized.",
        });
        return; // Do not change the selection
      } else if (!selection.checkMultiInput(paths)) {
        this.props.actions.updateAlertSnack({
          open: true,
          message: "Selection not possible. Layers cannot be sequentialized.",
        });
        return;
      }
    }
    var toSelect = selection.reducePaths(paths); // Reduce the Paths to just each layer once
    this.props.actions.selectLayers(toSelect); // Select the Layers
  };

  // Render the individual Network Layers
  render() {
    const graph = graphs.buildGraphFromNetwork(
      this.props.compressed_network,
      this.props.layer_extreme_dimensions,
      this.props.preferences
    );
    var nodes = [];
    graph.nodes().forEach(function (e) {
      nodes.push(graph.node(e));
    });
    var edges = [];
    graph.edges().forEach(function (e) {
      edges.push({ v: e.v, w: e.w, points: graph.edge(e) });
    });
    const group_t = this.props.group_transform;
    const layer_types_settings = this.props.layer_types_settings;
    var networkElement = document.getElementById("networkComponent"); // Get the main SVG Element
    var centerTransformation = { x: 0, y: 0 }; // Transformation to center the Graph initially
    if (this.props.network_bbox.x !== undefined) {
      // If the elements exist already
      centerTransformation.x =
        networkElement.getBoundingClientRect().width / 2.0 -
        (this.props.network_bbox.width * group_t.scale) / 2.0 -
        this.props.network_bbox.x * group_t.scale; // Transformation to center the graph in x direction
      centerTransformation.y =
        networkElement.getBoundingClientRect().height / 2.0 -
        (this.props.network_bbox.height * group_t.scale) / 2.0 -
        this.props.network_bbox.y * group_t.scale; // Transformation to center the graph in y direction
    }
    const transform = `translate(${group_t.x + centerTransformation.x}, ${
      group_t.y + centerTransformation.y
    }) scale(${group_t.scale})`; // Manipulate the position of the graph
    return (
      <g id="main_group" transform={transform}>
        {nodes.map((layer) => (
          <Edges layer={layer} key={layer.layer.id} edges={edges} />
        ))}
        {nodes.map((layer) => (
          <Layer
            layer={layer}
            settings={layer_types_settings[layer.layer.name]}
            key={layer.layer.id}
            edges={edges}
            complexAction={this.complexSelectionTriggered}
          />
        ))}
      </g>
    );
  }

  // After the component was rendered, check if the BBox stayed the same
  componentDidUpdate() {
    const currentBBox = document.getElementById("main_group").getBBox(); // Get the main group of the SVG Element
    var changed = false; // Changed placeholder
    if (this.props.network_bbox.x !== currentBBox.x) {
      // X changed
      changed = true;
      this.props.network_bbox.x = currentBBox.x;
    }
    if (this.props.network_bbox.y !== currentBBox.y) {
      // Y Changed
      changed = true;
      this.props.network_bbox.y = currentBBox.y;
    }
    if (this.props.network_bbox.width !== currentBBox.width) {
      // Width Changed
      changed = true;
      this.props.network_bbox.width = currentBBox.width;
    }
    if (this.props.network_bbox.height !== currentBBox.height) {
      // Height changed
      changed = true;
      this.props.network_bbox.height = currentBBox.height;
    }
    if (changed) {
      // Anything changed
      this.props.actions.setNetworkBbox(currentBBox); // Push the new Bbox to the state
    }
  }
}

// PropTypes of the Network, containing all Layer, the Transformation of the Main Group and Settings for the Layer Types
Network.propTypes = {
  id: PropTypes.string.isRequired,
  group_transform: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired,
  color_mode: PropTypes.object.isRequired,
  network_bbox: PropTypes.object.isRequired,
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    group_transform: state.group_transform,
    layer_types_settings: state.layer_types_settings,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    compressed_network: state.compressed_network,
    color_mode: state.color_mode,
    network_bbox: state.network_bbox,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);
