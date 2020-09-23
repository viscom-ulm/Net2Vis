import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import AceEditor from "react-ace";
import InputField from "../input/InputField";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/theme-chrome";

import * as actions from "../../actions";

// Component for displaying the code of the Neural Network implementation
class Code extends React.Component {
  handleOnChange = (newValue) => {
    this.props.actions.updateCode(newValue);
  };

  // When the Code changes, Update it on the Backend
  updateStoredCode = () => {
    this.props.actions.updateCodeBackend(
      this.props.code,
      this.props.id,
      this.props.groups,
      this.props.color_mode.generation,
      this.props.preferences
    );
  };

  componentDidUpdate() {
    this.refs.aceEditor.editor.resize(); // Triggering a resize of the editor, which is needed to be displayed correctly
  }

  // Render the Code into the Code View if Toggled
  render() {
    const code = this.props.code;
    var annotations = [];
    if (this.props.error.hasOwnProperty("line_number")) {
      annotations = [
        {
          row: this.props.error.line_number - 1,
          column: 0,
          text: this.props.error.detail,
          type: "error",
        },
      ];
    }
    return (
      // Editor with Syntax highlighting
      <div className="preferencesWrapper">
        <div id="codeDiv">
          <AceEditor
            ref="aceEditor"
            mode="python"
            theme="chrome"
            wrapEnabled={true}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            onChange={this.handleOnChange}
            name="code_ace_editor"
            editorProps={{ $blockScrolling: Infinity }}
            height="100%"
            width="auto"
            value={code}
            annotations={annotations}
            scrollMargin={[10, 0, 0, 0]}
          />
        </div>
        <div>
          <InputField
            value={"Update"}
            type={"codeButton"}
            description={"Update"}
            action={this.updateStoredCode}
            active={true}
          />
        </div>
      </div>
    );
  }
}

// Code PropTypes are the toggle state and the code
Code.propTypes = {
  id: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  color_mode: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  if (state.code) {
    // Check if the Code is already available
    return {
      id: state.id,
      code: state.code,
      error: state.error,
      groups: state.groups,
      color_mode: state.color_mode,
      preferences: state.preferences,
    };
  } else {
    return {
      id: state.id,
      code: "",
      error: state.error,
      groups: state.groups,
      color_mode: state.color_mode,
      preferences: state.preferences,
    };
  }
}

// Map the Actions of the Application to the Props of this Component
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
