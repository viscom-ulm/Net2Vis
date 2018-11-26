// Find and return all groups that depend on a given group
export function findGroupDependants(selectedItem, groups) {
  var indices = findGroupByName(selectedItem, groups); // Get all the indices of dependancy
  var unique = indices.filter(onlyUnique); // Remove duplicates from the array
  return unique;
}

// Find a group by its name and check its dependencies
function findGroupByName(selectedItem, groups) {
  for (var i in groups) { // For all groups
    if (selectedItem === groups[i].name) { // Check if the name is the one searched for
      var deps = resolveDependencies(selectedItem, groups); // Resolve its dependencies
      return [i].concat(deps); // Return all the dependencies and the index of the fround group
    }
  }
}

// Resolve the dependencies of a group
function resolveDependencies(groupName, groups) {
  var deps = []; // Initially, no dependencies
  for (var i in groups) { // For all Groups
    for (var j in groups[i].layers) { // For all Layers of each Group
      if (groupName === groups[i].layers[j].name) { // The group depends on the other group
        deps.push(i); // Add the group index to the list
        deps.concat(resolveDependencies(groups[i].name, groups)); // Resolve the dependencies of this newly added Group
      }
    }
  }
  return deps;
}

// Filter function to remove duplicates in the Indices List
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index; // Checks, if this the given value is at position index in the array
}