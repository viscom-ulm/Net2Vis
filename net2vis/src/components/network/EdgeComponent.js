import React from "react";
import PropTypes from "prop-types";

const EdgeComponent = ({
  edge,
  layer_max_height,
  horizontal_spacing,
  color,
}) => {
  var points = JSON.parse(JSON.stringify(edge.points));
  var path = "";
  var y_pos = points[0].y; // Initialize the y_pos point Placeholder
  for (var j = 1; j < points.length; j++) {
    // For all other Points
    if (y_pos === points[j].y) {
      // The y_pos point had the same y value
      j = points.length; // Break the Loop
    } else {
      // Not the same y value
      y_pos = points[j].y; // Update the y_pos point Placeholder
    }
  }
  if (points[0].y !== y_pos) {
    // Check if the beggining of the path has a slope
    for (var i = 0; i < points.length; i++) {
      // Iterate over all points
      if (points[i].y === y_pos) {
        // The first point of the straight line part has been found
        points[i].x = points[i].x - horizontal_spacing.value / 2; // Change the x-value of this point to compensate the spacing
        i = points[i].length; // Exit the loop
      }
    }
  }
  if (points[points.length - 1].y !== y_pos) {
    // Check if the end of the path has a slope
    for (i = points.length - 1; i > 0; i--) {
      // Iterate over all points in reversed order
      if (points[i].y === y_pos) {
        // The last point of the straight line part has been found
        points[i].x = points[i].x + horizontal_spacing.value / 2; // Change the x-value of this point to compensate the spacing
        i = 0; // Exit the loop
      }
    }
  }
  for (i in points) {
    // Go over all Points
    if (points[i].y === y_pos) {
      // Check if on same y as y_pos
      path =
        path + points[i].x + "," + (points[i].y + layer_max_height / 2) + " "; // Add the Point to the Path
    }
  }
  return <polyline points={path} style={{ fill: "none", stroke: color }} />;
};

// Proptypes of ToggleBurttons
EdgeComponent.propTypes = {
  edge: PropTypes.object.isRequired,
  layer_max_height: PropTypes.number.isRequired,
};

export default EdgeComponent;
