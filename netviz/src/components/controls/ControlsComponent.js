import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';
import * as dagre from 'dagre';

import ToggleButton from './ToggleButton';
import ClickableButton from './ClickableButton';
import * as actions from '../../actions';

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    var svg_text = document.getElementById('main_group').innerHTML; // Get the inner elements of the svg
    const transform = `translate(${10}, ${-this.props.graph_extreme_dimensions.min_y + 5})`;
    svg_text = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (this.props.graph_extreme_dimensions.max_x - this.props.graph_extreme_dimensions.min_x) + "' height='" + (this.props.graph_extreme_dimensions.max_y - this.props.graph_extreme_dimensions.min_y + 10) + "'><g transform='" + transform + "'>" + svg_text + "</g></svg>"; // Append svg tag
    saveAs(new Blob([svg_text], {type: "text/svg;charset=utf-8"}), 'model.svg'); // Save the SVG on Disk
  }

  // Build the network graph upon the Network representation
  build_graph_from_network = (network, layer_extreme_dimensions, preferences) => {
    var graph = new dagre.graphlib.Graph(); // Initialize the dagre Graph
    graph.setGraph({rankdir: 'LR', ranksep: 0, nodesep: 100});
    graph.setDefaultEdgeLabel(function() { return {}; }); 
    for (var i in network.layers) { // Add all Layers to the Graph
      const layer = network.layers[i]; // Get the current Layer
      const max_layer_dim = Math.max(layer.properties.dimensions.in[0], layer.properties.dimensions.out[0]) // Get the maximum dimension of the layer (in vs out)
      const lay_diff =  layer_extreme_dimensions.max_size - layer_extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      const dim_diff = preferences.layer_display_max_height.value - preferences.layer_display_min_height.value; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc = (max_layer_dim - layer_extreme_dimensions.min_size) / lay_diff; // Calculate the interpolation factor for boths sides of the Glyph 
      const height = perc * dim_diff + preferences.layer_display_min_height.value; // Calculate the height for both sides of the Glyph 
      graph.setNode(layer.id, {width: preferences.layer_display_width.value, height: height, layer: layer}); // Add a Node to the Graph
    }
    for (var j in network.layers) { // Add all Edges to the Graph
      var layer_current = network.layers[j]; // Get the current Layer
      for (var k in layer_current.properties.output) { // Go over all outputs of the current Layer
        graph.setEdge(layer_current.id, layer_current.properties.output[k]); // Add the Edge to the Graph
      }
    }
    dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
    return graph;
  }

  // Render the Controls
  render() {
    const display = this.props.display;
    return(
      <ul>
        <li className='header noselect'>NetViz</li>
        <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
        <ToggleButton name="Legend" state={display.legend_toggle} action={this.props.actions.toggleLegend}/>
        <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
        <ClickableButton name="Download" action={this.downloadSVG}/>
      </ul>
    );
  }
}

// Controls state of the Application
Controls.propTypes = {
  display: PropTypes.object.isRequired,
  network: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  graph_extreme_dimensions: PropTypes.object.isRequired
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    display: state.display,
    network: state.network,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    graph_extreme_dimensions: state.graph_extreme_dimensions
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
