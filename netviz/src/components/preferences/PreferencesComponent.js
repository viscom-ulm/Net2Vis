import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Preferences extends React.Component {
  render() {
    if(this.props.preferences) {
      return(
        <div id='Preferences'/>
      );
    } else {
      return null;
    }
  }
}

Preferences.propTypes = {
  preferences: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    preferences: state.display.preferences
  };
}

export default connect(mapStateToProps, undefined)(Preferences);
