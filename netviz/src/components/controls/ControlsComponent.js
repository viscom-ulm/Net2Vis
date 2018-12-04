import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GetApp from '@material-ui/icons/GetApp';

import ToggleButton from './ToggleButton';
import * as actions from '../../actions';

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    const general_transform =  `translate(5, 5)`;
    var graph_element = document.getElementById('main_group'); // Get the main SVG Element
    var graph_width = graph_element.getBBox().width * this.props.group_transform.scale; // Calculate the width of this Element
    var graph_height = graph_element.getBBox().height * this.props.group_transform.scale; // Calculate the height of this Element
    var graph_text = graph_element.innerHTML; // Get the inner elements of the svg
    const graph_transform = `scale(${this.props.group_transform.scale}) translate(0, ${- (graph_element.getBBox().height/2.0)})`; // Set the transform for the graph to match the scaling and be centred
    var graph_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (graph_width + 10) + "' height='" + (graph_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + graph_transform + "'>" + graph_text + "</g></g></svg>"; // Wrap together the svg code for the Graph

    var legend_element = document.getElementById('legend_group'); // Get the legend SVG Element
    var legend_width = legend_element.getBBox().width * this.props.legend_transform.scale; // Calculate the width of this Element
    var legend_height = legend_element.getBBox().height * this.props.legend_transform.scale; // Calculate the height of this Element
    var legend_text = legend_element.innerHTML; // Get the inner elements of the svg
    const legend_transform = `scale(${this.props.legend_transform.scale})`; // Set the transform for the legend to match the scaling and be centred
    var legend_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (legend_width + 10) + "' height='" + (legend_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + legend_transform + "'>" + legend_text + "</g></g></svg>"; // Wrap together the svg code for the Legend

    saveAs(new Blob([graph_downloadable], {type: "text/svg;charset=utf-8"}), 'model.svg'); // save the svg on disk
    saveAs(new Blob([legend_downloadable], {type: "text/svg;charset=utf-8"}), 'legend.svg'); // save the svg on disk
  }

  render() {
    const display = this.props.display;
    return(
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Net2Vis
          </Typography>
          <div className='wrapper'>
            <div className='menu'>
              <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
              <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
            </div>
            <div className='menu'>
              <IconButton color='inherit' aria-label='Download' onClick={this.downloadSVG}>
                <GetApp/>
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

// Controls state of the Application
Controls.propTypes = {
  display: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  legend_transform: PropTypes.object.isRequired,
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    display: state.display,
    group_transform: state.group_transform,
    legend_transform: state.legend_transform,
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
