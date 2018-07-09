import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import ToggleButton from './ToggleButton'
import * as actions from '../../actions'

// Controls at top of the Application
class Controls extends React.Component {
  // Render the Controls
  render() {
    const display = this.props.display;
    return(
      <ul>
        <ToggleButton name="Code" state={display.code_toggle} action={this.props.actions.toggleCode}/>
        <ToggleButton name="Preferences" state={display.preferences_toggle} action={this.props.actions.togglePreferences}/>
        <ToggleButton name="Legend" state={display.legend_toggle} action={this.props.actions.toggleLegend}/>
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
