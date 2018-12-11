import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';

import Typography from '@material-ui/core/Typography';

import InputField from './InputField'
import Features from './FeaturesComponent';

import * as grouping from '../../groups/Grouping';
import * as duplicates from '../../groups/Duplicates';
import * as auto from '../../groups/Automation';
import * as colors from '../../colors';
import * as addition from '../../groups/Addition';
import * as sort from '../../groups/Sort';

// Component for displaying the Preferences of the Visualization
class NetworkPreferences extends React.Component {
  // Min height of a Layer Changes
  handleMinChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layer_display_min_height.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Max Height of a Layer Changes
  handleMaxChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layer_display_max_height.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Spacing of the Layers Changes
  handleSpacingHorizontalChange = (e) => {
    var preferences = this.props.preferences;
    var newSpacing = parseInt(e.currentTarget.value, 10);
    preferences.layers_spacing_horizontal.value = newSpacing;
    if (newSpacing < 20) {
      preferences.show_dimensions.value = false;
    }
    this.props.actions.updatePreferences(preferences, this.props.id);
  }
  
  // Spacing of the Layers Changes
  handleSpacingVerticalChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layers_spacing_vertical.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Group some Layers together
  groupLayers = () => {
    this.addGroup(this.props.selection); // Add a new Group based on the current Layer Selection
  }

  // Automatically Group Layers that are very common in this order
  autoGroupLayers = () => {
    var repetition = auto.getMostCommonRepetition(this.props.compressed_network); // Get the most common repetition
    if (repetition !== undefined) { // If a Repetition could be found
      this.addGroup(repetition.ids[0]); // Add a Group based on the repetition
    } else {
      console.warn('No repetition of at least two layers could be found.');
    }
  }

  // Add a Group to the State
  addGroup = (ids) => {
    var group = grouping.groupLayers(this.props.compressed_network, ids); // Group the Layers based on given IDs
    if (group !== undefined && (!duplicates.groupDoesExist(group, this.props.groups))) { // Check if the group could be made and does not already exist
      var groups = this.props.groups; // Get the current Groups
      var settings = this.props.layer_types_settings; // Get the current settings
      settings[group.name] = {
        color: colors.generateNewColor(settings, this.props.color_mode.generation), // Generate a new Color for the group
        alias: 'Group' // Initialize the alias
      }
      addition.addGroup(groups, group); // Add the new Group to the existing ones
      sort.sortGroups(groups, settings); // Sort the groups so that the ones that depend on others are at the end
      this.props.actions.addGroup(groups, this.props.network, settings, this.props.id); // Add the group to the state
    } else {
      console.warn('Either a duplicate or no grouping possible.');
    }
  }

  // Toggle the display state of the Dimensions Labels
  toggleDimensionsLabel = (e) => {
    var preferences = this.props.preferences;
    preferences.show_dimensions.value = !preferences.show_dimensions.value;
    if (preferences.layers_spacing_horizontal.value < 20) {
      preferences.show_dimensions.value = false;
    }
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Toggle the display state of the Features Labels
  toggleFeaturesLabel = (e) => {
    var preferences = this.props.preferences;
    preferences.show_features.value = !preferences.show_features.value;
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Color generation mode Changes
  handleColorModeChange = (e) => {
    this.props.actions.setColorGenerationMode(e.target.value);
  }

  render() {
    var options = ['Interpolation', 'Palette']
    return(
      <div className='preferencesWrapper'>
        <div>
          <Typography variant="h6" color="inherit">
            Network
          </Typography>
          <InputField value={this.props.preferences.layer_display_min_height.value} type={this.props.preferences.layer_display_min_height.type} description={this.props.preferences.layer_display_min_height.description} action={this.handleMinChange}/>
          <InputField value={this.props.preferences.layer_display_max_height.value} type={this.props.preferences.layer_display_max_height.type} description={this.props.preferences.layer_display_max_height.description} action={this.handleMaxChange}/>
          <Features/>
          <InputField value={this.props.preferences.layers_spacing_horizontal.value} type={this.props.preferences.layers_spacing_horizontal.type} description={this.props.preferences.layers_spacing_horizontal.description} action={this.handleSpacingHorizontalChange}/>
          <InputField value={this.props.preferences.layers_spacing_vertical.value} type={this.props.preferences.layers_spacing_vertical.type} description={this.props.preferences.layers_spacing_vertical.description} action={this.handleSpacingVerticalChange}/>
          <InputField value={this.props.color_mode.generation} type={'select'} description={'Porposed Colors'} options={options} action={this.handleColorModeChange}/>
          <InputField value={this.props.preferences.show_dimensions.value} type={this.props.preferences.show_dimensions.type} description={this.props.preferences.show_dimensions.description} action={this.toggleDimensionsLabel}/>
          <InputField value={this.props.preferences.show_features.value} type={this.props.preferences.show_features.type} description={this.props.preferences.show_features.description} action={this.toggleFeaturesLabel}/>
        </div>
        <div>
          <InputField value={'Group'} type={'button'} description={'Group'} action={this.groupLayers}/>
          <InputField value={'Autogroup'} type={'button'} description={'Automatically Group'} action={this.autoGroupLayers}/>
        </div>
      </div>
    )
  }
}

// Prop Types holding all the Preferences
NetworkPreferences.propTypes = {
  id: PropTypes.string.isRequired,
  preferences: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  network: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  color_mode: PropTypes.object.isRequired
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    preferences: state.preferences,
    layer_types_settings: state.layer_types_settings,
    groups: state.groups,
    network: state.network,
    compressed_network: state.compressed_network,
    selection: state.selection,
    color_mode: state.color_mode
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkPreferences);
