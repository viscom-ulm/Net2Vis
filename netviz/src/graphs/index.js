import * as dagre from 'dagre';

// Build the network graph upon the Network representation
export function buildGraphFromNetwork(network, layer_extreme_dimensions, preferences) {
  var graph = new dagre.graphlib.Graph(); // Initialize the dagre Graph
  graph.setGraph({ranker: 'longest-path', rankdir: 'LR', ranksep: preferences.layers_spacing_horizontal.value, nodesep: (layer_extreme_dimensions.max_size/2) + preferences.layers_spacing_vertical.value}); // Set Graph Properties
  graph.setDefaultEdgeLabel(function() { return {}; }); // Default Egde Label needs to be set
  for (var i in network.layers) { // Add all Layers to the Graph
    const layer = network.layers[i]; // Get the current Layer
    const max_layer_dim = Math.max(layer.properties.dimensions.in[0], layer.properties.dimensions.out[0]) // Get the maximum dimension of the layer (in vs out)
    const lay_diff =  layer_extreme_dimensions.max_size - layer_extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Layer
    const dim_diff = preferences.layer_display_max_height.value - preferences.layer_display_min_height.value; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
    const perc = (max_layer_dim - layer_extreme_dimensions.min_size) / lay_diff; // Calculate the interpolation factor for boths sides of the Glyph 
    const height = perc * dim_diff + preferences.layer_display_min_height.value; // Calculate the height for both sides of the Glyph 
    graph.setNode(layer.id, {width: preferences.layer_display_width.value, height: height, layer: layer}); // Add a Node to the Graph
  }
  for (var j in network.layers) { // Add all Edges to the Graph
    var layer_current = network.layers[j]; // Get the current Layer
    for (var k in layer_current.properties.output) { // Go over all outputs of the current Layer
      graph.setEdge(layer_current.id, layer_current.properties.output[k]); // Add the Edge to the Graph
    }
  }
  dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
  return graph;
}

// Gouping a selection of layers
export function groupLayers(network, selection) { 
  console.log(checkGroupable(network, selection));
}

// Check if the current selection is groupable
function checkGroupable(network, selection) { 
  if (selection.length < 2) { // Needs to contain more than one element
    return false;
  }
  for (var i in selection) { // Check groupability of each of the selected layers
    var layer = network.layers[selection[i]]; // Get the current layer
    var inputs = layer.properties.input; // Get the inputs of the current layer
    var outputs = layer.properties.output; // Get the outputs of the current layer
    var inContained = contained(inputs, selection); // Check how many of the inputs of the current layer are also selected.
    var outContained = contained(outputs, selection); // Check how many of the outputs of the current layer are also selected. 
    if ((inputs.length !== inContained) && inContained > 0) { // Some, but not all inputs selected
      return false; // Not groupable
    } else if ((outputs.length !== outContained) && outContained > 0) { // Some, but not all outputs selected
      return false; // Not groupable
    } else if (outContained === 0 && inContained === 0) { // No in- or outputs at all selected
      return false; // Not Groupable
    }
  }
  return true; // More than one element selected, and all elements connected. Also no parallel path partly selected. Groupable!
}

// Check, how many of the given layers are contained in the selection
function contained(layers, selection) { 
  var contained = 0;
  for (var j in layers) { // Iterate over all layers
    if (selection.includes(layers[j])) { // If the selection includes the layer
      contained = contained + 1; // Increment the number of contained elements
    }
  }
  return contained;
}
