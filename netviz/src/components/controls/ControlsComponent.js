import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import {saveAs} from 'file-saver';
import * as JSZip from 'jszip';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import GetApp from '@material-ui/icons/GetApp';

import ToggleButton from './ToggleButton';
import * as actions from '../../actions';
import DownloadApi from '../../api/DownloadApi';

// Controls at top of the Application
class Controls extends React.Component {
  // Triggers download functionality of the network graph
  downloadSVG = () => {
    const general_transform =  `translate(5, 5)`;
    var graph_element = document.getElementById('main_group'); // Get the main SVG Element
    var graph_bBox = graph_element.getBBox();
    var graph_width = graph_bBox.width * this.props.group_transform.scale; // Calculate the width of this Element
    var graph_height = graph_bBox.height * this.props.group_transform.scale; // Calculate the height of this Element
    var graph_text = graph_element.innerHTML; // Get the inner elements of the svg
    const graph_transform = `scale(${this.props.group_transform.scale}) translate(${-graph_bBox.x}, ${-graph_bBox.y})`; // Set the transform for the graph to match the scaling and be centred
    var graph_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (graph_width + 10) + "' height='" + (graph_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + graph_transform + "'>" + graph_text + "</g></g></svg>"; // Wrap together the svg code for the Graph

    var legend_element = document.getElementById('legend_group'); // Get the legend SVG Element
    var bBox = legend_element.getBBox();
    var legend_width = (bBox.width*1.0) * this.props.legend_transform.scale; // Calculate the width of this Element
    var legend_height = (bBox.height*1.0) * this.props.legend_transform.scale; // Calculate the height of this Element
    var legend_text = legend_element.innerHTML; // Get the inner elements of the svg
    const legend_transform = `scale(${this.props.legend_transform.scale}) translate(${-bBox.x}, ${-bBox.y})`; // Set the transform for the legend to match the scaling and be centred
    var legend_downloadable = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='" + (legend_width + 10) + "' height='" + (legend_height + 10) + "'><g transform='" + general_transform + "'><g transform='" + legend_transform + "'>" + legend_text + "</g></g></svg>"; // Wrap together the svg code for the Legend

    //var zip = new JSZip(); // Create a Zip file
    //zip.file('model.svg', graph_downloadable); // Add the Model
    //zip.file('legend.svg', legend_downloadable); // Add the Legend
    //zip.generateAsync({type:"blob"}).then(function(content) { // Zip the file
      //saveAs(content, "net2vis.zip"); // Download it
    //});
    DownloadApi.sendVisualization(this.props.id, graph_downloadable, legend_downloadable);
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
            <div>
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
  id: PropTypes.string.isRequired,
  display: PropTypes.object.isRequired,
  group_transform: PropTypes.object.isRequired,
  legend_transform: PropTypes.object.isRequired,
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    id: state.id,
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
