import React from 'react';
import PropTypes from 'prop-types';

// <div className='legendItem' style={style} onClick={() => action(layer_name)}>{layer_name}</div>
// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const LegendItem = ({layer_name, layer_color, action}) => {
  const style = {
    fill: layer_color,
    stroke: 'black',
    stokeLinejoin: 'round'
  };  
  return (
    <rect x='10' y='10' width='20' height='80' style={style} onClick={() => action(layer_name)}/>
  );
};

// Proptypes of ToggleBurttons
LegendItem.propTypes = {
  layer_name: PropTypes.string.isRequired,
  layer_color: PropTypes.string.isRequired,
};

export default LegendItem;
