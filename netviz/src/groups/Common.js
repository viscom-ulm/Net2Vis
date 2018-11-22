// Returns the layer index gien an ID
export function getLayerByID(id, layers) {
  for (var i in layers) { // Iterate over all layers
    if (layers[i].id === id) { // Layer ID matches
      return i;
    }
  }
  return -1; // No Layer with this ID
}