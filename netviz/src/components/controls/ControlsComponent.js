import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import ToggleButton from './ToggleButton';
import ClickableButton from './ClickableButton';
import * as actions from '../../actions';

// Controls at top of the Application
class Controls extends React.Component {
  downloadSVG = () => {
    var svg_text = document.getElementById('main_group').innerHTML;
    svg_text = "<svg version='1.1' baseProfile='full' xmlns='http://www.w3.org/2000/svg' width='2000' height='2000'>" + svg_text + "</svg>"
    var filename = 'model.svg'
    var blob = new Blob([svg_text], {type: "text/svg;charset=utf-8"});
    saveAs(blob, filename);
    console.log('Download should happen.')    
  }

  // Render the Controls
  render() {
    const display = this.props.display;
    return(
      <ul>
        <li className='header noselect'>NetViz</li>
        <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
        <ToggleButton name="Legend" state={display.legend_toggle} action={this.props.actions.toggleLegend}/>
        <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
        <ClickableButton name="Download" action={this.downloadSVG}/>
      </ul>
    );
  }
}

// Controls state of the Application
Controls.propTypes = {
  display: PropTypes.object.isRequired
};

// Mapping the Controls state to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    display: state.display
  };
}

// Map the Actions called when Controls are used to the Props of this Class  
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
