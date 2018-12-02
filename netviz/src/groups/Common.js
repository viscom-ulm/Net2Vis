// Returns the layer index gien an ID
export function getLayerByID(id, layers) {
  for (var i in layers) { // Iterate over all layers
    if (layers[i].id === id) { // Layer ID matches
      return i;
    }
  }
  return -1; // No Layer with this ID
}

// Find an input Node of a Group
export function findInputNode(group) {
  for (var j in group.layers) { // Iterate over all layers in the Group
    if(group.layers[j].properties.input.length === 0) { // Layer has no inputs contained in the Group
      return {inputID: j, inputNode: group.layers[j]};
    }
  }
}

// Find an input Node of a Group
export function findOutputNode(group) {
  for (var j in group.layers) { // Iterate over all layers in the Group
    if(group.layers[j].properties.output.length === 0) { // Layer has no inputs contained in the Group
      return {outputID: j, outputNode: group.layers[j]};
    }
  }
}

// Returning the maximum ID in the current network.
export function maxID(network) {
  var id = 0; // Initialize the max ID
  for (var i in network.layers) { // Check all layers
    id = network.layers[i].id > id ? network.layers[i].id : id; // Set to bigger of current layer id and id
  }
  return id;
}