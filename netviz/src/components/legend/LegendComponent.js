import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Legend extends React.Component {
  render() {
    if(this.props.legend) {
      return(
        <div id='Legend'/>
      );
    } else {
      return null;
    }
  }
}

Legend.propTypes = {
  legend: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    legend: state.display.legend
  };
}

export default connect(mapStateToProps, undefined)(Legend);
