import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Legend extends React.Component {
  render() {
    if(this.props.legend_toggle) {
      return(
        <div id='Legend'/>
      );
    } else {
      return null;
    }
  }
}

Legend.propTypes = {
  legend_toggle: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    legend_toggle: state.display.legend_toggle
  };
}

export default connect(mapStateToProps, undefined)(Legend);
