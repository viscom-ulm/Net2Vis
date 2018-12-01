import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';

import ToggleButton from './ToggleButton';
import ClickableButton from './ClickableButton';
import * as actions from '../../actions';
import * as grouping from '../../groups/Grouping';
import * as duplicates from '../../groups/Duplicates';
import * as auto from '../../groups/Automation';
import * as colors from '../../colors';
import * as addition from '../../groups/Addition';

import downloadLogo from '../../media/download_icon.png';
import groupLogo from '../../media/group_icon.png';

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    const general_transform =  `translate(5, 5)`;
    var graph_element = document.getElementById('main_group'); // Get the main SVG Element
    var graph_width = graph_element.getBBox().width * this.props.group_transform.scale; // Calculate the width of this Element
    var graph_height = graph_element.getBBox().height * this.props.group_transform.scale; // Calculate the height of this Element
    var graph_text = graph_element.innerHTML; // Get the inner elements of the svg
    const graph_transform = `scale(${this.props.group_transform.scale}) translate(0, ${- (graph_element.getBBox().height/2.0)})`; // Set the transform for the graph to match the scaling and be centred
    var graph_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (graph_width + 10) + "' height='" + (graph_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + graph_transform + "'>" + graph_text + "</g></g></svg>"; // Wrap together the svg code for the Graph

    var legend_element = document.getElementById('legend_group'); // Get the legend SVG Element
    var legend_width = legend_element.getBBox().width * this.props.legend_transform.scale; // Calculate the width of this Element
    var legend_height = legend_element.getBBox().height * this.props.legend_transform.scale; // Calculate the height of this Element
    var legend_text = legend_element.innerHTML; // Get the inner elements of the svg
    const legend_transform = `scale(${this.props.legend_transform.scale})`; // Set the transform for the legend to match the scaling and be centred
    var legend_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (legend_width + 10) + "' height='" + (legend_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + legend_transform + "'>" + legend_text + "</g></g></svg>"; // Wrap together the svg code for the Legend

    saveAs(new Blob([graph_downloadable], {type: "text/svg;charset=utf-8"}), 'model.svg'); // save the svg on disk
    saveAs(new Blob([legend_downloadable], {type: "text/svg;charset=utf-8"}), 'legend.svg'); // save the svg on disk
  }

  // Group some Layers together
  groupLayers = () => {
    this.addGroup(this.props.selection); // Add a new Group based on the current Layer Selection
  }

  // Automatically Group Layers that are very common in this order
  autoGroupLayers = () => {
    var repetition = auto.getMostCommonRepetition(this.props.compressed_network); // Get the most common repetition
    if (repetition !== undefined) { // If a Repetition could be found
      this.addGroup(repetition.ids); // Add a Group based on the repetition
    } else {
      console.warn('No repetition of at least two layers could be found.');
    }
  }

  addGroup = (ids) => {
    var group = grouping.groupLayers(this.props.compressed_network, ids); // Group the Layers based on given IDs
    if (group !== undefined && (!duplicates.groupDoesExist(group, this.props.groups))) { // Check if the group could be made and does not already exist
      var groups = this.props.groups; // Get the current Groups
      var settings = this.props.layer_types_settings; // Get the current settings
      settings[group.name] = {
        color: colors.generateNewColor(settings), // Generate a new Color for the group
        alias: 'Group' // Initialize the alias
      }
      addition.addGroup(groups, group); // Add the new Group to the existing ones
      this.props.actions.addGroup(groups, group, settings, this.props.id); // Add the group to the state
    } else {
      console.warn('Either a duplicate or no grouping possible.');
    }
  }

  render() {
    const display = this.props.display;
    return(
      <div className='wrapper'>
        <div className='menu'>
          <div className='header noselect'>NetViz</div>
          <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
          <ToggleButton name="Legend" state={display.legend_toggle} action={this.props.actions.toggleLegend}/>
          <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
        </div>
        <div className='menu'>
          <ClickableButton name="Auto Group" image={groupLogo} action={this.autoGroupLayers}/>
          <ClickableButton name="Group" image={groupLogo} action={this.groupLayers}/>
          <ClickableButton name="Download" image={downloadLogo} action={this.downloadSVG}/>
        </div>
      </div>
    );
  }
}

// Controls state of the Application
Controls.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired,
  layer_extreme_dimensions: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  group_transform: PropTypes.object.isRequired,
  legend_transform: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    display: state.display,
    compressed_network: state.compressed_network,
    layer_extreme_dimensions: state.layer_extreme_dimensions,
    selection: state.selection,
    group_transform: state.group_transform,
    legend_transform: state.legend_transform,
    groups: state.groups,
    layer_types_settings: state.layer_types_settings
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
