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
    var graph = graphs.buildGraphFromNetwork(this.props.network, this.props.layer_extreme_dimensions, this.props.preferences); // Get the graph for size calculation of the SVG
    var svg_text = document.getElementById('main_group').innerHTML; // Get the inner elements of the svg
    svg_text = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (graph._label.width + this.props.preferences.layer_display_width.value) + "' height='" + (graph._label.height+this.props.preferences.layer_display_max_height.value) + "'>" + svg_text + "</svg>"; // Append svg tag
    saveAs(new Blob([svg_text], {type: "text/svg;charset=utf-8"}), 'model.svg'); // Save the SVG on Disk
  }

  groupLayers = () => {
    graphs.groupLayers(this.props.network, this.props.selection);
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
  selection: PropTypes.array.isRequired
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    display: state.display,
    network: state.network,
    preferences: state.preferences,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    selection: state.selection
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
