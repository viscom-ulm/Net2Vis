// Get all paths from a node s to node d in the network
export function allPaths(s, d, network) {
  var paths = []; // Initially, no Paths found
  traverseWay(s, d, network, [s], paths); // Traverse the way from s on
  return paths;
}

// Traverse the Network from node u on
function traverseWay(u, d, network, path, paths) {
  if (u.id === d.id) { // If u is the destination
    paths.push(path); // Add the path to the pathes
  } else if (u.properties.output.length === 0) { // If an output node has been reached
    paths.push(path); // Add the uncomplete path to the pathes
  } else { // Way goes on
    for (var i = 0; i < u.properties.output.length; i++) { // For all Outputs of the current node
      if (i === 0) { // For the first of all outputs
        var nextLayer = network.layers[u.properties.output[i]]; // Get the next Layer
        path.push(nextLayer); // Add it to the current path
        traverseWay(nextLayer, d, network, path, paths); // Go further along the way
      } else { // Not the first output of the current node
        var newPath = JSON.parse(JSON.stringify(path)); // Copy the path, since a new path has been found
        var nextWay = network.layers[u.properties.output[i]]; // Get the next Layer along this way
        newPath.push(nextWay); // Add the new Layer to the path
        traverseWay(nextWay, d, network, newPath, paths); // Go along this alternate way
      }
    }
  }
}

// Reduce the paths to just every layer they contain once
export function reducePaths(paths) {
  var items = []; // No Layers initially
  for (var i in paths) { // For all Paths
    for (var j in paths[i]) { // For all their Layers
      var present = false; // Placeholder for if the Layer is already in the Layers variable
      for (var k in items) { // For all Layers in the Layers Variable
        if (items[k].id === paths[i][j].id) { // If the currently inspected Layer is the current one in the Layers variable
          present = true; // Layer already present
        }
      }
      if (!present) { // If Layer not present
        items.push(paths[i][j]); // Add it to the Layers
      }
    }
  }
  return items;
}