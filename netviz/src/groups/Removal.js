import * as common from './Common';

// Deletes a selected Group
export function deleteGroup(selectedItem, groups) {
  var deletionGroup = getGroupByName(selectedItem, groups); // Get the Group that is to be deleted
  expandSuperGroups(deletionGroup.group, groups); // Expand Groups that depend on that Group
  groups.splice(deletionGroup.id, 1); // Remove the Group
}

// Expand Groups that depend on a given group
function expandSuperGroups(group, groups) {
  for (var i in groups) { // For all Groups
    for (var j in groups[i].layers) { // And all their layers
      if (groups[i].layers[j].name === group.name) { // If the layer is the one to be expanded  
        expandLayer(groups[i], j, group); // Expand the Layer
      }
    }
  }
}

function expandLayer(expandGroup, position, expansionGroup) {
  var input = common.findInputNode(expansionGroup);
  var output = common.findOutputNode(expansionGroup);
  var maxID = common.maxID(expandGroup) + 1;
  for (var i in expansionGroup.layers) {
    var newLayer = JSON.parse(JSON.stringify(expansionGroup.layers[i]));
    newLayer.id = newLayer.id + maxID;
    if (i === input.inputID) {
      newLayer.properties.input = expandGroup.layers[position].properties.input;
      for (var j in expandGroup.layers[position].properties.input) {
        var currentPreOutput = expandGroup.layers[common.getLayerByID(expandGroup.layers[position].properties.input[j], expandGroup.layers)].properties.output;
        for (var k in currentPreOutput) {
          if (currentPreOutput[k] === expandGroup.layers[position].id) {
            currentPreOutput[k] = newLayer.id;
          }
        }
      }
      for (var l in newLayer.properties.output) {
        newLayer.properties.output[l] = newLayer.properties.output[l] + maxID;
      }
    } else if (i === output.outputID) {
      newLayer.properties.output = expandGroup.layers[position].properties.output;
      for (var j in expandGroup.layers[position].properties.output) {
        var currentPreInput = expandGroup.layers[common.getLayerByID(expandGroup.layers[position].properties.output[j], expandGroup.layers)].properties.input;
        for (var k in currentPreOutput) {
          if (currentPreInput[k] === expandGroup.layers[position].id) {
            currentPreInput[k] = newLayer.id;
          }
        }
      }
      for (var l in newLayer.properties.input) {
        newLayer.properties.input[l] = newLayer.properties.input[l] + maxID;
      }
    } else {
      for (var l in newLayer.properties.output) {
        newLayer.properties.output[l] = newLayer.properties.output[l] + maxID;
      }
      for (var l in newLayer.properties.input) {
        newLayer.properties.input[l] = newLayer.properties.input[l] + maxID;
      }
    }
    expandGroup.layers.push(newLayer);
  }
  expandGroup.layers.splice(position, 1);
}

// Find and return all groups that depend on a given group
export function findGroupDependants(selectedItem, groups) {
  var indices = findGroupStructureByName(selectedItem, groups); // Get all the indices of dependancy
  var unique = indices.filter(onlyUnique); // Remove duplicates from the array
  return unique;
}

// Find a group by its name and check its dependencies
function findGroupStructureByName(selectedItem, groups) {
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

// Get a group by its name
export function getGroupByName(name, groups) {
  for (var i in groups) { // For all group
    if (name === groups[i].name) { // If the names match
      return {id: i, group: groups[i]}; // Return the group
    }
  }
}