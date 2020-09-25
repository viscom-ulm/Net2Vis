// Calculate the SVG Path for a Glyph
export function calculateGlyphPath(
  extreme_dimensions,
  layer_height,
  layer,
  edges
) {
  const y_diff = [
    (extreme_dimensions.max_size - layer_height[0]) / 2,
    (extreme_dimensions.max_size - layer_height[1]) / 2,
  ]; // Calculate the vertical difference to center the Glyph
  const y_pos = [
    y_diff[0],
    y_diff[1],
    y_diff[1] + layer_height[1],
    y_diff[0] + layer_height[0],
  ]; // Vertical Position of top-left, top-right, bottom-right and bottom-left Points
  if (layer.layer.properties.input.length > 1) {
    // Multiple Inputs
    return calculateMultiInputPath(y_pos, layer, edges); // Caculate a Path with multiple Inputs
  } else if (layer.layer.properties.output.length > 1) {
    // Multiple Outputs
    return calculateMultiOutputPath(y_pos, layer, edges); // Calculate a Path with Multiple Outputs
  } else {
    // Trivial case
    return calculateTrivialPath(y_pos, layer.width); // Calculate a Path for the trivial Glyph
  }
}

// Trivial Layer
function calculateTrivialPath(y_pos, layer_width) {
  var pathData = "M 0 " + y_pos[0]; // Move to initial Location
  pathData = addRightEnd(pathData, y_pos[1], y_pos[2], layer_width); // Add right end of Glyph
  pathData = addLeftEnd(pathData, y_pos[0], y_pos[3]); // Add left end of Glyph
  pathData = addCloseTag(pathData);
  return pathData;
}

// Multi Input Layer
function calculateMultiInputPath(y_pos, layer, edges) {
  const position_reduced = reducePosition(getIncomingEdges(layer, edges));
  position_reduced.sort((a, b) => b - a); // Sort them by y value descending
  var pathData = "M " + layer.width + " " + y_pos[2]; // Move to initial location (bottom right)
  for (var i in position_reduced) {
    // For each Input
    const y_off = position_reduced[i] - layer.y; // Calculate the Offset of the current Input Layer to this Layer
    pathData = addLeftEnd(pathData, y_pos[0] + y_off, y_pos[3] + y_off); // Add a left End for this Input
    if (i < position_reduced.length - 1) {
      // More Iputs to follow
      const y_off2 = position_reduced[parseInt(i, 10) + 1] - layer.y; // Calculate the Offset of the next Input Layer to this Layer
      pathData = addIntersection(
        pathData,
        0,
        y_pos[0] + y_off,
        layer.width,
        y_pos[1],
        0,
        y_pos[3] + y_off2,
        layer.width,
        y_pos[2]
      ); // Add an Intersection Point for both Layers
    }
  }
  pathData = addRightEnd(pathData, y_pos[1], y_pos[2], layer.width); // Add a right End to the Layer
  pathData = addCloseTag(pathData);
  return pathData;
}

// Multi Output Layer
function calculateMultiOutputPath(y_pos, layer, edges) {
  const position_reduced = reducePosition(getOutgoingEdges(layer, edges)); // Get the y positions of the straight parts of alloutgoing edges
  position_reduced.sort((a, b) => a - b); // Sort them by the y value ascending
  var pathData = "M 0 " + y_pos[0]; // Move to initial Location (top left)
  for (var i in position_reduced) {
    // For each outgoing Edge
    const y_off = position_reduced[i] - layer.y; // Calculate the Offset of the current Output Layer to this Edge
    pathData = addRightEnd(
      pathData,
      y_pos[1] + y_off,
      y_pos[2] + y_off,
      layer.width
    ); // Add a right End for this Output
    if (i < position_reduced.length - 1) {
      // More Outputs to follow
      const y_off2 = position_reduced[parseInt(i, 10) + 1] - layer.y; // Calculate the Offset of the next Output Layer to this Layer
      pathData = addIntersection(
        pathData,
        layer.width,
        y_pos[2] + y_off,
        0,
        y_pos[3],
        0,
        y_pos[0],
        layer.width,
        y_pos[1] + y_off2
      ); // Add an Intersection Point for both Layers
    }
  }
  pathData = addLeftEnd(pathData, y_pos[0], y_pos[3]); // Add left end of Glyph
  pathData = addCloseTag(pathData);
  return pathData;
}

// Add a left End to the Path
function addLeftEnd(pathData, y0, y1) {
  pathData = pathData + " L 0 " + y1 + " V " + y0; // Draw to the bottom left Point and then up
  return pathData;
}

// Add a right End to the Path
function addRightEnd(pathData, y0, y1, width) {
  pathData = pathData + " L " + width + " " + y0 + " V " + y1; // Draw to the top right Point and then up
  return pathData;
}

