import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import LegendItem from './LegendItem';

class Legend extends React.Component {
  render() {
    if(this.props.legend_toggle) {
      const layer_types_settings = this.props.layer_types_settings;
      var settings = [];
      for (var key in layer_types_settings) {
        settings.push({name: key, color: layer_types_settings[key].color});
      }
      return(
        <div id='Legend'>
          <div className='flexhorizontal flexlegend'>
          {settings.map(setting => 
            <LegendItem layer_name={setting.name} layer_color={setting.color} key={setting.name}/>
          )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

Legend.propTypes = {
  legend_toggle: PropTypes.bool.isRequired,
  layer_types_settings: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  return {
    legend_toggle: state.display.legend_toggle,
    layer_types_settings: state.layer_types_settings
  };
}

export default connect(mapStateToProps, undefined)(Legend);
