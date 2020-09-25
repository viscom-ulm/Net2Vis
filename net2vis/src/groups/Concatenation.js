import * as common from "./Common";
import * as layerCommon from "../layers/Common";

// Replaces multiple Layers by a more abstract one.
export function concatenateLayers(occurence, network, group) {
  var compressedNetwork = { layers: [] };
  if (layerIdsExist(occurence, network)) {
    // Check if all layers that should be concatenated still exist.
    var newID = common.maxID(network) + 1; // Get a new ID for the concatenation Layer
    var newLayer = {
      // Initialize the new layer
      id: newID,
      name: group.name,
      properties: {
        dimensions: {
          in: [100, 100, 100],
          out: [100, 100, 100],
        },
        input: [],
        output: [],
        properties: {},
      },
    };
    newLayer.properties.dimensions.in = getNewInputDimensions(
      occurence,
      network
    ); // Change the input Dimensions of the new Layer
    newLayer.properties.dimensions.out = getNewOutputDimensions(
      occurence,
      network
    ); // Change the output Dimensions of the new Layer
    for (var i in network.layers) {
      // Go over all Layers in the Network
      if (!checkInOccurence(occurence, network.layers[i].id)) {
        // Layer not in the compression List
        var layer = JSON.parse(JSON.stringify(network.layers[i])); // Copy layer from the original Network
        changeInputIfNeccessary(occurence, layer, newID, newLayer); // Change inputs of the layer if they are now missing
        changeOutputIfNeccessary(occurence, layer, newID, newLayer); // Change outputs of the layer if they are now missing
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
  for (var i in occurence) {
    // Check all items in the occurence
    if (!layerIdExists(occurence[i].matchID, network)) {
      // Layer does not exist
      return false;
    }
  }
  return true; // All layers exist
}

// Check if a Layer with a given ID exists.
function layerIdExists(id, network) {
  for (var i in network.layers) {
    // Iterate over all layers in the Network
    if (network.layers[i].id === id) {
      // Check if it has the searched ID
      return true;
    }
  }
  return false; // No layer with the searched ID
}

// Check if a layer is in the occurence list
function checkInOccurence(occurence, id) {
  for (var i in occurence) {
    // Iterate over the list
    if (occurence[i].matchID === id) {
      // Layer IDs match, in the list
      return true;
    }
  }
  return false; // Not in the List
}

// Change the input of a layer if the input to it is about to be removed.
function changeInputIfNeccessary(occurence, layer, newID, newLayer) {
  for (var i in layer.properties.input) {
    // Iterate over all inputs of the layer
    for (var j in occurence) {
      // Iterate over all items in the occurence list
      if (layer.properties.input[i] === occurence[j].matchID) {
        // Input of the layer in the Occurence List
        layer.properties.input[i] = newID; // Set the input to the ID of the newly created abstract Layer
        newLayer.properties.output.push(layer.id); // Add the current layer to the outputs of the new Layer
      }
    }
  }
}

// Change the output of a layer if the output to it is about to be removed.
function changeOutputIfNeccessary(occurence, layer, newID, newLayer) {
  for (var i in layer.properties.output) {
    // Iterate over all outputs of the layer
    for (var j in occurence) {
      // Iterate over all items in the occurence list
      if (layer.properties.output[i] === occurence[j].matchID) {
        // Output of the layer in the Occurence List
        layer.properties.output[i] = newID; // Set the input to the ID of the newly created abstract Layer
        newLayer.properties.input.push(layer.id); // Add the current layer to the inputs of the new Layer
      }
    }
  }
}

// Get the input dimensions for the new Layer
function getNewInputDimensions(occurence, network) {
  for (var i in occurence) {
    // Iterate over the Occurence List
    if (occurence[i].properties.input.length === 0) {
      // No Inputs for a Layer
      var id = layerCommon.getLayerByID(occurence[i].matchID, network.layers);
      if (id >= 0) {
        // Layer has ID that occurence item matches
        return network.layers[id].properties.dimensions.in; // Return the input dimensions for this layer from the network
      }
    }
  }
}

// Get the output dimensions for the new Layer
function getNewOutputDimensions(occurence, network) {
  for (var i in occurence) {
    // Iterate over the occurence List
    if (occurence[i].properties.output.length === 0) {
      // Not Outputs for a Layer
      var id = layerCommon.getLayerByID(occurence[i].matchID, network.layers);
      if (id >= 0) {
        // Layer has ID that occurence item matches
        return network.layers[id].properties.dimensions.out; // Return the input dimensions for this layer from the network
      }
    }
  }
}
