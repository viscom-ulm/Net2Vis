export function findSequentialParts(network) {
  var sequentialLayers = getSequentialLayers(network);
  var sequentialPaths = getSequentialPaths(sequentialLayers);
  console.log(sequentialPaths);
}

// Get all Layers that belong to a sequential part of the network.
function getSequentialLayers(network) {
  var layers = []; // Initialize the layers Variable
  for (var i in network.layers) { // For all layers in the Network
    if (network.layers[i].properties.input.length < 2 && network.layers[i].properties.output.length < 2) { // If Layer is sequential
      layers.push(network.layers[i]); // Add the layer to the Sequential ones
    }
  }
  return layers;
}

// Get Pahts from the sequential Layers of the Network
function getSequentialPaths(sequentialLayers) {
  var sequentialPaths = []; // Initialize the paths variable
  while(sequentialLayers.length > 0) { // As long as there are sequential layers that are not in the paths
    var inputID = getInputId(sequentialLayers); // Get the ID of an input Layer to a path (i. e. inputs of layer not in sequentialLayers)
    var sequentialPath = [sequentialLayers[inputID]]; // Add this layer to the current path
    sequentialLayers.splice(inputID, 1); // Remove the layer from the sequentialLayers
    createSequence(sequentialPath, sequentialLayers); // Create the sequence from this path
    sequentialPaths.push(sequentialPath); // Add the path to the paths
  }
  return sequentialPaths;
}

// Get the ID of an input layer in the sequentialLayers
function getInputId(sequentialLayers) {
  for (var i in sequentialLayers) { // For all layers
    if (getSequentialID(sequentialLayers[i].properties.input[0], sequentialLayers) === undefined) { // If their input is not in the sequential layers
      return i; // Return the index as it is an input
    }
  }
}

// Create a sequence from an input layer to create a path
function createSequence(sequentialPath, sequentialLayers) {
  var nextID = getSequentialID(sequentialPath[sequentialPath.length - 1].properties.output[0], sequentialLayers); // Get the ID of the next layer in sequentialLayers
  if (nextID !== undefined) { // There is a next Layer ID, so we keep going
    sequentialPath.push(sequentialLayers[nextID]); // Add the layer to the path
    sequentialLayers.splice(nextID, 1); // Remove the layer from the sequentialLayers
    createSequence(sequentialPath, sequentialLayers); // Recursively add the next layer of the path
  }
}

// Get a position in sequentialLayers where the layer has a given ID
function getSequentialID(id, sequentialLayers) {
  for (var i in sequentialLayers) { // For all Layers
    if (sequentialLayers[i].id === id) { // The layer has the ID searched for
      return i; // Return as the seatched array index
    }
  }
}