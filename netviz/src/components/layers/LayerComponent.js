import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions';

class Layer extends React.Component {  
  componentWillMount() {
    if(!this.props.settings) {
      var setting = {};
      setting.color = 'blue';
      this.props.actions.addSettingForLayer(setting, this.props.layer.name);
    }
  }
  
  render() {
    var set = {
      color: 'white'
    }
  
    if(this.props.settings) {
      set = this.props.settings;
    }
  
    return (
      <g transform={`translate(${100 + (20 * this.props.layer.id)}, 100)`}>
        <rect width="150" height="150" x="0" y="0" rx ="10" ry ="10" style={{fill:set.color, stroke: 'black'}} transform="skewY(-10)"/>
        <text x="75" y="25" textAnchor="middle" alignmentBaseline="middle" transform="skewY(-10)">{this.props.layer.name[0]}</text>
      </g>
    );
  }
};

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(undefined, mapDispatchToProps)(Layer);
