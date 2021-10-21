import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

import * as actions from "../actions";

import { Close } from "@mui/icons-material";
import { IconButton, Snackbar } from "@mui/material";

class AlertSnack extends React.Component {
  handleClose = (event, reason) => {
    this.props.actions.updateAlertSnack({ open: false, message: "" });
  };

  render() {
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={this.props.alertSnack.open}
        autoHideDuration={6000}
        onClose={this.handleClose}
        ContentProps={{
          "aria-describedby": "message-id",
        }}
        message={<span id="message-id">{this.props.alertSnack.message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <Close />
          </IconButton>,
        ]}
      />
    );
  }
}

// Prop Types holding all the Preferences
AlertSnack.propTypes = {
  alertSnack: PropTypes.object.isRequired,
};

// Map the State to the Properties of this Component
function mapStateToProps(state, ownProps) {
  return {
    alertSnack: state.alert_snack,
  };
}

// Map the actions of the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertSnack);
