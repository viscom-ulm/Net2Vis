import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Code extends React.Component {
  render() {
    if(this.props.code) {
      return(
        <div id='Code'/>
      );
    } else {
      return null;
    }
  }
}

Code.propTypes = {
  code: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    code: state.display.code
  };
}

export default connect(mapStateToProps, undefined)(Code);
