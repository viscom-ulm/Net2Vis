import React from 'react';
import PropTypes from 'prop-types';

const EdgeComponent = ({edge, layer_max_height, layer_width}) => {
  var points = edge.points;
  var path = "";
  var y_pos = points[0].y; // Initialize the y_pos point Placeholder
  for (var j = 1; j < points.length; j++) { // For all other Points
    if (y_pos === points[j].y) { // The y_pos point had the same y value
      j = points.length; // Break the Loop
    } else { // Not the same y value
      y_pos = points[j].y; // Update the y_pos point Placeholder
    }
  }
  for(var i in points) { // Go over all Points
    if (points[i].y === y_pos) { // Check if on same y as y_pos
      path = path + (points[i].x+(layer_width/2)) + "," + (points[i].y+(layer_max_height/2)) + " "; // Add the Point to the Pathn
    }
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
