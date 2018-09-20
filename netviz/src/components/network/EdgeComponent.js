import React from 'react';
import PropTypes from 'prop-types';

const EdgeComponent = ({edge, layer_max_height, layer_width}) => {
  var points = edge.points;
  var path = "";
  for(var i in points) {
    path = path + (points[i].x+(layer_width/2)) + "," + (points[i].y+(layer_max_height/2)) + " ";
  }
  return (
    <polyline points={path} style={{fill:"none", stroke:"black"}}/>
  );
};


// Proptypes of ToggleBurttons
EdgeComponent.propTypes = {
  edge: PropTypes.object.isRequired,
  layer_max_height: PropTypes.number.isRequired,
  layer_width: PropTypes.number.isRequired
};

export default EdgeComponent;
