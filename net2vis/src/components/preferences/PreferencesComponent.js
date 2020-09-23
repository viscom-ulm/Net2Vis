import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import NetworkPreferences from "./NetworkPreferencesComponent";
import GroupPreferences from "./GroupPreferencesComponent";
import LayerPreferences from "./LayerPreferencesComponent";
import LegendPreferences from "./LegendPreferencesComponent";

// Component for displaying the Preferences of the Visualization
class Preferences extends React.Component {
  // Check if the currently selected Layer is a Group
  isInGroups = (selectedLayer) => {
    for (var i in this.props.groups) {
      if (selectedLayer === this.props.groups[i].name) {
        return this.props.groups[i];
      }
    }
    return null;
  };

  // Render the Preferences of the Visualization
  render() {
    if (this.props.preferences_toggle) {
      switch (this.props.preferences_mode) {
        case "network":
          return <NetworkPreferences />;
        case "color":
          var group = this.isInGroups(this.props.selected_legend_item);
          if (group !== null) {
            return <GroupPreferences group={group} />;
          } else {
            return <LayerPreferences />;
          }
        case "legend":
          return <LegendPreferences />;
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
  selected_legend_item: PropTypes.string.isRequired,
  groups: PropTypes.array.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    preferences_mode: state.preferences_mode,
    preferences_toggle: state.display.preferences_toggle,
    selected_legend_item: state.selected_legend_item,
    groups: state.groups,
  };
}

export default connect(mapStateToProps, undefined)(Preferences);
