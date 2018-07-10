import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

import * as actions from '../../actions';

// Component for displaying the code of the Neural Network implementation
class Code extends React.Component {
  // When this Component mounts, check if the Code was already loaded and load it if not
  componentWillMount() {
    if(this.props.code === '') {
      this.props.actions.loadCode();
    }
  }

  // When the Code changes, Update it on the Backend
  handleOnChange = (e) => {
    this.props.actions.updateCode(e.target.value)    
  };

  // Render the Code into the Code View if Toggled
  render() {
    if(this.props.code_toggle) {
      const code = this.props.code;
      return(
        <div id='Code'>
          <textarea value={code} onChange={this.handleOnChange}/>
        </div>
      );
    } else {
      return null;
    }
  }
}

// Code PropTypes are the toggle state and the code
Code.propTypes = {
  code_toggle: PropTypes.bool.isRequired,
  code: PropTypes.string.isRequired
};

// Map the State to the Properties of this Component 
function mapStateToProps(state, ownProps) {
  if (state.code) { // Check if the Code is already available
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

// Map the Actions of the Application to the Props of this Component  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
