import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import AceEditor from "react-ace";
import Dropzone from "react-dropzone";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

import InputField from "../input/InputField";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/theme-chrome";

import * as actions from "../../actions";

// Component for displaying the code of the Neural Network implementation
class Code extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

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

  updateStoredModel = () => {
    this.props.actions.uploadModel(
      this.props.id,
      this.props.groups,
      this.props.color_mode.generation,
      this.props.preferences
    );
  };

  componentDidUpdate() {
    this.editorRef.current.editor.resize(); // Triggering a resize of the editor, which is needed to be displayed correctly
  }

  uploadFile(file) {
    this.props.actions.updateModelBackend(
      file,
      this.props.id,
      this.props.groups,
      this.props.color_mode.generation,
      this.props.preferences
    );
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
    const display = this.props.display;
    return (
      // Editor with Syntax highlighting
      <div className="preferencesWrapper">
        <div id="codeDiv">
          <AceEditor
            ref={this.editorRef}
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
        {this.props.code === "No code loaded since model file is present." ? (
          <InputField
            value={"Delete Model"}
            type={"codeButton"}
            description={"Delete Model"}
            options={"secondary"}
            action={() => this.props.actions.deleteModel(this.props.id)}
            active={true}
          />
        ) : (
          <div className="updateButtonContainer">
            <InputField
              value={"Upload Model"}
              type={"codeButton"}
              description={"Upload Model"}
              action={this.props.actions.toggleUpload}
              active={true}
            />
            <InputField
              value={"Update"}
              type={"codeButton"}
              description={"Update"}
              action={this.updateStoredCode}
              active={true}
            />
          </div>
        )}
        <Dialog
          open={display.upload_toggle}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Upload h5 or onnx Model</DialogTitle>
          <DialogContent>
            <div className="dropzoneContainer">
              <Dropzone
                onDrop={(acceptedFiles) => {
                  this.uploadFile(acceptedFiles[0])
                }}
                acceptedFiles=".h5,.onnx"
                maxFiles={1}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>Drag a model file here, or click to select a file.</p>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.props.actions.toggleUpload}
              color="secondary"
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
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
  display: PropTypes.object.isRequired,
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
      display: state.display,
    };
  } else {
    return {
      id: state.id,
      code: "",
      error: state.error,
      groups: state.groups,
      color_mode: state.color_mode,
      preferences: state.preferences,
      display: state.display,
    };
  }
}

// Map the Actions of the Application to the Props of this Component
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Code);
