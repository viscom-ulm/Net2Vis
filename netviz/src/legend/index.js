import * as dagre from 'dagre';

// Get a representation for the legend to be drawn
export function getLegend(layerTypesSettings, groups, legendPreferences) {
  var position = 10;
  var legend = [];
  for (var i in layerTypesSettings) {
    var layer = getLayer(groups, i, layerTypesSettings, legendPreferences);
    legend.push({position: position, layer: layer});
    position = position + layer.width + legendPreferences.element_spacing.value;
  }
  return legend;
}

// Get the Subnetwork for a specific Layer
function getLayer(groups, layerName, layerTypesSettings, legendPreferences) {
  for (var i in groups) {
    if (groups[i].name === layerName) {
      const graph = getLegendItemGraph(groups[i], legendPreferences);
      return {
        trivial: false,
        width: graph.graph().width + 50,
        representer: {
          name: layerName,
          setting: layerTypesSettings[layerName]
        },
        graph: graph
      }
    }
  }
  return {
    trivial: true,
    width: legendPreferences.layer_width.value,
    representer: {
      name: layerName,
      setting: layerTypesSettings[layerName]
    }
  }
}

function getLegendItemGraph(group, legendPreferences) {
  var graph = new dagre.graphlib.Graph();
  graph.setGraph({ranker: 'longest-path', rankdir: 'LR', ranksep: legendPreferences.layer_spacing.value, nodesep: 10}); // Set Graph Properties
  graph.setDefaultEdgeLabel(function() { return {}; }); // Default Egde Label needs to be set
  for (var i in group.layers) {
    const layer = group.layers[i];
    graph.setNode(i, {id: parseInt(i, 10), width: legendPreferences.layer_width.value, height: legendPreferences.layer_height.value, layer: layer});
  }
  for (var j in group.layers) { // Add all Edges to the Graph
    var layer_current = group.layers[j]; // Get the current Layer
    for (var k in layer_current.output) { // Go over all outputs of the current Layer
      graph.setEdge(j, layer_current.output[k]); // Add the Edge to the Graph
    }
  }
  dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
  return graph;
}
