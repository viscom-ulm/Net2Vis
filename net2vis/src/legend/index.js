import * as dagre from "dagre";
import * as common from "../layers/Common";

// Get a representation for the legend to be drawn
export function getLegend(layerTypesSettings, groups, legendPreferences) {
  var initialParams = { pos: 10 };
  var activeLegend = getActiveLegend(
    layerTypesSettings,
    groups,
    legendPreferences,
    initialParams
  );
  var hiddenLegend = getHiddenLegend(
    layerTypesSettings,
    groups,
    legendPreferences,
    initialParams
  );
  return {
    active: activeLegend,
    hidden: hiddenLegend,
  };
}

function getActiveLegend(
  layerTypesSettings,
  groups,
  legendPreferences,
  initialParams
) {
  var activeLayerTypes = {};
  for (var i in layerTypesSettings) {
    if (
      layerTypesSettings[i].hidden !== true &&
      isGroupActive(i, groups) !== false
    ) {
      activeLayerTypes[i] = layerTypesSettings[i];
    }
  }
  var activeGroups = [];
  for (var j in groups) {
    if (groups[j].active === true) {
      activeGroups.push(groups[j]);
    }
  }
  return legendPreferences.reverse_order.value
    ? setupLegendReverse(
        activeGroups,
        legendPreferences,
        activeLayerTypes,
        initialParams
      )
    : setupLegend(
        activeGroups,
        legendPreferences,
        activeLayerTypes,
        initialParams
      );
}

function getHiddenLegend(
  layerTypesSettings,
  groups,
  legendPreferences,
  initialParams
) {
  var hiddenLayerTypes = {};
  for (var i in layerTypesSettings) {
    if (
      layerTypesSettings[i].hidden === true ||
      isGroupActive(i, groups) === false
    ) {
      hiddenLayerTypes[i] = layerTypesSettings[i];
    }
  }
  var hiddenGroups = [];
  for (var j in groups) {
    if (groups[j].active !== true) {
      hiddenGroups.push(groups[j]);
    }
  }
  return legendPreferences.reverse_order.value
    ? setupLegendReverse(
        hiddenGroups,
        legendPreferences,
        hiddenLayerTypes,
        initialParams
      )
    : setupLegend(
        hiddenGroups,
        legendPreferences,
        hiddenLayerTypes,
        initialParams
      );
}

function setupLegend(groups, legendPreferences, layerTypesSettings, params) {
  var legend = [];
  for (var j in layerTypesSettings) {
    var layer = getLayer(groups, j, layerTypesSettings, legendPreferences);
    if (layer !== undefined) {
      legend.push({ position: params.pos, layer: layer });
      params.pos =
        params.pos + layer.width + legendPreferences.element_spacing.value;
    }
  }
  for (var i in groups) {
    var groupLayer = getGroupLayer(
      groups[i],
      groups[i].name,
      layerTypesSettings,
      legendPreferences
    );
    if (groupLayer !== undefined) {
      legend.push({ position: params.pos, layer: groupLayer });
      params.pos =
        params.pos + groupLayer.width + legendPreferences.element_spacing.value;
    }
  }
  return legend;
}

function setupLegendReverse(
  groups,
  legendPreferences,
  layerTypesSettings,
  params
) {
  var legend = [];
  for (var i in groups.reverse()) {
    var groupLayer = getGroupLayer(
      groups[i],
      groups[i].name,
      layerTypesSettings,
      legendPreferences
    );
    if (groupLayer !== undefined) {
      legend.push({ position: params.pos, layer: groupLayer });
      params.pos =
        params.pos + groupLayer.width + legendPreferences.element_spacing.value;
    }
  }
  for (var j in layerTypesSettings) {
    var layer = getLayer(groups, j, layerTypesSettings, legendPreferences);
    if (layer !== undefined) {
      legend.push({ position: params.pos, layer: layer });
      params.pos =
        params.pos + layer.width + legendPreferences.element_spacing.value;
    }
  }
  return legend;
}

// Get the subnetwork for a Group
function getGroupLayer(
  group,
  layerName,
  layerTypesSettings,
  legendPreferences
) {
  if (layerTypesSettings[layerName] !== undefined) {
    const graph = getLegendItemGraph(group, legendPreferences);
    return {
      trivial: false,
      active: group.active,
      width:
        graph.graph().width +
        legendPreferences.complex_spacing.value +
        legendPreferences.layer_width.value,
      height: graph.graph().height,
      representer: {
        name: layerName,
        setting: layerTypesSettings[layerName],
      },
      graph: graph,
    };
  }
}

// Get the Subnetwork for a specific Layer
function getLayer(groups, layerName, layerTypesSettings, legendPreferences) {
  for (var i in groups) {
    if (groups[i].name === layerName) {
      return undefined;
    }
  }
  return {
    trivial: true,
    active: !layerTypesSettings[layerName].hidden,
    dense: layerTypesSettings[layerName].dense,
    width: legendPreferences.layer_width.value,
    height: legendPreferences.layer_height.value,
    representer: {
      name: layerName,
      setting: layerTypesSettings[layerName],
    },
  };
}

function getLegendItemGraph(group, legendPreferences) {
  var graph = new dagre.graphlib.Graph();
  graph.setGraph({
    ranker: "longest-path",
    rankdir: "LR",
    ranksep:
      legendPreferences.layers_spacing_horizontal.value +
      legendPreferences.stroke_width.value,
    nodesep: legendPreferences.layers_spacing_vertical.value,
    edgesep:
      legendPreferences.layer_height.value +
      legendPreferences.layers_spacing_vertical.value,
  }); // Set Graph Properties
  graph.setDefaultEdgeLabel(function () {
    return {};
  }); // Default Egde Label needs to be set
  for (var i in group.layers) {
    const layer = group.layers[i];
    graph.setNode(i, {
      id: parseInt(i, 10),
      width: legendPreferences.layer_width.value,
      height: legendPreferences.layer_height.value,
      layer: layer,
    });
  }
  for (var j in group.layers) {
    // Add all Edges to the Graph
    var layer_current = group.layers[j]; // Get the current Layer
    for (var k in layer_current.properties.output) {
      // Go over all outputs of the current Layer
      graph.setEdge(
        j,
        common.getLayerByID(layer_current.properties.output[k], group.layers)
      ); // Add the Edge to the Graph
    }
  }
  dagre.layout(graph); // Layout the graph to be displayed in a nice fashion
  return graph;
}

// Get the Input Node to a Graph
export function getInputNode(nodes) {
  for (var j in nodes) {
    // Iterate over all layers in the Group
    if (nodes[j].layer.properties.input.length === 0) {
      // Layer has no inputs contained in the Group
      return j;
    }
  }
}

function isGroupActive(key, groups) {
  for (var i in groups) {
    if (key === groups[i].name) {
      if (!groups[i].active) {
        return false;
      }
      return true;
    }
  }
}
