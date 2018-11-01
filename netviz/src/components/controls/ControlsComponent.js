import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import ToggleButton from './ToggleButton';
import ClickableButton from './ClickableButton';
import * as actions from '../../actions';
import * as graphs from '../../graphs';

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    var svg_text = document.getElementById('main_group').innerHTML; // Get the inner elements of the svg
    const transform = `translate(${10}, ${-this.props.graph_extreme_dimensions.min_y + 5})`;
    svg_text = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (this.props.graph_extreme_dimensions.max_x - this.props.graph_extreme_dimensions.min_x) + "' height='" + (this.props.graph_extreme_dimensions.max_y - this.props.graph_extreme_dimensions.min_y + 10) + "'><g transform='" + transform + "'>" + svg_text + "</g></svg>"; // Append svg tag
    saveAs(new Blob([svg_text], {type: "text/svg;charset=utf-8"}), 'model.svg'); // Save the SVG on Disk
  }

  // Group some Layers together
  groupLayers = () => {
    var group = graphs.groupLayers(this.props.network, this.props.selection); // Group the Layers
    if (group !== undefined) { // Check if the group could be made
      this.props.actions.addGroup(group); // Add the group to the state
    }
  }

  render() {
    const display = this.props.display;
    return(
      <ul>
        <li className='header noselect'>NetViz</li>
        <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
        <ToggleButton name="Legend" state={display.legend_toggle} action={this.props.actions.toggleLegend}/>
        <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
        <ClickableButton name="Group" action={this.groupLayers}/>
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
  graph_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    display: state.display,
    network: state.network,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    graph_extreme_dimensions: state.graph_extreme_dimensions,
    selection: state.selection
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
