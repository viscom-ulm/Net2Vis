import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
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

    var dimensions = this.props.layer.properties.dimensions;
    var extreme_dimensions = this.props.layers_settings.layer_display_size;
    var width = extreme_dimensions.max_size;
    var height = extreme_dimensions.max_size;
    if(Array.isArray(dimensions)) {
      var extreme_layer = this.props.layers_settings.layer_extreme_dimensions;
      var lay_diff = extreme_layer.max_size - extreme_layer.min_size;
      var dim_diff = extreme_dimensions.max_size - extreme_dimensions.min_size;
      var width_perc = (dimensions[0] - extreme_layer.min_size) / lay_diff;
      var height_perc = (dimensions[1] - extreme_layer.min_size) / lay_diff;
      width = width_perc * dim_diff + extreme_dimensions.min_size;
      height = height_perc * dim_diff + extreme_dimensions.min_size;
    }
    var y_diff = (extreme_dimensions.max_size - height) / 2;
    console.log(y_diff)
    //<text x="75" y="25" textAnchor="middle" alignmentBaseline="middle" transform="skewY(-10)">{this.props.layer.name[0]}</text>
    return (
      <g transform={`translate(${100 + (20 * this.props.layer.id)}, 100)`}>
        <rect width={width} height={height} x="0" y={y_diff} rx ="10" ry ="10" style={{fill:set.color, stroke: 'black'}} transform="skewY(-10)"/>
      </g>
    );
  }
};

Layer.propTypes = {
  layers_settings: PropTypes.object.isRequired
}

function mapStateToProps(state, ownProps) {
  return {
    layers_settings: state.layers_settings
  };
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layer);
