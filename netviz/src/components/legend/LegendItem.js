import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const LegendItem = ({layer_name, layer_color, action}) => {
  const style = {
    backgroundColor: layer_color
  };  
  return (
    <div className='legendItem' style={style} onClick={() => action(layer_name)}>{layer_name}</div>
  );
};

// Proptypes of ToggleBurttons
LegendItem.propTypes = {
  layer_name: PropTypes.string.isRequired,
  layer_color: PropTypes.string.isRequired,
};

export default LegendItem;
