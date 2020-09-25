import * as randomstring from "randomstring";
import * as common from "../layers/Common";

// Gouping a selection of layers
export function groupLayers(network, selection) {
  if (checkGroupable(network, selection)) {
    // If the selection is groupable
    return generateGroup(network, selection); // Generate the Group
  } else {
    return undefined;
  }
}

// Check if the current selection is groupable
function checkGroupable(network, selection) {
  if (selection.length < 2) {
    // Needs to contain more than one element
    return false;
  }
  var inNodes = 0;
  var outNodes = 0;
  for (var i in selection) {
    // Check groupability of each of the selected layers
    var layer =
      network.layers[common.getLayerByID(selection[i], network.layers)]; // Get the current layer
    var inputs = layer.properties.input; // Get the inputs of the current layer
    var outputs = layer.properties.output; // Get the outputs of the current layer
    var inContained = contained(inputs, selection); // Check how many of the inputs of the current layer are also selected.
    var outContained = contained(outputs, selection); // Check how many of the outputs of the current layer are also selected.
    if (inputs.length !== inContained && inContained > 0) {
      // Some, but not all inputs selected
      return false; // Not groupable
    } else if (outputs.length !== outContained && outContained > 0) {
      // Some, but not all outputs selected
      return false; // Not groupable
    } else if (outContained === 0 && inContained === 0) {
      // No in- or outputs at all selected
      return false; // Not Groupable
    }
    if (inContained === 0) {
      // No Inputs to this Layer
      inNodes = inNodes + 1; // Is input node, increase count
    }
    if (outContained === 0) {
      outNodes = outNodes + 1; // Is output node, increase count
    }
  }
  if (inNodes > 1 || outNodes > 1) {
    // Multiple input or output nodes
    return false; // Not groupable
  }
  return true; // More than one element selected, and all elements connected. Also no parallel path partly selected. Groupable!
}

// Check, how many of the given layers are contained in the selection
function contained(layers, selection) {
  var contained = 0;
  for (var j in layers) {
    // Iterate over all layers
    if (selection.includes(layers[j])) {
      // If the selection includes the layer
      contained = contained + 1; // Increment the number of contained elements
    }
  }
  return contained;
}

// Generate the Group in the Graph
function generateGroup(network, selection) {
  var group = {
    // Initialize the Group as empty object
    name: randomstring.generate(),
    active: true,
    layers: [],
  };
  for (var i in selection) {
    // Iterate over all selected Layers
    group.layers.push({
      id: network.layers[common.getLayerByID(selection[i], network.layers)].id,
      name:
        network.layers[common.getLayerByID(selection[i], network.layers)].name,
      properties: {
        dimensions: {
          in: [1, 1, 1],
          out: [1, 1, 1],
        },
        input: addInputsToLayer(selection, network, i),
        output: addOutputsToLayer(selection, network, i),
        properties: {},
      },
    }); // Add the Layers to the group
  }
  return group;
}

function addInputsToLayer(selection, network, i) {
  var layers = []; // Initialize input Layers to be added
  var inputs =
    network.layers[common.getLayerByID(selection[i], network.layers)].properties
      .input; // Get all inputs for the current Layer
  for (var j in inputs) {
    // Iterate over all inputs
    var inputLayer =
      network.layers[common.getLayerByID(inputs[j], network.layers)]; // Get the Layer of the current Input
    for (var k in selection) {
      // Iterate over all selected Items
      if (selection[k] === inputLayer.id) {
        // Current InputLayer is currently inspected selected Item
        layers.push(inputLayer.id); // Add the selection ID to the input layers
      }
    }
  }
  return layers;
}

function addOutputsToLayer(selection, network, i) {
  var layers = []; // Initialize output Layers to be added
  var outputs =
    network.layers[common.getLayerByID(selection[i], network.layers)].properties
      .output; // Get all outputs for the current Layer
  for (var j in outputs) {
    // Iterate over all outputs
    var outputLayer =
      network.layers[common.getLayerByID(outputs[j], network.layers)]; // Get the Layer of the current Output
    for (var k in selection) {
      // Iterate over all selected Items
      if (selection[k] === outputLayer.id) {
        // Current OutputLayer id currently inspected selected Item
        layers.push(outputLayer.id); // Add the selection ID to the input layers
      }
    }
  }
  return layers;
}
