import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';
import * as legend from '../../legend';

// <div className='legendItem' style={style} onClick={() => action(layer_name)}>{layer_name}</div>
// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
class LegendItem extends React.Component {
  render() {
    const style = {
      fill: this.props.layer_color,
      stroke: 'black',
      stokeLinejoin: 'round'
    };  
    const x_Pos = 10 + legend.calculateXPosition(this.props.layer_name, this.props.layer_types_settings);
    return (
      <rect x={x_Pos} y='10' width='20' height='80' style={style} onClick={() => this.props.action(this.props.layer_name)}/>
    ) 
  }
}

// PropTypes of this Class
LegendItem.propTypes = {
  layer_types_settings: PropTypes.object.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    layer_types_settings: state.layer_types_settings
  };
}

// Map the Actions for the State to the Props of this Class
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(LegendItem);
