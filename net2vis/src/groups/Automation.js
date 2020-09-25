import * as common from "../layers/Common";

// Get the most common repetition currently in the network
export function getMostCommonRepetition(network) {
  var sequentialPaths = findSequentialPaths(network); // Get the sequential Paths in the Network
  var repetitions = {}; // Initialize the repetitions Variable
  for (var i in sequentialPaths) {
    // For all the paths
    findRepetitionsForPath(sequentialPaths[i], repetitions); // Find repetitions in the path
  }
  var key = getMostCommonKey(repetitions); // Get most common repetition
  return repetitions[key];
}

// Find all sequential Parts of the Network
function findSequentialPaths(network) {
  var sequentialLayers = getSequentialLayers(network); // Get all Layers that are sequential
  var sequentialPaths = getSequentialPaths(sequentialLayers); // Get all Pahts from these sequential Layers
  checkInputsMissing(sequentialPaths, network);
  checkOutputsMissing(sequentialPaths, network);
  return sequentialPaths;
}

// Get all Layers that belong to a sequential part of the network.
function getSequentialLayers(network) {
  var layers = []; // Initialize the layers Variable
  for (var i in network.layers) {
    // For all layers in the Network
    if (
      network.layers[i].properties.input.length < 2 &&
      network.layers[i].properties.output.length < 2
    ) {
      // If Layer is sequential
      layers.push(network.layers[i]); // Add the layer to the Sequential ones
    }
  }
  return layers;
}

// Get Pahts from the sequential Layers of the Network
function getSequentialPaths(sequentialLayers) {
  var sequentialPaths = []; // Initialize the paths variable
  while (sequentialLayers.length > 0) {
    // As long as there are sequential layers that are not in the paths
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
  for (var i in sequentialLayers) {
    // For all layers
    if (
      common.getLayerByID(
        sequentialLayers[i].properties.input[0],
        sequentialLayers
      ) === -1
    ) {
      // If their input is not in the sequential layers
      return i; // Return the index as it is an input
    }
  }
}

// Create a sequence from an input layer to create a path
function createSequence(sequentialPath, sequentialLayers) {
  var nextID = common.getLayerByID(
    sequentialPath[sequentialPath.length - 1].properties.output[0],
    sequentialLayers
  ); // Get the ID of the next layer in sequentialLayers
  if (nextID !== -1) {
    // There is a next Layer ID, so we keep going
    sequentialPath.push(sequentialLayers[nextID]); // Add the layer to the path
    sequentialLayers.splice(nextID, 1); // Remove the layer from the sequentialLayers
    createSequence(sequentialPath, sequentialLayers); // Recursively add the next layer of the path
  }
}

// Add another layer to the beginning of the path, if just its input is parallel
function checkInputsMissing(sequentialPaths, network) {
  for (var i in sequentialPaths) {
    // Check all paths
    var inIDs = sequentialPaths[i][0].properties.input; // Get the ID of the input to this layer
    if (inIDs.length === 1) {
      // Layer has an input
      var inLayer =
        network.layers[common.getLayerByID(inIDs[0], network.layers)]; // Get the layer that is the input to the first layer
      if (inLayer.properties.output.length === 1) {
        // If it is only parallel on the input side
        sequentialPaths[i].unshift(inLayer); // Add the layer to the beginning of the path
      }
    }
  }
}

// Add another layer to the end of the path, if just its output is parallel
function checkOutputsMissing(sequentialPaths, network) {
  for (var i in sequentialPaths) {
    // Check all paths
    var outIDs =
      sequentialPaths[i][sequentialPaths[i].length - 1].properties.output; // Get the ID of the output to the last layer
    if (outIDs.length === 1) {
      // Layer has an output
      var outLayer =
        network.layers[common.getLayerByID(outIDs[0], network.layers)]; // Get the layer that is the output to the last layer
      if (outLayer.properties.input.length === 1) {
        // If it is only parallel on the output side
        sequentialPaths[i].push(outLayer); // Add the layer to the end of the path
      }
    }
  }
}

// Find repetitions in a Path
function findRepetitionsForPath(path, repetitions) {
  for (var i = 0; i < path.length; i++) {
    // For each layer in the path
    for (var j = i + 1; j < path.length; j++) {
      // Check all the Layers that follow it
      var repName = ""; // Initial name for the repetition
      var layers = []; // Initial Layers in the repetition
      var ids = []; // Initial Layers in the repetition for grouping
      for (var k = i; k <= j; k++) {
        // All number of layers between i and j
        repName = repName + path[k].name; // set the name to a clear Identifier (combination of layer names)
        layers.push(path[k].name); // Add the layers to the repetition
        ids.push(path[k].id); // Add the id to the repetition
      }
      if (repetitions[repName] === undefined) {
        // Repetition does not already exist
        repetitions[repName] = {
          // Initialize the repetition
          layers: layers, // Set the Layers
          ids: [ids], // Set the ids needed for grouping
          amount: 1, // Initialize the amount of occurences
        };
      } else {
        // Repetition does exist
        var overlap = false; // Placeholder for wether there is an overlap
        for (var l in repetitions[repName].ids) {
          // Check all ID arrays
          for (var m in repetitions[repName].ids[l]) {
            // Check each element
            for (var n in ids) {
              // Check each id of the current path
              if (repetitions[repName].ids[l][m] === ids[n]) {
                // If the ID has halready been used (i.e. repetition would overlap)
                overlap = true; // Set the overlap placeholder to true
              }
            }
          }
        }
        if (!overlap) {
          // If there is no overlap
          repetitions[repName].amount = repetitions[repName].amount + 1; // Increase the occurence count
          repetitions[repName].ids.push(ids); // Add the new IDs
        }
      }
    }
  }
}

// Get the key that has the highest occurence count
function getMostCommonKey(repetitions) {
  var mostcommon = ""; // Initially, nothing is common
  var number = 0; // Initially, no repetitions
  var layers = 0; // Initial length of layers in the repetition
  for (var key in repetitions) {
    // Check all keys
    if (number < repetitions[key].amount) {
      // If there are more of it than any other
      number = repetitions[key].amount; // Update the highest amount
      mostcommon = key; // Update the Key
      layers = repetitions[key].layers.length; // Update The layer length
    } else if (
      number === repetitions[key].amount &&
      layers < repetitions[key].layers.length
    ) {
      number = repetitions[key].amount; // Update the highest amount
      mostcommon = key; // Update the Key
      layers = repetitions[key].layers.length; // Update The layer length
    }
  }
  return mostcommon;
}
