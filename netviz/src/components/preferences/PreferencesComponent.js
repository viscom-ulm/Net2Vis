import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Preferences extends React.Component {
  render() {
    if(this.props.preferences_toggle) {
      return(
        <div id='Preferences'/>
      );
    } else {
      return null;
    }
  }
}

Preferences.propTypes = {
  preferences_toggle: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    preferences_toggle: state.display.preferences_toggle
  };
}

export default connect(mapStateToProps, undefined)(Preferences);
