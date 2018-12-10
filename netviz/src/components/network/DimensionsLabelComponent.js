import React from 'react';
import PropTypes from 'prop-types';

const DimensionsLabelComponent = ({dimensions, x, edge, layer_max_height}) => {
  var y_pos = edge.points[0].y; // Initialize the y_pos point Placeholder
  for (var j = 1; j < edge.points.length; j++) { // For all other Points
    if (y_pos === edge.points[j].y) { // The y_pos point had the same y value
      j = edge.points.length; // Break the Loop
    } else { // Not the same y value
      y_pos = edge.points[j].y; // Update the y_pos point Placeholder
    }
  }
  var dimTxts = []; // Initialize the dimensions Texts
  for (var i = 0; i < dimensions.length - 1; i++) { // For all dimensions except the last
    dimTxts.push(dimensions[i]); // Add it to the texts
  }
  var same = true; // Sameness placeholder for the dimensions
  for (var k = 0; k < dimTxts.length - 1; k++) { // For all dimensions
    if (dimTxts[k] !== dimTxts[k + 1]) { // If they differ
      same = false; // Not same
    }
  }
  if (same) { // If all dimensions are the same
    dimTxts.length = 1; // Reduce the texts to just one text
  }
  return (
    <g>
      {dimTxts.map((dimTxt, index) =>
        <text textAnchor='middle' dominantBaseline='hanging' x={x} y={y_pos+(layer_max_height/2)+(index*16)} key={index}>{dimTxt}</text>
      )}
    </g>
  );
};

// Proptypes of ToggleBurttons
DimensionsLabelComponent.propTypes = {
  dimensions: PropTypes.array.isRequired,
  x: PropTypes.number.isRequired,
  edge: PropTypes.object.isRequired,
  layer_max_height: PropTypes.number.isRequired
};

export default DimensionsLabelComponent;
