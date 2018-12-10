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
  var dimTxts = [];
  for (var i = 0; i < dimensions.length - 1; i++) {
    dimTxts.push(dimensions[i]);
  }
  var same = true;
  for (var k = 0; k < dimTxts.length - 1; k++) {
    if (dimTxts[j] !== dimTxts[j + 1]) {
      same = false;
    }
  }
  if (same) {
    dimTxts.length = 1;
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
