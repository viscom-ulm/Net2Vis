import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';

import ToggleButton from './ToggleButton'
import * as actions from '../../actions'

class Controls extends React.Component {
  
  render() {
    const display = this.props.display;
    return(
      <ul>
        <ToggleButton name="Code" state={display.code} action={this.props.actions.toggleCode}/>
        <ToggleButton name="Preferences" state={display.preferences} action={this.props.actions.togglePreferences}/>
        <ToggleButton name="Legend" state={display.legend} action={this.props.actions.toggleLegend}/>
      </ul>
    );
  }
}

Controls.propTypes = {
  display: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    display: state.display
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Controls);
