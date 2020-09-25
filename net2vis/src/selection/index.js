import * as common from "../layers/Common";

// Get all paths from a node s to node d in the network
export function allPaths(s, d, network) {
  var paths = []; // Initially, no Paths found
  traverseWay(s, d, network, [], paths); // Traverse the way from s on
  return paths;
}

// Traverse the Network from node u on
function traverseWay(u, d, network, path, paths) {
  path.push(u);
  if (u.id === d.id) {
    // If u is the destination
    paths.push(path); // Add the path to the pathes
  } else if (u.properties.output.length === 0) {
    // If an output node has been reached
    paths.push(path); // Add the uncomplete path to the pathes
  } else {
    // Way goes on
    for (var i = 0; i < u.properties.output.length; i++) {
      // For all Outputs of the current node
      if (i === 0) {
        // For the first of all outputs
        var nextLayer =
          network.layers[
            common.getLayerByID(u.properties.output[i], network.layers)
          ]; // Get the next Layer
        traverseWay(nextLayer, d, network, path, paths); // Go further along the way
      } else {
        // Not the first output of the current node
        var newPath = JSON.parse(JSON.stringify(path)); // Copy the path, since a new path has been found
        var nextWay =
          network.layers[
            common.getLayerByID(u.properties.output[i], network.layers)
          ]; // Get the next Layer along this way
        traverseWay(nextWay, d, network, newPath, paths); // Go along this alternate way
      }
    }
  }
}

// Reduce the paths to just every layer they contain once
export function reducePaths(paths) {
  var items = []; // No Layers initially
  for (var i in paths) {
    // For all Paths
    for (var j in paths[i]) {
      // For all their Layers
      var present = false; // Placeholder for if the Layer is already in the Layers variable
      for (var k in items) {
        // For all Layers in the Layers Variable
        if (items[k].id === paths[i][j].id) {
          // If the currently inspected Layer is the current one in the Layers variable
          present = true; // Layer already present
        }
      }
      if (!present) {
        // If Layer not present
        items.push(paths[i][j]); // Add it to the Layers
      }
    }
  }
  return items;
}

// Check multi inputs for if all their inputs are contained in the paths
export function checkMultiInput(paths) {
  for (var i in paths) {
    // For all Paths
    for (var j in paths[i]) {
      // For all Layers in these Paths
      if (paths[i][j].properties.input.length > 1) {
        // If it has more than one Input
        for (var k in paths[i][j].properties.input) {
          // For all these Inputs
          var inPaths = false; // Placeholder for if the input is contained in the paths
          for (var l in paths) {
            // For all paths
            for (var m in paths[l]) {
              // For all Layers in these Paths
              if (paths[l][m].id === paths[i][j].properties.input[k]) {
                // Check if the current Layer ID matches the inspected Input
                inPaths = true; // Set the Placeholder to true
              }
            }
          }
          if (!inPaths) {
            // If the input is not in the paths
            return false;
          }
        }
      }
    }
  }
  return true;
}
