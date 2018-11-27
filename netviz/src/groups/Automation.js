// Find all sequential Parts of the Network
function findSequentialPaths(network) {
  var sequentialLayers = getSequentialLayers(network); // Get all Layers that are sequential
  var sequentialPaths = getSequentialPaths(sequentialLayers); // Get all Pahts from these sequential Layers
  return sequentialPaths;
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

// Get the most common repetition currently in the network
export function getMostCommonRepetition(network) {
  var sequentialPaths = findSequentialPaths(network); // Get the sequential Paths in the Network
  var repetitions = {}; // Initialize the repetitions Variable
  for (var i in sequentialPaths) { // For all the paths
    findRepetitionsForPath(sequentialPaths[i], repetitions); // Find repetitions in the path
  }
  var key = getMostCommonKey(repetitions); // Get most common repetition
  return repetitions[key];
}

// Find repetitions in a Path
function findRepetitionsForPath(path, repetitions) {
  for (var i = 0; i < path.length; i++) { // For each layer in the path
    for (var j = i+1; j < path.length; j++)  { // Check all the Layers that follow it
      var repName = ''; // Initial name for the repetition
      var layers = []; // Initial Layers in the repetition
      for (var k = i; k <= j; k++) { // All number of layers between i and j
        repName = repName + path[k].name; // set the name to a clear Identifier (combination of layer names)
        layers.push(path[k].name); // Add the layers to the repetition
      }
      if (repetitions[repName] === undefined) { // Repetition does not already exist
        repetitions[repName] = { // Initialize the repetition
          layers: layers, // Set the Layers
          amount: 1 // Initialize the amount of occurences
        }
      } else { // Repetition does exist
        repetitions[repName].amount = repetitions[repName].amount + 1; // Increase the occurence count
      }
    }
  }
}

// Get the key that has the highest occurence count
function getMostCommonKey(repetitions) {
  var mostcommon = ''; // Initially, nothing is common
  var number = 0; // Initially, no repetitions
  var layers = 0; // Initial length of layers in the repetition
  for (var key in repetitions) { // Check all keys
    if (number < repetitions[key].amount) { // If there are more of it than any other
      number = repetitions[key].amount; // Update the highest amount
      mostcommon = key; // Update the Key
      layers = repetitions[key].layers.length; // Update The layer length
    } else if (number === repetitions[key].amount && layers < repetitions[key].layers.length) {
      number = repetitions[key].amount; // Update the highest amount
      mostcommon = key; // Update the Key
      layers = repetitions[key].layers.length; // Update The layer length
    }
  }
  return mostcommon
}