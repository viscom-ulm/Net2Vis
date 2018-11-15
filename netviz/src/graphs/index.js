import * as dagre from 'dagre';
import * as randomstring from 'randomstring';

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
    const feat_diff = layer_extreme_dimensions.max_features - layer_extreme_dimensions.min_features; // Get the difference between max and min features of the Layers
    const fdim_diff = preferences.layer_display_max_width.value - preferences.layer_display_min_width.value; // Get the differnece between Max and Min width for the Glyph Dimensions
    const f_perc = (layer.properties.dimensions.out[layer.properties.dimensions.out.length - 1] - layer_extreme_dimensions.min_features) / feat_diff; // Calculate the interpolation factor
    const width = f_perc * fdim_diff + preferences.layer_display_min_width.value; // Calculate the width of the glyph
    graph.setNode(layer.id, {width: width, height: height, layer: layer}); // Add a Node to the Graph
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
  if (checkGroupable(network, selection)) { // If the selection is groupable
    return generateGroup(network, selection); // Generate the Group
  } else {
    return undefined;
  }
}

// Check if the current selection is groupable
function checkGroupable(network, selection) { 
  if (selection.length < 2) { // Needs to contain more than one element
    return false;
  }
  for (var i in selection) { // Check groupability of each of the selected layers
    var layer = network.layers[getLayerByID(selection[i], network.layers)]; // Get the current layer
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

// Generate the Group in the Graph
function generateGroup(network, selection) {
  var group = { // Initialize the Group as empty object
    name: randomstring.generate(),
    layers: []
  };
  for (var i in selection) { // Iterate over all selected Layers
    group.layers.push({
      name: network.layers[getLayerByID(selection[i], network.layers)].name,
      input: addInputsToLayer(selection, network, i),
      output: addOutputsToLayer(selection, network, i)
    }); // Add the Layers to the group
  }
  return group;
}

function addInputsToLayer(selection, network, i) {
  var layers = []; // Initialize input Layers to be added
  var inputs = network.layers[getLayerByID(selection[i], network.layers)].properties.input; // Get all inputs for the current Layer
  for (var j in inputs) { // Iterate over all inputs
    var inputLayer = network.layers[getLayerByID(inputs[j], network.layers)]; // Get the Layer of the current Input
    for (var k in selection) { // Iterate over all selected Items
      if (selection[k] === inputLayer.id) { // Current InputLayer is currently inspected selected Item
        layers.push(k); // Add the selection ID to the input layers
      }
    }
  }
  return layers;
}

function addOutputsToLayer(selection, network, i) {
  var layers = []; // Initialize output Layers to be added
  var outputs = network.layers[getLayerByID(selection[i], network.layers)].properties.output; // Get all outputs for the current Layer
  for (var j in outputs) { // Iterate over all outputs
    var outputLayer = network.layers[getLayerByID(outputs[j], network.layers)]; // Get the Layer of the current Output
    for (var k in selection) { // Iterate over all selected Items
      if (selection[k] === outputLayer.id) { // Current OutputLayer id currently inspected selected Item
        layers.push(k); // Add the selection ID to the input layers
      }
    }
  }
  return layers;
}

// Find all occurences of a group in the network
export function findGroupOccurences(group, network) {
  var input = findInputNode(group); // Find one input Node to the Graph
  var inputOccurences = findInputOccurences(input.inputNode, network); // Check, where the inputNode type exists in the network
  var matchesList = generateInitialMatchesList(group, network, inputOccurences, input.inputID); // Initialize the Matches List using the input node and its occurences
  var nextLayerInfo = findUncheckedConnectedLayer(matchesList); // Get the info for which layer to check for a match next
  while (nextLayerInfo.source !== -1) { // Do as long as there are more layers to check
    for (var i in matchesList) { // Iterate over all lists in the matches List
      var currentSourceLayer = network.layers[getLayerByID(matchesList[i][nextLayerInfo.source].matchID, network.layers)]; // Get the source layer from which we get to the layer to be inspected from the network
      var layerID = nextLayerInfo.type === 'out' ? currentSourceLayer.properties.output[nextLayerInfo.connection] : currentSourceLayer.properties.input[nextLayerInfo.connection]; // Get the ID of the current layer to be inspected(depending on in or out connected)
      var layerNumber = getLayerByID(layerID, network.layers); // Map the layerID to the position in the array
      var outputsLayer = network.layers[layerNumber].properties.output; // Get the outputs for this Layer
      var inputsLayer = network.layers[layerNumber].properties.input; // Get the inputs for this Layer
      var groupNumber = nextLayerInfo.type === 'out' ? group.layers[nextLayerInfo.source].output[nextLayerInfo.connection] : group.layers[nextLayerInfo.source].input[nextLayerInfo.connection]; // Get the number of the group node to be inspected (depending on in or out connected)
      var outputsGroup = group.layers[groupNumber].output; // Get the outputs for the input Layer of the Group
      var inputsGroup = group.layers[groupNumber].input; // Get the outputs for the input Layer of the Group
      if (checkOutputsMatching(outputsGroup, outputsLayer, network, group) && checkInputsMatching(inputsGroup, inputsLayer, network, group)) { // Outputs and Inputs match
        matchesList[i][groupNumber].matchID = network.layers[layerNumber].id; // Assign the match ID
      } else { // Output or Inputs do not match
        matchesList.splice(i, 1); // Remove the list from the matchesList
        i = i - 1; // Do not skip an element after removal
      }
    }
    nextLayerInfo = findUncheckedConnectedLayer(matchesList); // Get the info for which layer to check for a match next
  }
  return matchesList;
}

// Find an input Node of a Group
function findInputNode(group) {
  for (var j in group.layers) { // Iterate over all layers in the Group
    if(group.layers[j].input.length === 0) { // Layer has no inputs contained in the Group
      return {inputID: j, inputNode: group.layers[j]};
    }
  }
}

// Find all layers that are the same as the input layer of the group
function findInputOccurences(inputNode, network) {
  var occurences = []; // Initialize the occurences
  for (var i in network.layers) { // Iterate over all layers in the network
    if (network.layers[i].name === inputNode.name) { // The Layers have the same name
      occurences.push(i); // Add the position of the Layer in the Network to the occurences
    }
  }
  return occurences;
}

// Initialize the matches list, where, for each match of the input layer, a match list is created in the matches list
function generateInitialMatchesList(group, network, inputOccurences, inputID) {
  var matchesList = []; // Initialize the matchesList
  for (var i in inputOccurences) { // Iterate over all occurences of the group input Layer in the Network
    var outputsLayer = network.layers[inputOccurences[i]].properties.output; // Get the outputs for this Layer
    var outputsGroup = group.layers[inputID].output; // Get the outputs for the input Layer of the Group
    if (checkOutputsMatching(outputsGroup, outputsLayer, network, group)) { // If parts still equal
      matchesList.push(JSON.parse(JSON.stringify(group.layers.slice(0)))); // Copy the group layers to the matches List
      matchesList[matchesList.length - 1][inputID].matchID = network.layers[inputOccurences[i]].id; // Set the match for the input layer of the group in this match of the matches List
    }
  }
  return matchesList;
}

function findUncheckedConnectedLayer(matchesList) {
  if (matchesList.length > 0) { // If there are lists to be checked still
    var list = matchesList[0]; // Get the first list as an example (since all should contain matches at the same positions)
    for (var i in list) { // Iterate over the list items (nodes of the group) 
      if (typeof(list[i].matchID) !== 'undefined') { // If current group node already matches
        for (var j in list[i].output) { // Iterate over the outputs
          if (typeof(list[list[i].output[j]].matchID) === 'undefined') { // If group node connected at this output not matched
            return {type: 'out', source: i, connection: j}; // Layer to be inspected has been found
          }
        }
        for (var k in list[i].input) { // Iterate over all Inputs
          if (typeof(list[list[i].input[k]].matchID) === 'undefined') { // If group node connected at this input not matched
            return {type: 'in', source: i, connection: k}; // Layer to be inspected has been found
          }
        }
      }
    }
  }
  return {type: 'in', source: -1, connection: -1}; // No layer to be inspected, return this as a signal
}

// Check if the outputs of Networklayer and Groupnode are matching
function checkOutputsMatching(outputsGroup, outputsLayer, network, group) {
  var same = true; // Initialize the sameness placeholder
  if (outputsGroup.length === 0) {
    return same;
  } else if (outputsGroup.length === outputsLayer.length) { // First, check if both Network Layer and Group Layer have the same Number of outputs
    for (var j in outputsGroup) { // Iterate over all ouptuts of the Group Layer 
      if (group.layers[outputsGroup[j]].name !== network.layers[getLayerByID(outputsLayer[j], network.layers)].name) { // Not the same Layer Name as the Network output
        same = false; // Network part not equal
      }
    }
  } else {
    same = false; // Network part not equal
  }
  return same;
}

// Check if the inputs of Networklayer and Groupnode are matching
function checkInputsMatching(inputsGroup, inputsLayer, network, group) {
  var same = true; // Initialize the sameness placeholder
  if (inputsGroup.length === 0) {
    return same;
  } else if (inputsGroup.length === inputsLayer.length) { // First, check if both Network Layer and Group Layer have the same Number of inputs
    for (var j in inputsGroup) { // Iterate over all inputs of the Group Layer 
      if (group.layers[inputsGroup[j]].name !== network.layers[getLayerByID(inputsLayer[j], network.layers)].name) { // Not the same Layer Name as the Network input
        same = false; // Network part not equal
      }
    }
  } else {
    same = false; // Network part not equal
  }
  return same;
}

// Replaces multiple Layers by a more abstract one.
export function concatenateLayers(occurence, network, group) {
  var compressedNetwork = {layers: []}
  if (layerIdsExist(occurence, network)) { // Check if all layers that should be concatenated still exist.
    var newID = maxID(network) + 1; // Get a new ID for the concatenation Layer
    var newLayer = { // Initialize the new layer
      id: newID,
      name: group.name,
      properties: {
        dimensions: {
          in: [100, 100, 100],
          out: [100, 100, 100]
        },
        input: [],
        output: [],
        properties: {}
      }
    }
    newLayer.properties.dimensions.in = getNewInputDimensions(occurence, network); // Change the input Dimensions of the new Layer
    newLayer.properties.dimensions.out = getNewOutputDimensions(occurence, network); // Change the output Dimensions of the new Layer
    for (var i in network.layers) { // Go over all Layers in the Network
      if(!checkInOccurence(occurence, network.layers[i].id)) { // Layer not in the compression List
        var layer = JSON.parse(JSON.stringify(network.layers[i])); // Copy layer from the original Network
        changeInputIfNeccessary(occurence, layer, newID, newLayer); // Change inputs of the layer if they are now missing
        changeOutputIfNeccessary(occurence, layer, newID, newLayer);// Change outputs of the layer if they are now missing
        compressedNetwork.layers.push(layer); // Add the layer to the compressed Network
      }
    }
  } else {
    return network;
  }
  compressedNetwork.layers.push(newLayer); // Add the new Layer to the compressed Network
  return compressedNetwork;
}

// Check if all layerIDs in the occurence still exist in the Network.
function layerIdsExist(occurence, network) {
  for (var i in occurence) { // Check all items in the occurence
    if (!layerIdExists(occurence[i].matchID, network)) { // Layer does not exist
      return false;
    }
  }
  return true; // All layers exist
}

// Check if a Layer with a given ID exists.
function layerIdExists(id, network) {
  for (var i in network.layers) { // Iterate over all layers in the Network
    if (network.layers[i].id === id) { // Check if it has the searched ID
      return true;
    }
  }
  return false; // No layer with the searched ID
}

// Returning the maximum ID in the current network.
function maxID(network) {
  var id = 0; // Initialize the max ID
  for (var i in network.layers) { // Check all layers
    id = network.layers[i].id > id ? network.layers[i].id : id; // Set to bigger of current layer id and id
  }
  return id;
}

// Check if a layer is in the occurence list
function checkInOccurence(occurence, id) {
  for (var i in occurence) { // Iterate over the list
    if (occurence[i].matchID === id) { // Layer IDs match, in the list
      return true;
    }
  }
  return false; // Not in the List
}

// Change the input of a layer if the input to it is about to be removed.
function changeInputIfNeccessary(occurence, layer, newID, newLayer) {
  for (var i in layer.properties.input) { // Iterate over all inputs of the layer
    for (var j in occurence) { // Iterate over all items in the occurence list
      if (layer.properties.input[i] === occurence[j].matchID) { // Input of the layer in the Occurence List
        layer.properties.input[i] = newID; // Set the input to the ID of the newly created abstract Layer
        newLayer.properties.output.push(layer.id); // Add the current layer to the outputs of the new Layer
      }
    }
  }
}

// Change the output of a layer if the output to it is about to be removed.
function changeOutputIfNeccessary(occurence, layer, newID, newLayer) {
  for (var i in layer.properties.output) { // Iterate over all outputs of the layer
    for (var j in occurence) { // Iterate over all items in the occurence list
      if (layer.properties.output[i] === occurence[j].matchID) { // Output of the layer in the Occurence List
        layer.properties.output[i] = newID; // Set the input to the ID of the newly created abstract Layer
        newLayer.properties.input.push(layer.id); // Add the current layer to the inputs of the new Layer
      }
    }
  }
}

// Get the input dimensions for the new Layer
function getNewInputDimensions(occurence, network) {
  for (var i in occurence) { // Iterate over the Occurence List
    if (occurence[i].input.length === 0) { // No Inputs for a Layer
      var id = getLayerByID(occurence[i].matchID, network.layers);
      if (id >= 0) { // Layer has ID that occurence item matches
        return network.layers[id].properties.dimensions.in; // Return the input dimensions for this layer from the network
      }
    }
  }
}

// Get the output dimensions for the new Layer
function getNewOutputDimensions(occurence, network) {
  for (var i in occurence) { // Iterate over the occurence List
    if (occurence[i].output.length === 0) { // Not Outputs for a Layer
      var id = getLayerByID(occurence[i].matchID, network.layers);
      if (id >= 0) { // Layer has ID that occurence item matches
        return network.layers[id].properties.dimensions.out; // Return the input dimensions for this layer from the network
      }
    }
  }
}

// Returns the layer index gien an ID
function getLayerByID(id, layers) {
  for (var i in layers) { // Iterate over all layers
    if (layers[i].id === id) { // Layer ID matches
      return i;
    }
  }
  return -1; // No Layer with this ID
}