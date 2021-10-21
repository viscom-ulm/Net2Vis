import React from "react";
import PropTypes from "prop-types";

const DimensionsLabelComponent = ({
  dimensions,
  x,
  edge,
  layer_max_height,
  channels_first,
}) => {
  var y_pos = edge.points[0].y; // Initialize the y_pos point Placeholder
  for (var j = 1; j < edge.points.length; j++) {
    // For all other Points
    if (y_pos === edge.points[j].y) {
      // The y_pos point had the same y value
      j = edge.points.length; // Break the Loop
    } else {
      // Not the same y value
      y_pos = edge.points[j].y; // Update the y_pos point Placeholder
    }
  }
  const initialIndex = channels_first ? 1 : 0;
  const lastIndex = channels_first ? dimensions.length : dimensions.length - 1;
  var dimTxt = dimensions[initialIndex]; // Initialize the dimensions Texts
  for (var i = initialIndex + 1; i < lastIndex; i++) {
    // For all dimensions except the last
    dimTxt = dimTxt + "x" + dimensions[i]; // Add it to the texts
  }
  const transform = `translate(${x}, ${5 + y_pos + layer_max_height / 2.0})`; // Manipulate the position of the graph
  return (
    <g transform={transform}>
      <text textAnchor="start" y="3" transform={`rotate(90)`} fontSize="12">
        {dimTxt}
      </text>
    </g>
  );
};

// Proptypes of ToggleBurttons
DimensionsLabelComponent.propTypes = {
  dimensions: PropTypes.array.isRequired,
  x: PropTypes.number.isRequired,
  edge: PropTypes.object.isRequired,
  layer_max_height: PropTypes.number.isRequired,
  channels_first: PropTypes.bool.isRequired,
};

export default DimensionsLabelComponent;
