import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';

class Code extends React.Component {
  componentWillMount() {
    if(this.props.code === '') {
      this.props.actions.loadCode();
    }
  }

  render() {
    if(this.props.code_toggle) {
      const code = this.props.code;
      return(
        <div id='Code'>
          {code}
        </div>
      );
    } else {
      return null;
    }
  }
}

Code.propTypes = {
  code_toggle: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
  if (state.code) {
    return {
      code: state.code,
      code_toggle: state.display.code_toggle
    };
  } else {
    return {
      code: '',
      code_toggle: state.display.code_toggle
    };
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
