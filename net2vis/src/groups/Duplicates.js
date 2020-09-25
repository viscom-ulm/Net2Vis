// Check if a group already exists
export function groupDoesExist(group, groups) {
  for (var i in groups) {
    // For all Groups
    if (groupsEqualLayers(group, groups[i])) {
      // Check if the group is equal to the new group
      return true;
    }
  }
  return false;
}

// Chekch if two groups are equal
function groupsEqualLayers(group1, group2) {
  if (group1.layers.length === group2.layers.length) {
    // Only possible if the groups have the same number of layers
    for (var i in group1.layers) {
      // For all layers in the Group
      if (group1.layers[i].name === group2.layers[i].name) {
        // Layers must have the same name
        if (
          group1.layers[i].properties.input.length !==
          group2.layers[i].properties.input.length
        ) {
          // Groups must have the same number of inputs
          return false;
        }
        if (
          group1.layers[i].properties.output.length !==
          group2.layers[i].properties.output.length
        ) {
          // Groups must have the same number of outputs
          return false;
        }
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
  return true;
}
