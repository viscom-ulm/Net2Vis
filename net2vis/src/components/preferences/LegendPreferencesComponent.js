import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../../actions";

import { Typography } from "@mui/material";

import InputField from "../input/InputField";

import * as grouping from "../../groups/Grouping";
import * as duplicates from "../../groups/Duplicates";
import * as auto from "../../groups/Automation";
import * as removal from "../../groups/Removal";
import * as addition from "../../groups/Addition";
import * as sort from "../../groups/Sort";
import * as colors from "../../colors";

// Component for displaying the Preferences of the Visualization
class LegendPreferences extends React.Component {
  // Called when the spacing of the legend elements changes
  handleLegendElementSpacingChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.element_spacing.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Called when the Width of the legend layers changes
  handleLegendLayerWidthChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layer_width.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Called when the Height of the legend layers changes
  handleLegendLayerHeightChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layer_height.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Called when the horizontal spacing of the legend layers changes
  handleLegendLayersSpacingHorizontalChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layers_spacing_horizontal.value = parseInt(
      e.currentTarget.value,
      10
    );
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Called when the vertical spacing of the legend layers changes
  handleLegendLayersSpacingVerticalChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.layers_spacing_vertical.value = parseInt(
      e.currentTarget.value,
      10
    );
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Called when the spacing between representer and complex item of the legend layers changes
  handleLegendComplexSpacingChange = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.complex_spacing.value = parseInt(e.currentTarget.value, 10);
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  // Group some Layers together
  groupLayers = () => {
    this.addGroup(this.props.selection); // Add a new Group based on the current Layer Selection
  };

  // Automatically Group Layers that are very common in this order
  autoGroupLayers = () => {
    var repetition = auto.getMostCommonRepetition(
      this.props.compressed_network
    ); // Get the most common repetition
    if (repetition !== undefined) {
      // If a Repetition could be found
      this.addGroup(repetition.ids[0]); // Add a Group based on the repetition
    } else {
      console.warn("No repetition of at least two layers could be found.");
    }
  };

  addGroup = (ids) => {
    var group = grouping.groupLayers(this.props.compressed_network, ids); // Group the Layers based on given IDs
    if (
      group !== undefined &&
      !duplicates.groupDoesExist(group, this.props.groups)
    ) {
      // Check if the group could be made and does not already exist
      var groups = this.props.groups; // Get the current Groups
      var settings = this.props.layer_types_settings; // Get the current settings
      settings[group.name] = {
        color: colors.generateNewColor(
          settings,
          this.props.color_mode.generation
        ), // Generate a new Color for the group
        alias: "Group", // Initialize the alias
        texture: colors.generateNewTexture(settings), // Generate a new Texture for the group
      };
      addition.addGroup(groups, group); // Add the new Group to the existing ones
      sort.sortGroups(groups, settings); // Sort the groups so that the ones that depend on others are at the end
      this.props.actions.addGroup(
        groups,
        this.props.network,
        settings,
        this.props.id
      ); // Add the group to the state
    } else {
      console.warn("Either a duplicate or no grouping possible.");
    }
  };

  // Automaticalle remove the most complex Group
  autoUngroupLayers = () => {
    var currLegend = this.props.layer_types_settings; // Current most complex Group
    var name = this.props.groups[this.props.groups.length - 1].name; // Get the name of the currently selected Item
    removal.deleteGroup(name, this.props.groups); // Delete the group and expand Groups that depend on it
    delete currLegend[name]; // Delete the LegendItem
    this.props.actions.deleteGroups(
      this.props.groups,
      currLegend,
      this.props.network,
      this.props.id
    ); // Push the deletion to the state
  };

  // Toggle the display state of the Features Labels
  toggleReverseOrder = (e) => {
    var preferences = this.props.legend_preferences;
    preferences.reverse_order.value = !preferences.reverse_order.value;
    this.props.actions.updateLegendPreferences(preferences, this.props.id);
  };

  render() {
    return (
      <div className="preferencesWrapper">
        <div className="innerPreferencesWrapper">
          <Typography variant="h6" color="inherit">
            Legend
          </Typography>
          <div className="innerPreferencesWrapper">
            <InputField
              value={this.props.legend_preferences.element_spacing.value}
              type={this.props.legend_preferences.element_spacing.type}
              description={
                this.props.legend_preferences.element_spacing.description
              }
              action={this.handleLegendElementSpacingChange}
            />
            <InputField
              value={this.props.legend_preferences.layer_width.value}
              type={this.props.legend_preferences.layer_width.type}
              description={
                this.props.legend_preferences.layer_width.description
              }
              action={this.handleLegendLayerWidthChange}
            />
            <InputField
              value={this.props.legend_preferences.layer_height.value}
              type={this.props.legend_preferences.layer_height.type}
              description={
                this.props.legend_preferences.layer_height.description
              }
              action={this.handleLegendLayerHeightChange}
            />
            <InputField
              value={
                this.props.legend_preferences.layers_spacing_horizontal.value
              }
              type={
                this.props.legend_preferences.layers_spacing_horizontal.type
              }
              description={
                this.props.legend_preferences.layers_spacing_horizontal
                  .description
              }
              action={this.handleLegendLayersSpacingHorizontalChange}
            />
            <InputField
              value={
                this.props.legend_preferences.layers_spacing_vertical.value
              }
              type={this.props.legend_preferences.layers_spacing_vertical.type}
              description={
                this.props.legend_preferences.layers_spacing_vertical
                  .description
              }
              action={this.handleLegendLayersSpacingVerticalChange}
            />
            <InputField
              value={this.props.legend_preferences.complex_spacing.value}
              type={this.props.legend_preferences.complex_spacing.type}
              description={
                this.props.legend_preferences.complex_spacing.description
              }
              action={this.handleLegendComplexSpacingChange}
            />
            <InputField
              value={this.props.legend_preferences.reverse_order.value}
              type={this.props.legend_preferences.reverse_order.type}
              description={
                this.props.legend_preferences.reverse_order.description
              }
              action={this.toggleReverseOrder}
            />
          </div>
        </div>
        <div>
          <InputField
            value={"Group"}
            type={"paddedButton"}
            description={"Group"}
            action={this.groupLayers}
          />
          <InputField
            value={"Autogroup"}
            type={"paddedButton"}
            description={"Automatically Group"}
            action={this.autoGroupLayers}
          />
          <InputField
            value={"AutoUngroup"}
            type={"paddedButton"}
            description={"Automatically Remove Group"}
            action={this.autoUngroupLayers}
            options={"secondary"}
          />
        </div>
      </div>
    );
  }
}

// Prop Types holding all the Preferences
LegendPreferences.propTypes = {
  id: PropTypes.string.isRequired,
  legend_preferences: PropTypes.object.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  network: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired,
  color_mode: PropTypes.object.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    legend_preferences: state.legend_preferences,
    layer_types_settings: state.layer_types_settings,
    groups: state.groups,
    network: state.network,
    compressed_network: state.compressed_network,
    selection: state.selection,
    color_mode: state.color_mode,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LegendPreferences);
