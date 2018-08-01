import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

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

  // Render the Preferences of the Visualization
  render() {
    if(this.props.preferences_toggle) {
      return(
        <div id='Preferences'>
          <div>
            Minimum Layer Height:
            <input type="number" step="10" value={this.props.layers_settings.layer_display_height.min_size} onChange={this.handleMinChange}/>
          </div>
          <div>
            Maximum Layer Height:
            <input type="number" step="10" value={this.props.layers_settings.layer_display_height.max_size} onChange={this.handleMaxChange}/>
          </div>
          <div>
            Layer Width:
            <input type="number" step="10" value={this.props.layers_settings.layer_display_width} onChange={this.handleWidthChange}/>
          </div>
          <div>
            Horizontal Layer Spacing:
            <input type="number" step="10" value={this.props.layers_settings.layers_spacing_horizontal} onChange={this.handleSpacingHorizontalChange}/>
          </div>
          <div>
            Vertical Layer Spacing:
            <input type="number" step="10" value={this.props.layers_settings.layers_spacing_vertical} onChange={this.handleSpacingVerticalChange}/>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

// Prop Types holding all the Preferences
Preferences.propTypes = {
  preferences_toggle: PropTypes.bool.isRequired,
  layers_settings: PropTypes.object.isRequired
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    preferences_toggle: state.display.preferences_toggle,
    layers_settings: state.layers_settings
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
