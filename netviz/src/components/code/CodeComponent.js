import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import AceEditor from 'react-ace'
import 'brace/mode/python';
import 'brace/snippets/python';
import 'brace/ext/language_tools';
import 'brace/theme/monokai';

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
  handleOnChange = (newValue) => {
    this.props.actions.updateCode(newValue)    
  };

  // Render the Code into the Code View if Toggled
  render() {
    if(this.props.code_toggle) {
      const code = this.props.code;
      var annotations = [];
      if(this.props.error.hasOwnProperty('line_number')) {
        annotations = [{row: (this.props.error.line_number - 1), column: 0, text: this.props.error.error_class + ': ' + this.props.error.detail, type: 'error'}];
      }
      return(// Editor with Syntax highlighting
        <div id='Code'>
          <AceEditor
            mode="python"
            theme="monokai"
            wrapEnabled={true}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            onChange={this.handleOnChange}
            name="code_ace_editor"
            editorProps={{$blockScrolling: Infinity}}
            height = '100%'
            width = '100%'
            value = {code}
            annotations = {annotations}
            scrollMargin = {[10,0,0,0]}
          />
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
  code: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired
};

// Map the State to the Properties of this Component 
function mapStateToProps(state, ownProps) {
  if (state.code) { // Check if the Code is already available
    return {
      code: state.code,
      code_toggle: state.display.code_toggle,
      error: state.error      
    };
  } else {
    return {
      code: '',
      code_toggle: state.display.code_toggle,
      error: state.error
    };
  }
}

// Map the Actions of the Application to the Props of this Component  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
