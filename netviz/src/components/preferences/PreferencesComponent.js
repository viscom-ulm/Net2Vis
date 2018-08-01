import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';

class Preferences extends React.Component {
  handleMinChange = (e) => {
    this.props.actions.changeLayersMinHeight(e.currentTarget.value);
  }

  handleMaxChange = (e) => {
    this.props.actions.changeLayersMaxHeight(e.currentTarget.value);
  }

  render() {
    if(this.props.preferences_toggle) {
      return(
        <div id='Preferences'>
          <input type="number" step="10" value={this.props.layers_settings.layer_display_height.min_size} onChange={this.handleMinChange}/>
          <input type="number" step="10" value={this.props.layers_settings.layer_display_height.max_size} onChange={this.handleMaxChange}/>
        </div>
      );
    } else {
      return null;
    }
  }
}

Preferences.propTypes = {
  preferences_toggle: PropTypes.bool.isRequired,
  layers_settings: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    preferences_toggle: state.display.preferences_toggle,
    layers_settings: state.layers_settings
  };
}

// Map the actions of the State to the Props of this Class 
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Preferences);
