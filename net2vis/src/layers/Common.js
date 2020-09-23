// Returns the layer index gien an ID
export function getLayerByID(id, layers) {
  for (var i in layers) {
    // Iterate over all layers
    if (layers[i].id === id) {
      // Layer ID matches
      return i;
    }
  }
  return -1; // No Layer with this ID
}

// Returning the maximum ID in the current network.
export function maxID(network) {
  var id = 0; // Initialize the max ID
  for (var i in network.layers) {
    // Check all layers
    id = network.layers[i].id > id ? network.layers[i].id : id; // Set to bigger of current layer id and id
  }
  return id;
}
