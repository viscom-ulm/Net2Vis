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

// Expand a Layer that depends on a Group 
function expandLayer(expandGroup, position, expansionGroup) {
  var input = common.findInputNode(expansionGroup); // Get the inputNode of the group to be inserted into the other
  var output = common.findOutputNode(expansionGroup); // Get the outputNode of the group to be inserted into the other
  var maxID = common.maxID(expandGroup); // Get the maximum ID of the group to always be bigger
  for (var i in expansionGroup.layers) { // Iterate over all layers in the group to be inserted
    var newLayer = JSON.parse(JSON.stringify(expansionGroup.layers[i])); // Generate a copy of the current layer
    newLayer.id = newLayer.id + maxID; // Set a new and unused ID for the current layer
    if (i === input.inputID) { // If it is the input to the group that expands the other
      newLayer.properties.input = expandGroup.layers[position].properties.input; // The input to this layer is the same as the input of the expanded layer
      for (var j in expandGroup.layers[position].properties.input) { // For all of these inputs
        var currentPreOutput = expandGroup.layers[common.getLayerByID(expandGroup.layers[position].properties.input[j], expandGroup.layers)].properties.output; // Get the outputs
        for (var k in currentPreOutput) { // Iterate over the outputs
          if (currentPreOutput[k] === expandGroup.layers[position].id) { // If the output matches the id of the layer to be expanded
            currentPreOutput[k] = newLayer.id; // Set the output to be the new ID
          }
        }
      }
      for (var l in newLayer.properties.output) { // For all outputs of this layer 
        newLayer.properties.output[l] = newLayer.properties.output[l] + maxID; // The current output gets updated to reflect the new IDs of the group that expands the layer
      }
    } else if (i === output.outputID) { // If it is the input to the group that expands the other
      newLayer.properties.output = expandGroup.layers[position].properties.output; // the putput to this layer is the same as the output of the expanded Layer
      for (var j in expandGroup.layers[position].properties.output) { // Foe all of these outputs
        var currentPreInput = expandGroup.layers[common.getLayerByID(expandGroup.layers[position].properties.output[j], expandGroup.layers)].properties.input; // Get the Inputs
        for (var k in currentPreOutput) { // Iterate over the Inputs
          if (currentPreInput[k] === expandGroup.layers[position].id) { // If the input matches the id of the Layer to be expanded
            currentPreInput[k] = newLayer.id; // Set teh input to be the new ID
          }
        }
      }
      for (var l in newLayer.properties.input) { // For all inputs of this Layer
        newLayer.properties.input[l] = newLayer.properties.input[l] + maxID; // The current input gets updated to reflect the new IDs of the group that expands the layer
      }
    } else { // Neither in nor output of the group that expands the layer
      for (var l in newLayer.properties.output) { // For all outputs
        newLayer.properties.output[l] = newLayer.properties.output[l] + maxID; // The current output gets updated to reflect the new IDs of the group that expands the Layer
      }
      for (var l in newLayer.properties.input) { // Fro all Inputs
        newLayer.properties.input[l] = newLayer.properties.input[l] + maxID;// The current input gets updated to reflect the new IDs of the group that expands the Layer
      }
    }
    expandGroup.layers.push(newLayer); // Add the new layer
  }
  expandGroup.layers.splice(position, 1); // Remove the expanded Layer
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