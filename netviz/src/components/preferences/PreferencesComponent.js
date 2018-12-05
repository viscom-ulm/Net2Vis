import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import Typography from '@material-ui/core/Typography';

import NetworkPreferences from './NetworkPreferencesComponent';
import GroupPreferences from './GroupPreferencesComponent';
import LayerPreferences from './LayerPreferencesComponent';

import InputField from './InputField'
import * as actions from '../../actions';
import * as removal from '../../groups/Removal';
import * as activation from '../../groups/Activation';

// Component for displaying the Preferences of the Visualization
class Preferences extends React.Component {
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

  // Render the Preferences of the Visualization
  render() {
    if(this.props.preferences_toggle) {
      switch (this.props.preferences_mode) {
        case 'network':
          return(
            <NetworkPreferences/>
          );
        case 'color':
          var group = this.isInGroups(this.props.selected_legend_item);
          if (group !== null) {
            return(
              <GroupPreferences group={group}/>
            );
          } else {
            return(
              <LayerPreferences/>
            );
          }
        case 'legend':
          return(
            <div className='preferencesWrapper'>
              <div>
              <Typography variant="h6" color="inherit">
                Legend
              </Typography>
              <InputField value={this.props.legend_preferences.element_spacing.value} type={this.props.legend_preferences.element_spacing.type} description={this.props.legend_preferences.element_spacing.description} action={this.handleLegendElementSpacingChange}/>
              <InputField value={this.props.legend_preferences.layer_width.value} type={this.props.legend_preferences.layer_width.type} description={this.props.legend_preferences.layer_width.description} action={this.handleLegendLayerWidthChange}/>
              <InputField value={this.props.legend_preferences.layer_height.value} type={this.props.legend_preferences.layer_height.type} description={this.props.legend_preferences.layer_height.description} action={this.handleLegendLayerHeightChange}/>
              <InputField value={this.props.legend_preferences.layers_spacing_horizontal.value} type={this.props.legend_preferences.layers_spacing_horizontal.type} description={this.props.legend_preferences.layers_spacing_horizontal.description} action={this.handleLegendLayersSpacingHorizontalChange}/>
              <InputField value={this.props.legend_preferences.layers_spacing_vertical.value} type={this.props.legend_preferences.layers_spacing_vertical.type} description={this.props.legend_preferences.layers_spacing_vertical.description} action={this.handleLegendLayersSpacingVerticalChange}/>
              <InputField value={this.props.legend_preferences.complex_spacing.value} type={this.props.legend_preferences.complex_spacing.type} description={this.props.legend_preferences.complex_spacing.description} action={this.handleLegendComplexSpacingChange}/>
            </div>
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
  network: PropTypes.object.isRequired,
  compressed_network: PropTypes.object.isRequired,
  selection: PropTypes.array.isRequired
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
    network: state.network,
    compressed_network: state.compressed_network,
    selection: state.selection
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
