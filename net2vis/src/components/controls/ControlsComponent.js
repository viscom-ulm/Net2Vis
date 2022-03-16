import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { GetApp, BugReport, Help } from "@mui/icons-material";

import ToggleButton from "./ToggleButton";
import * as actions from "../../actions";
import DownloadApi from "../../api/DownloadApi";

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    const netowrk_transform = `translate(5, 5)`;
    var graph_element = document.getElementById("main_group"); // Get the main SVG Element
    var graph_bBox = graph_element.getBBox();
    var graph_width = graph_bBox.width * this.props.group_transform.scale; // Calculate the width of this Element
    var graph_height = graph_bBox.height * this.props.group_transform.scale; // Calculate the height of this Element
    var graph_text = graph_element.innerHTML; // Get the inner elements of the svg
    const graph_transform = `scale(${this.props.group_transform.scale
      }) translate(${-graph_bBox.x}, ${-graph_bBox.y})`; // Set the transform for the graph to match the scaling and be centred
    var graph_downloadable = "";
    if (this.props.preferences.no_colors.value) {
      // No colors should be used, so textures need to be included.
      var defs_element = document.getElementById("main_defs"); // Get the main SVG Element
      graph_downloadable =
        "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" +
        (graph_width + 10) +
        "' height='" +
        (graph_height + 10) +
        "'>" +
        defs_element.innerHTML +
        "<g transform='" +
        netowrk_transform +
        "'><g transform='" +
        graph_transform +
        "'>" +
        graph_text +
        "</g></g></svg>"; // Wrap together the svg code for the Graph
    } else {
      // Standard case, using colors and therefore not including textures.
      graph_downloadable =
        "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" +
        (graph_width + 10) +
        "' height='" +
        (graph_height + 10) +
        "'><g transform='" +
        netowrk_transform +
        "'><g transform='" +
        graph_transform +
        "'>" +
        graph_text +
        "</g></g></svg>"; // Wrap together the svg code for the Graph
    }

    const lgnd_transform = `translate(25, 5)`;
    var legend_element = document.getElementById("legend_group"); // Get the legend SVG Element
    var bBox = legend_element.getBBox();
    var legend_width = bBox.width * this.props.legend_transform.scale; // Calculate the width of this Element
    var legend_height = bBox.height * this.props.legend_transform.scale; // Calculate the height of this Element
    var legend_text = legend_element.innerHTML; // Get the inner elements of the svg
    const legend_transform = `scale(${this.props.legend_transform.scale
      }) translate(${-bBox.x}, ${-bBox.y})`; // Set the transform for the legend to match the scaling and be centred
    var legend_downloadable = "";
    if (this.props.preferences.no_colors.value) {
      // No colors should be used, so textures need to be included.
      var defs_element_legend = document.getElementById("main_defs"); // Get the main SVG Element
      legend_downloadable =
        "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" +
        (legend_width + 50) +
        "' height='" +
        (legend_height + 10) +
        "'>" +
        defs_element_legend.innerHTML +
        "<g transform='" +
        lgnd_transform +
        "'><g transform='" +
        legend_transform +
        "'>" +
        legend_text +
        "</g></g></svg>"; // Wrap together the svg code for the Legend
    } else {
      legend_downloadable =
        "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" +
        (legend_width + 50) +
        "' height='" +
        (legend_height + 10) +
        "'><g transform='" +
        lgnd_transform +
        "'><g transform='" +
        legend_transform +
        "'>" +
        legend_text +
        "</g></g></svg>"; // Wrap together the svg code for the Legend
    }

    DownloadApi.sendVisualization(
      this.props.id,
      graph_downloadable,
      legend_downloadable
    );
    this.props.actions.toggleAlert();
  };

  render() {
    const display = this.props.display;
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Net2Vis
          </Typography>
          <div className="wrapper">
            <div className="menu">
              <ToggleButton
                name="Code"
                state={display.code_toggle}
                action={this.props.actions.toggleCode}
              />
              <ToggleButton
                name="Preferences"
                state={display.preferences_toggle}
                action={this.props.actions.togglePreferences}
              />
            </div>
            <div>
              <IconButton
                color="inherit"
                aria-label="Help"
                onClick={this.props.actions.toggleHelp}
              >
                <Help />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Report Bug"
                onClick={() =>
                  window.open(
                    "https://github.com/viscom-ulm/Net2Vis/issues",
                    "_blank"
                  )
                }
              >
                <BugReport />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="Download"
                onClick={this.props.actions.toggleAlert}
              >
                <GetApp />
              </IconButton>
              <Dialog
                open={display.alert_toggle}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Thank you for using Net2Vis!
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    This is a research project. When using these visualizations,
                    please <a href="https://ieeexplore.ieee.org/abstract/document/9350177" target="_blank">cite us</a>.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.downloadSVG} color="primary" autoFocus>
                    Sure
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={display.help_toggle}
                aria-labelledby="help-dialog-title"
                aria-describedby="help-dialog-description"
              >
                <DialogTitle id="help-dialog-title">
                  Help
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="help-dialog-description">
                    Net2Vis has been a research project and is now maintained by the author of the <a href="https://ieeexplore.ieee.org/abstract/document/9350177">associated publication</a> and by the community that uses this application.
                    Feel free to file issues on git or contribute yourself by implementing new features.
                    <br />
                    <br />
                    <b>Grouping</b>
                    <br />
                    To create custom groups, select a layer, then shift-select another layer.
                    If you selected layers that can be grouped, the group button on the lower right will become active.
                    <br />
                    <br />
                    <b>Errors</b>
                    <br />
                    If your code contains an error, you will get a notification saying that your code is not executable.
                    The code will also get a red x icon next to where the error occured.
                    Hovering that icon provides more detail on the error.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.props.actions.toggleHelp} color="primary" autoFocus>
                    Thanks!
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

// Controls state of the Application
Controls.propTypes = {
  id: PropTypes.string.isRequired,
  display: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  legend_transform: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
    display: state.display,
    group_transform: state.group_transform,
    legend_transform: state.legend_transform,
    preferences: state.preferences,
  };
}

// Map the Actions called when Controls are used to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
