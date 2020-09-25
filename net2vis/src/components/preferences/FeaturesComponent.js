import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import InputField from "../input/InputField";
import * as actions from "../../actions";

class Features extends React.Component {
  // Feature Mapping Changes
  handleSelectChange = (e) => {
    var preferences = this.props.preferences;
    preferences.features_mapping.value = e.currentTarget.value;
    if (e.currentTarget.value !== "width") {
      preferences.layer_display_max_width = preferences.layer_display_min_width;
    }
    this.props.actions.updatePreferences(preferences, this.props.id);
  };

  // Width of a Layer Changes
  handleMinWidthChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layer_display_min_width.value = parseInt(
      e.currentTarget.value,
      10
    );
    this.props.actions.updatePreferences(preferences, this.props.id);
  };

  // Width of a Layer Changes
  handleMaxWidthChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layer_display_max_width.value = parseInt(
      e.currentTarget.value,
      10
    );
    this.props.actions.updatePreferences(preferences, this.props.id);
  };

  // Width of a Layer Changes
  handleWidthChange = (e) => {
    var preferences = this.props.preferences;
    preferences.layer_display_max_width.value = parseInt(
      e.currentTarget.value,
      10
    );
    preferences.layer_display_min_width.value = parseInt(
      e.currentTarget.value,
      10
    );
    this.props.actions.updatePreferences(preferences, this.props.id);
  };

  // Render the Preferences of the Visualization
  render() {
    return (
      <div>
        <InputField
          value={this.props.preferences.layer_display_min_width.value}
          type={this.props.preferences.layer_display_min_width.type}
          description={
            this.props.preferences.layer_display_min_width.description
          }
          action={this.handleMinWidthChange}
        />
        <InputField
          value={this.props.preferences.layer_display_max_width.value}
          type={this.props.preferences.layer_display_max_width.type}
          description={
            this.props.preferences.layer_display_max_width.description
          }
          action={this.handleMaxWidthChange}
        />
      </div>
    );
  }
}

// Prop Types holding all the Preferences
Features.propTypes = {
  id: PropTypes.string.isRequired,
  preferences: PropTypes.object.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    preferences: state.preferences,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Features);