// Add an Intersection Point to the Path
function addIntersection(pathData, x00, y00, x01, y01, x10, y10, x11, y11) {
  var numerator = (x11 - x10) * (y00 - y10) - (y11 - y10) * (x00 - x10);
  var denominator = (y11 - y10) * (x01 - x00) - (x11 - x10) * (y01 - y00);
  var a = numerator / denominator; // Calculate the fraction of Line 1 to go along until the intersection Point
  var ix = x00 + a * (x01 - x00); // Interpolate the x-Value using a
  var iy = y00 + a * (y01 - y00); // Interpolate the y-Value using a
  pathData = pathData + " L " + ix + " " + iy; // Draw to the Intersection Point
  return pathData;
}

// Add closing Tag for SVG Path
function addCloseTag(pathData) {
  pathData = pathData + " z";
  return pathData;
}

// Get all outgoing Edges for the current Node
export function getOutgoingEdges(layer, edges) {
  var current = [];
  for (var i in edges) {
    // Go over all Edges
    if (layer.layer.id === parseInt(edges[i].v, 10)) {
      // Check if current node is source of edge
      current.push(edges[i]); // Add the edge
    }
  }
  return current;
}

// Get all incoming Edges for the current Node
export function getIncomingEdges(layer, edges) {
  var current = [];
  for (var i in edges) {
    // Go over all Edges
    if (layer.layer.id === parseInt(edges[i].w, 10)) {
      // Check if current node is sink of edge
      current.push(edges[i]); // Add the edge
    }
  }
  return current;
}

// Reduces the position elements of an Edge to just one, that represents the part with no inclination
export function reducePosition(edges) {
  var positions = [];
  for (var i in edges) {
    // For all Edges
    var prev = edges[i].points.points[0].y; // Initialize the previous point Placeholder
    for (var j = 1; j < edges[i].points.points.length; j++) {
      // For all other Points
      if (prev === edges[i].points.points[j].y) {
        // The previous point had the same y value
        j = edges[i].points.points.length; // Break the Loop
      } else {
        // Not the same y value
        prev = edges[i].points.points[j].y; // Update the Previous point Placeholder
      }
    }
    positions.push(prev); // Add the value to the positions of the edge
  }
  return positions;
}

// Calculate the extremes of one Layer
export function calculateLayerExtremes(
  layer_height,
  layer,
  edges,
  extreme_dimensions
) {
  var extremes = {
    min_x: layer.x,
    max_x: layer.x + layer.width,
    min_y: 0,
    max_y: 0,
  };
  const y_diff = [
    (extreme_dimensions.max_size - layer_height[0]) / 2,
    (extreme_dimensions.max_size - layer_height[1]) / 2,
  ]; // Calculate the vertical difference to center the Glyph
  const y_pos = [
    y_diff[0],
    y_diff[1],
    y_diff[1] + layer_height[1],
    y_diff[0] + layer_height[0],
  ]; // Vertical Position of top-left, top-right, bottom-right and bottom-left Points
  if (layer.layer.properties.input.length > 1) {
    const position_in_reduced = reducePosition(getIncomingEdges(layer, edges)); // Get the y positions of the straight parts of alloutgoing edges
    position_in_reduced.sort((a, b) => a - b); // Sort them by the y value ascending
    const y_off_max = position_in_reduced[position_in_reduced.length - 1]; // Calculate the Offset of the current Output Layer to this Edge
    const y_off_min = position_in_reduced[0]; // Calculate the Offset of the current Output Layer to this Edge
    extremes.min_y = y_pos[0] + y_off_min;
    extremes.max_y = y_pos[3] + y_off_max;
  } else {
    extremes.min_y = y_pos[0];
    extremes.max_y = y_pos[3];
  }
  var min_y = 0;
  var max_y = 0;
  if (layer.layer.properties.output.length > 1) {
    const position_out_reduced = reducePosition(getOutgoingEdges(layer, edges)); // Get the y positions of the straight parts of alloutgoing edges
    position_out_reduced.sort((a, b) => a - b); // Sort them by the y value ascending
    const y_off_max = position_out_reduced[position_out_reduced.length - 1]; // Calculate the Offset of the current Output Layer to this Edge
    const y_off_min = position_out_reduced[0]; // Calculate the Offset of the current Output Layer to this Edge
    min_y = y_pos[0] + y_off_min;
    max_y = y_pos[3] + y_off_max;
    extremes.min_y = extremes.min_y < min_y ? extremes.min_y : min_y;
    extremes.max_y = extremes.max_y > max_y ? extremes.max_y : max_y;
  } else {
    min_y = y_pos[1];
    max_y = y_pos[2];
    extremes.min_y = extremes.min_y < min_y ? extremes.min_y : min_y;
    extremes.max_y = extremes.max_y > max_y ? extremes.max_y : max_y;
  }
  return extremes;
}
