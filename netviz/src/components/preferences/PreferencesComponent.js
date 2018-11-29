import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import InputField from './InputField'
import * as actions from '../../actions';
import Features from './FeaturesComponent';
import * as removal from '../../groups/Removal';

// Component for displaying the Preferences of the Visualization
class Preferences extends React.Component {
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
    preferences.layers_spacing_horizontal.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updatePreferences(preferences, this.props.id);
  }
  
  // Spacing of the Layers Changes
  handleSpacingVerticalChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layers_spacing_vertical.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updatePreferences(preferences, this.props.id);
  }

  // Called when the Color of the Colorpicker changes
  handleColorChange = (e) => {
    var layerTypes = this.props.layer_types_settings;
    layerTypes[this.props.selected_legend_item].color = e.hex;
    this.props.actions.updateLayerTypes(layerTypes, this.props.id);
  }

  // Called when the Name of the Layer Alias changes
  handleAliasChange = (e) => {
    var layerTypes = this.props.layer_types_settings;
    layerTypes[this.props.selected_legend_item].alias = e.currentTarget.value;
    this.props.actions.updateLayerTypes(layerTypes, this.props.id);
  }

  // Called when the spacing of the legend elements changes
  handleLegendElementSpacingChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.element_spacing.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Called when the Width of the legend layers changes
  handleLegendLayerWidthChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layer_width.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Called when the Height of the legend layers changes
  handleLegendLayerHeightChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layer_height.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Called when the horizontal spacing of the legend layers changes
  handleLegendLayersSpacingHorizontalChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layers_spacing_horizontal.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Called when the vertical spacing of the legend layers changes
  handleLegendLayersSpacingVerticalChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layers_spacing_vertical.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Called when the spacing between representer and complex item of the legend layers changes
  handleLegendComplexSpacingChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.complex_spacing.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  }

  // Check if the currently selected Layer is a Group
  isInGroups = (selectedLayer) => {
    for (var i in this.props.groups) {
      if (selectedLayer === this.props.groups[i].name) {
        return this.props.groups[i];
      }
    }
    return null;
  }

  // Toggles a Group and others that build on it
  toggleGroup = (e) => {
    var currGroups = this.props.groups; // Get the currently present groups
    var selectedGroup = removal.getGroupByName(this.props.selected_legend_item, this.props.groups);
    if (selectedGroup.group.active === true) { // If the currently selected group is active
      var groupIndices = removal.findGroupDependants(this.props.selected_legend_item, this.props.groups); // Get the indices for all groups to be deactivated
      for (var i in groupIndices) { // For all of these indices
        currGroups[groupIndices[i]].active = false; // Deactivate the group
      }
    } else { // Group was inactive
      currGroups[selectedGroup.id].active = true; // Activate the group
    }
    this.props.actions.updateGroups(this.props.groups, this.props.network, this.props.id); // Push the groups update to the state
  }
  
  // Removes a Group and others that build on it from the State
  deleteGroup = (e) => {
    var currGroups = this.props.groups; // Current Groups in the State
    var currLegend = this.props.layer_types_settings; // Current Legend Items in the State
    var groupIndices = removal.findGroupDependants(this.props.selected_legend_item, this.props.groups);
    var legendItems = [];
    for (var i in groupIndices) { // For all the groups in the deletion list
      for (var j in currLegend) { // For all the legend items
        if (String(j) === currGroups[groupIndices[i]].name) { // The Legend Entry for the currently inspected group was found
          legendItems.push(j); // Add this to the LegendItems to be deleted
        }
      }
    }
    groupIndices.sort(function(a, b) { // Sort the group indices to make deleting easy
      return b - a; // Descending
    });
    for (var m in groupIndices) { // Iterate over the indices
      currGroups.splice(groupIndices[m], 1); // Delete the Group
      delete currLegend[legendItems[m]]; // Delete the LegendItem
      m = m - 1;
    }
    this.props.actions.deleteGroups(currGroups, currLegend, this.props.network, this.props.id); // Push the deletion to the state
  }

  // Deletes the Settings for a Layer
  deleteLayerSettings = (e) => {
    var currLegend = this.props.layer_types_settings; // Get the current Settings for the Legend
    var selectedItem = this.props.selected_legend_item; // Get the currently selected Legend Item
    for (var i in currLegend) { // Check all Legend Items
      if (selectedItem === String(i)) { // If is is the searched one
        delete currLegend[i]; // Remove it
      }
    }
    this.props.actions.loadLayerTypesSuccess(currLegend, this.props.network); // The Layertypes are done, this is called to update them
  }

  // Render the Preferences of the Visualization
  render() {
    if(this.props.preferences_toggle) {
      switch (this.props.preferences_mode) {
        case 'network':
          return(
            <div id='Preferences'>
              <p>Network</p>
              <InputField value={this.props.preferences.layer_display_min_height.value} type={this.props.preferences.layer_display_min_height.type} description={this.props.preferences.layer_display_min_height.description} action={this.handleMinChange}/>
              <InputField value={this.props.preferences.layer_display_max_height.value} type={this.props.preferences.layer_display_max_height.type} description={this.props.preferences.layer_display_max_height.description} action={this.handleMaxChange}/>
              <Features/>
              <InputField value={this.props.preferences.layers_spacing_horizontal.value} type={this.props.preferences.layers_spacing_horizontal.type} description={this.props.preferences.layers_spacing_horizontal.description} action={this.handleSpacingHorizontalChange}/>
              <InputField value={this.props.preferences.layers_spacing_vertical.value} type={this.props.preferences.layers_spacing_vertical.type} description={this.props.preferences.layers_spacing_vertical.description} action={this.handleSpacingVerticalChange}/>
           </div>
          );
        case 'color':
          var group = this.isInGroups(this.props.selected_legend_item);
          if (group !== null) {
            return(
              <div id='Preferences'>
                <p>Group</p>
                <InputField value={this.props.layer_types_settings[this.props.selected_legend_item].alias} type={'text'} description={'Layer Alias'} action={this.handleAliasChange}/>
                <InputField value={this.props.layer_types_settings[this.props.selected_legend_item].color} type={'color'} description={'Layer Color'} action={this.handleColorChange}/>
                <InputField value={group.active} type={'switch'} description={'Group Active'} action={this.toggleGroup}/>
                <InputField value={'Delete'} type={'button'} description={'Delete Group'} action={this.deleteGroup}/>
              </div>
            );
          } else {
            return(
              <div id='Preferences'>
                <p>Layer</p>
                <InputField value={this.props.layer_types_settings[this.props.selected_legend_item].alias} type={'text'} description={'Layer Alias'} action={this.handleAliasChange}/>
                <InputField value={this.props.layer_types_settings[this.props.selected_legend_item].color} type={'color'} description={'Layer Color'} action={this.handleColorChange}/>
                <InputField value={'Delete'} type={'button'} description={'Delete Layer Settings'} action={this.deleteLayerSettings}/>
              </div>
            );
          }
        case 'legend':
          return(
            <div id='Preferences'>
              <p>Legend</p>
              <InputField value={this.props.legend_preferences.element_spacing.value} type={this.props.legend_preferences.element_spacing.type} description={this.props.legend_preferences.element_spacing.description} action={this.handleLegendElementSpacingChange}/>
              <InputField value={this.props.legend_preferences.layer_width.value} type={this.props.legend_preferences.layer_width.type} description={this.props.legend_preferences.layer_width.description} action={this.handleLegendLayerWidthChange}/>
              <InputField value={this.props.legend_preferences.layer_height.value} type={this.props.legend_preferences.layer_height.type} description={this.props.legend_preferences.layer_height.description} action={this.handleLegendLayerHeightChange}/>
              <InputField value={this.props.legend_preferences.layers_spacing_horizontal.value} type={this.props.legend_preferences.layers_spacing_horizontal.type} description={this.props.legend_preferences.layers_spacing_horizontal.description} action={this.handleLegendLayersSpacingHorizontalChange}/>
              <InputField value={this.props.legend_preferences.layers_spacing_vertical.value} type={this.props.legend_preferences.layers_spacing_vertical.type} description={this.props.legend_preferences.layers_spacing_vertical.description} action={this.handleLegendLayersSpacingVerticalChange}/>
              <InputField value={this.props.legend_preferences.complex_spacing.value} type={this.props.legend_preferences.complex_spacing.type} description={this.props.legend_preferences.complex_spacing.description} action={this.handleLegendComplexSpacingChange}/>
            </div>
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }
}

// Prop Types holding all the Preferences
Preferences.propTypes = {
  id: PropTypes.string.isRequired,
  preferences_mode: PropTypes.string.isRequired,
  preferences_toggle: PropTypes.bool.isRequired,
  preferences: PropTypes.object.isRequired,
  selected_legend_item: PropTypes.string.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  legend_preferences: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  network: PropTypes.object.isRequired
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    preferences_mode: state.preferences_mode,
    preferences_toggle: state.display.preferences_toggle,
    preferences: state.preferences,
    selected_legend_item: state.selected_legend_item,
    layer_types_settings: state.layer_types_settings,
    legend_preferences: state.legend_preferences,
    groups: state.groups,
    network: state.network
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
