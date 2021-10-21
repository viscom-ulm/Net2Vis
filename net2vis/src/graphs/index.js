import * as dagre from 'dagre';

// Build the network graph upon the Network representation
export function buildGraphFromNetwork(
  network,
  layer_extreme_dimensions,
  preferences
) {
  var graph = new dagre.graphlib.Graph(); // Initialize the dagre Graph
  graph.setGraph({
    ranker: 'network-simplex',
    rankdir: 'LR',
    ranksep:
      preferences.layers_spacing_horizontal.value +
      preferences.stroke_width.value,
    nodesep: preferences.layers_spacing_vertical.value,
  }); // Set Graph Properties
  graph.setDefaultEdgeLabel(function () {
    return {};
  }); // Default Egde Label needs to be set
  for (var i in network.layers) {
    // Add all Layers to the Graph
    const layer = network.layers[i]; // Get the current Layer
    if (
      layer.properties.dimensions.in.length > 1 &&
      layer.properties.dimensions.out.length > 1
    ) {
      const channel_dim = preferences.channels_first.value
        ? 0
        : layer.properties.dimensions.out.length - 1;
      const spatial_dim = preferences.channels_first.value ? 1 : 0;
      const max_layer_dim = Math.max(
        layer.properties.dimensions.in[spatial_dim],
        layer.properties.dimensions.out[spatial_dim]
      ); // Get the maximum dimension of the layer (in vs out)
      var lay_diff =
        layer_extreme_dimensions.max_size - layer_extreme_dimensions.min_size; // Get the difference between Max and Min for the Extremes of the Layer
      lay_diff = lay_diff === 0 ? 1 : lay_diff; // Check if there is any difference in spatial resolution at all
      const dim_diff =
        preferences.layer_display_max_height.value -
        preferences.layer_display_min_height.value; // Get the difference between Max and Min for the Extremes of the Glyph Dimensions
      const perc =
        (max_layer_dim - layer_extreme_dimensions.min_size) / lay_diff; // Calculate the interpolation factor for boths sides of the Glyph
      var height = perc * dim_diff + preferences.layer_display_min_height.value; // Calculate the height for both sides of the Glyph
      height =
        height > preferences.layer_display_max_height.value
          ? preferences.layer_display_max_height.value
          : height; // Cap the height when something goes wrong
      var feat_diff =
        layer_extreme_dimensions.max_features -
        layer_extreme_dimensions.min_features; // Get the difference between max and min features of the Layers
      feat_diff = feat_diff === 0 ? 1 : feat_diff; // Check if there is any difference in features at all
      const fdim_diff =
        preferences.layer_display_max_width.value -
        preferences.layer_display_min_width.value; // Get the differnece between Max and Min width for the Glyph Dimensions
      const f_perc = (layer.properties.dimensions.out[channel_dim] - layer_extreme_dimensions.min_features) / feat_diff; // Calculate the interpolation factor
      const width =
        f_perc * fdim_diff + preferences.layer_display_min_width.value; // Calculate the width of the glyph
      graph.setNode(layer.id, { width: width, height: height, layer: layer }); // Add a Node to the Graph
    } else {
      graph.setNode(layer.id, {
        width: preferences.layer_display_min_width.value,
        height: preferences.layer_display_max_height.value,
        layer: layer,
      }); // Add a Node to the Graph
    }
  }
  for (var j in network.layers) {
    // Add all Edges to the Graph
    var layer_current = network.layers[j]; // Get the current Layer
    for (var k in layer_current.properties.output) {
      // Go over all outputs of the current Layer
      graph.setEdge(layer_current.id, layer_current.properties.output[k]); // Add the Edge to the Graph
    }
  }
  dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
  return graph;
}
