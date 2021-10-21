import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../../actions";

import { Typography } from "@mui/material";

import InputField from "../input/InputField";

// Component for displaying the Preferences of the Visualization
class LayerPreferences extends React.Component {
  // Called when the Color of the Colorpicker changes
  handleColorChange = (e) => {
    var layerTypes = this.props.layer_types_settings;
    layerTypes[this.props.selected_legend_item].color = e.hex;
    this.props.actions.updateLayerTypes(
      layerTypes,
      this.props.network,
      this.props.id,
      this.props.color_mode.generation
    );
  };

  // Called when the Name of the Layer Alias changes
  handleAliasChange = (e) => {
    var layerTypes = this.props.layer_types_settings;
    layerTypes[this.props.selected_legend_item].alias = e.currentTarget.value;
    this.props.actions.updateLayerTypes(
      layerTypes,
      this.props.network,
      this.props.id,
      this.props.color_mode.generation
    );
  };

  // Deletes the Settings for a Layer
  deleteLayerSettings = (e) => {
    var currLegend = this.props.layer_types_settings; // Get the current Settings for the Legend
    var selectedItem = this.props.selected_legend_item; // Get the currently selected Legend Item
    for (var i in currLegend) {
      // Check all Legend Items
      if (selectedItem === String(i)) {
        // If is is the searched one
        delete currLegend[i]; // Remove it
      }
    }
    this.props.actions.deleteLayerTypes(
      currLegend,
      this.props.network,
      this.props.id,
      this.props.color_mode.generation
    ); // The Layertypes are done, this is called to update them
  };

  // Toggles a Layers visibility
  toggleLayer = (e) => {
    var layerTypes = this.props.layer_types_settings;
    if (
      this.props.layer_types_settings[this.props.selected_legend_item]
        .hidden === true
    ) {
      // If the currently selected group is active
      layerTypes[this.props.selected_legend_item].hidden = false;
    } else {
      // Group was inactive
      layerTypes[this.props.selected_legend_item].hidden = true;
    }
    this.props.actions.updateLayerTypesHideState(
      layerTypes,
      this.props.network,
      this.props.groups,
      this.props.id,
      this.props.color_mode.generation
    );
  };

  // Color selection mode Changes
  handleColorModeChange = (e) => {
    this.props.actions.setColorSelectionMode(e.target.value);
  };

  render() {
    var options = ["Palette", "Picker"];
    return (
      <div className="preferencesWrapper">
        <div className="innerPreferencesWrapper">
          <Typography variant="h6" color="inherit">
            Layer
          </Typography>
          <div className="innerPreferencesWrapper">
            <InputField
              value={
                this.props.layer_types_settings[this.props.selected_legend_item]
                  .alias
              }
              type={"text"}
              description={"Layer Alias"}
              action={this.handleAliasChange}
            />
            {!this.props.preferences.no_colors.value && (
              <InputField
                value={this.props.color_mode.selection}
                type={"select"}
                description={"Layer Color"}
                options={options}
                action={this.handleColorModeChange}
              />
            )}
            {!this.props.preferences.no_colors.value && (
              <InputField
                value={
                  this.props.layer_types_settings[
                    this.props.selected_legend_item
                  ].color
                }
                type={"color"}
                description={"Layer Color"}
                options={this.props.color_mode.selection}
                action={this.handleColorChange}
              />
            )}
            <InputField
              value={
                this.props.layer_types_settings[this.props.selected_legend_item]
                  .hidden
              }
              type={"switch"}
              description={"Hide Layer"}
              action={this.toggleLayer}
            />
          </div>
        </div>
        <div>
          <InputField
            value={"Delete"}
            type={"paddedButton"}
            description={"Reset Layer Type"}
            action={this.deleteLayerSettings}
            options={"secondary"}
          />
        </div>
      </div>
    );
  }
}

// Prop Types holding all the Preferences
LayerPreferences.propTypes = {
  id: PropTypes.string.isRequired,
  selected_legend_item: PropTypes.string.isRequired,
  layer_types_settings: PropTypes.object.isRequired,
  network: PropTypes.object.isRequired,
  color_mode: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    selected_legend_item: state.selected_legend_item,
    layer_types_settings: state.layer_types_settings,
    network: state.network,
    color_mode: state.color_mode,
    preferences: state.preferences,
    groups: state.groups,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LayerPreferences);
