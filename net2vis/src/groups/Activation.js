// Deactivates a Group and all Groups that depend on it
export function deactivateGroup(selectedItem, groups) {
  var groupIndices = findDependingGroups(selectedItem, groups); // Get the indices for all groups to be deactivated
  for (var i in groupIndices) {
    // For all of these indices
    groups[groupIndices[i]].active = false; // Deactivate the group
  }
}

// Find and return all groups that depend on a given group
export function findDependingGroups(selectedItem, groups) {
  var indices = findGroupDependenciesByName(selectedItem, groups); // Get all the indices of dependancy
  var unique = indices.filter(onlyUnique); // Remove duplicates from the array
  return unique;
}

// Find all Groups that depend on a given Group
function findGroupDependenciesByName(selectedItem, groups) {
  var deps = []; // Initialize the dependencies Array
  for (var i = 0; i < groups.length; i++) {
    // For all Groups
    if (groups[i].name === selectedItem) {
      // If this is the given Group
      deps.push(i); // Add it to the Dependencies
      for (var j = 0; j < groups.length; j++) {
        // For all Groups
        for (var k = 0; k < groups[j].layers.length; k++) {
          // For all of ther Layers
          if (groups[i].name === groups[j].layers[k].name) {
            // If a layer has the same name as the Group that was given
            var recursion = findGroupDependenciesByName(groups[j].name, groups); // Recursively resolve their dependencies
            for (var l in recursion) {
              // For all recursive deps
              deps.push(recursion[l]); // Add them to the dependencies
            }
          }
        }
      }
    }
  }
  return deps;
}

// Activate a selected Group
export function activateGroup(selectedItem, groups) {
  var groupIndices = findGroupDependents(selectedItem, groups); // Get the indices for all groups to be deactivated
  for (var i in groupIndices) {
    // For all of these indices
    groups[groupIndices[i]].active = true; // Deactivate the group
  }
}

// Find all Groups a given Group depends on
function findGroupDependents(selectedItem, groups) {
  var indices = findGroupDependentsByName(selectedItem, groups); // Get all the indices of dependancy
  var unique = indices.filter(onlyUnique); // Remove duplicates from the array
  return unique;
}

// Find all groups, that the current group depends on
function findGroupDependentsByName(selectedItem, groups) {
  var deps = []; // Initialize the dependents array
  for (var i = 0; i < groups.length; i++) {
    // For all Groups
    if (groups[i].name === selectedItem) {
      // If this is the current Group
      deps.push(i); // Add it to the Dependents
      for (var j = 0; j < groups[i].layers.length; j++) {
        // For all Layers of this Group
        for (var k = 0; k < groups.length; k++) {
          // For all Groups
          if (groups[k].name === groups[i].layers[j].name) {
            // If a Group has the same name as one of the Layers of the current Group
            var recursion = findGroupDependentsByName(groups[k].name, groups); // Recursively resolve their dependents
            for (var l in recursion) {
              // For all recursive deps
              deps.push(recursion[l]); // Add them to the dependencies
            }
          }
        }
      }
      return deps;
    }
  }
}

// Filter function to remove duplicates in the Indices List
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index; // Checks, if this the given value is at position index in the array
}
