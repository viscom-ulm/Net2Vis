import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import ToggleButton from './ToggleButton';
import ClickableButton from './ClickableButton';
import * as actions from '../../actions';

// Controls at top of the Application
class Controls extends React.Component {
  downloadSVG = () => {
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
