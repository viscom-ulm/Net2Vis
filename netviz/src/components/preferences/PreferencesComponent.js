import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {SketchPicker} from 'react-color';

import InputField from './InputField'
import * as actions from '../../actions';

// Component for displaying the Preferences of the Visualization
class Preferences extends React.Component {
  // Min height of a Layer Changes
  handleMinChange = (e) => {
    this.props.actions.changeLayersMinHeight(parseInt(e.currentTarget.value, 10));
  }

  // Max Height of a Layer Changes
  handleMaxChange = (e) => {
    this.props.actions.changeLayersMaxHeight(parseInt(e.currentTarget.value, 10));
  }

  // Width of a Layer Changes
  handleWidthChange = (e) => {
    this.props.actions.changeLayersWidth(parseInt(e.currentTarget.value, 10));
  }

  // Spacing of the Layers Changes
  handleSpacingHorizontalChange = (e) => {
    this.props.actions.changeLayersSpacingHorizontal(parseInt(e.currentTarget.value, 10));
  }
  
  // Spacing of the Layers Changes
  handleSpacingVerticalChange = (e) => {
    this.props.actions.changeLayersSpacingVertical(parseInt(e.currentTarget.value, 10));
  }

  // Called when the Color of the Colorpicker changes
  handleColorChange = (e) => {
    var layerTypes = this.props.layer_types_settings;
    layerTypes[this.props.selected_legend_item].color = e.hex;
    this.props.actions.updateLayerTypes(layerTypes);
  }

  // Render the Preferences of the Visualization
  render() {
    if(this.props.preferences_toggle) {
      switch (this.props.preferences_mode) {
        case 'network':
          return(
            <div id='Preferences'>
              <InputField value={this.props.preferences.layer_display_min_height.value} type={this.props.preferences.layer_display_min_height.type} description={this.props.preferences.layer_display_min_height.description} action={this.handleMinChange}/>
              <InputField value={this.props.preferences.layer_display_max_height.value} type={this.props.preferences.layer_display_max_height.type} description={this.props.preferences.layer_display_max_height.description} action={this.handleMaxChange}/>
              <InputField value={this.props.preferences.layer_display_width.value} type={this.props.preferences.layer_display_width.type} description={this.props.preferences.layer_display_width.description} action={this.handleWidthChange}/>
              <InputField value={this.props.preferences.layers_spacing_horizontal.value} type={this.props.preferences.layers_spacing_horizontal.type} description={this.props.preferences.layers_spacing_horizontal.description} action={this.handleSpacingHorizontalChange}/>
              <InputField value={this.props.preferences.layers_spacing_vertical.value} type={this.props.preferences.layers_spacing_vertical.type} description={this.props.preferences.layers_spacing_vertical.description} action={this.handleSpacingVerticalChange}/>
           </div>
          );
        case 'color':
          return(
            <div id='Preferences'>
                <SketchPicker color={ this.props.layer_types_settings[this.props.selected_legend_item].color } onChange={ this.handleColorChange } />
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
  preferences_mode: PropTypes.string.isRequired,
  preferences_toggle: PropTypes.bool.isRequired,
  preferences: PropTypes.object.isRequired,
  selected_legend_item: PropTypes.string.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    preferences_mode: state.preferences_mode,
    preferences_toggle: state.display.preferences_toggle,
    preferences: state.preferences,
    selected_legend_item: state.selected_legend_item,
    layer_types_settings: state.layer_types_settings
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
