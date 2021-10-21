import React from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Grid, Paper } from "@mui/material";

import * as actions from "../actions";
import Network from "./network/NetworkComponent";
import Legend from "./legend/LegendComponent";
import Preferences from "./preferences/PreferencesComponent";
import Code from "./code/CodeComponent";
import Patterns from "./patterns/PatternComponent";
import AlertSnack from "./AlertSnack";

// Main component of the Application that displays all content dependant on the Controls State
class Main extends React.Component {
  constructor(props) {
    super(props);
    var { id } = props.match.params;
    if (id !== undefined) {
      this.props.actions.setID(id);
      this.props.actions.reloadAllState(id, this.props.color_mode.generation);
    }
  }

  makeId(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  componentDidUpdate(prevProps) {
    // Only reload if the state changes somewhere else than in these
    if (
      this.props.color_mode.generation === prevProps.color_mode.generation &&
      this.props.code_toggle === prevProps.code_toggle &&
      this.props.preferences_toggle === prevProps.preferences_toggle
    ) {
      const { id } = this.props.match.params;
      this.props.actions.setID(id);
      this.props.actions.reloadAllState(id, this.props.color_mode.generation);
    }
  }

  // MouseDown Listener for SVG, recording the Position and registering MouseMove Listener
  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY,
    };
    document.addEventListener("mousemove", this.handleMouseMove);
    this.props.actions.setPreferenceMode("network");
    this.props.actions.setSelectedLegendItem("");
    if (!e.shiftKey) {
      this.props.actions.deselectLayers();
    }
  };

  // MouseUp Listener for SVG, ending the drag option by removing the MouseMove Listener
  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.coords = {};
  };

  // MouseMove Listener, moving the SVG around
  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.props.actions.moveGroup([xDiff, yDiff]);
  };

  // Scroll Listener, handling SVG zoom Actions
  handleScroll = (e) => {
    const delta = e.deltaY / Math.abs(e.deltaY);
    this.props.actions.zoomGroup(-delta);
  };

  // Render the Main Content and call other Elements
  render() {
    var { id } = this.props.match.params;
    if (id === undefined) {
      id = this.makeId(50);
      return <Redirect to={"/" + id} />;
    } else {
      return (
        <Grid container direction="row" spacing={1} className="mainGrid">
          {this.props.code_toggle && (
            <Grid item className="codeGrid">
              <Paper className="codePaper">
                <Code />
              </Paper>
            </Grid>
          )}
          <Grid item xs>
            <Grid container direction="column" spacing={1} className="mainGrid">
              <Grid item className="svgGrid">
                <Paper className="full">
                  <svg
                    width="100%"
                    height="100%"
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onWheel={this.handleScroll}
                    id="networkComponent"
                  >
                    <Patterns />
                    <Network />
                  </svg>
                </Paper>
              </Grid>
              {this.props.legend_toggle && (
                <Grid item className="legendGrid">
                  <Paper className="full">
                    <Legend />
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Grid>
          {this.props.preferences_toggle && (
            <Grid item className="preferencesGrid">
              <Preferences />
            </Grid>
          )}
          <AlertSnack />
        </Grid>
      );
    }
  }
}

Main.propTypes = {
  legend_toggle: PropTypes.bool,
  code_toggle: PropTypes.bool.isRequired,
  preferences_toggle: PropTypes.bool.isRequired,
  color_mode: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
  return {
    legend_toggle: state.display.legend_toggle,
    code_toggle: state.display.code_toggle,
    preferences_toggle: state.display.preferences_toggle,
    color_mode: state.color_mode,
  };
}

// Mapping the Actions called for SVG manipulation to the Props of this Class
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
