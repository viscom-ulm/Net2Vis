import * as dagre from 'dagre';
import * as common from '../groups/Common'

// Get a representation for the legend to be drawn
export function getLegend(layerTypesSettings, groups, legendPreferences) {
  var position = 10;
  var legend = [];
  var keys = Object.keys(layerTypesSettings).reverse()
  for (var i in keys) {
    var layer = getLayer(groups, keys[i], layerTypesSettings, legendPreferences);
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
        active: groups[i].active,
        width: graph.graph().width + legendPreferences.complex_spacing.value + legendPreferences.layer_width.value,
        height: graph.graph().height,
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
    active: true,
    width: legendPreferences.layer_width.value,
    height: legendPreferences.layer_height.value,
    representer: {
      name: layerName,
      setting: layerTypesSettings[layerName]
    }
  }
}

function getLegendItemGraph(group, legendPreferences) {
  var graph = new dagre.graphlib.Graph();
  graph.setGraph({ranker: 'longest-path', rankdir: 'LR', ranksep: (legendPreferences.layers_spacing_horizontal.value + legendPreferences.stroke_width.value), nodesep: legendPreferences.layers_spacing_vertical.value, edgesep: (legendPreferences.layer_height.value + legendPreferences.layers_spacing_vertical.value)}); // Set Graph Properties
  graph.setDefaultEdgeLabel(function() { return {}; }); // Default Egde Label needs to be set
  for (var i in group.layers) {
    const layer = group.layers[i];
    graph.setNode(i, {id: parseInt(i, 10), width: legendPreferences.layer_width.value, height: legendPreferences.layer_height.value, layer: layer});
  }
  for (var j in group.layers) { // Add all Edges to the Graph
    var layer_current = group.layers[j]; // Get the current Layer
    for (var k in layer_current.properties.output) { // Go over all outputs of the current Layer
      graph.setEdge(j, common.getLayerByID(layer_current.properties.output[k], group.layers)); // Add the Edge to the Graph
    }
  }
  dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
  return graph;
}

// Get the Input Node to a Graph
export function getInputNode(nodes) {
  for (var j in nodes) { // Iterate over all layers in the Group
    if(nodes[j].layer.properties.input.length === 0) { // Layer has no inputs contained in the Group
      return j;
    }
  }
}