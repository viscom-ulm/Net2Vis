import * as common from "./Common";
import * as layerCommon from "../layers/Common";

// Deletes a selected Group
export function deleteGroup(selectedItem, groups) {
  var deletionGroup = getGroupByName(selectedItem, groups); // Get the Group that is to be deleted
  groups.splice(deletionGroup.id, 1); // Remove the Group
  expandSuperGroups(deletionGroup.group, groups); // Expand Groups that depend on that Group
}

// Expand Groups that depend on a given group
function expandSuperGroups(group, groups) {
  for (var i in groups) {
    // For all Groups
    for (var j = 0; j < groups[i].layers.length; j++) {
      // And all their layers
      if (groups[i].layers[j].name === group.name) {
        // If the layer is the one to be expanded
        expandLayer(groups[i], j, group); // Expand the Layer
        j = 0; // Need to go back to be sure not to skip Layers
      }
    }
  }
}

// Expand a Layer that depends on a Group
function expandLayer(expandGroup, position, expansionGroup) {
  var input = common.findInputNode(expansionGroup); // Get the inputNode of the group to be inserted into the other
  var output = common.findOutputNode(expansionGroup); // Get the outputNode of the group to be inserted into the other
  var maxID = common.maxID(expandGroup) + 1; // Get the maximum ID of the group to always be bigger
  for (var i in expansionGroup.layers) {
    // Iterate over all layers in the group to be inserted
    var newLayer = JSON.parse(JSON.stringify(expansionGroup.layers[i])); // Generate a copy of the current layer
    newLayer.id = newLayer.id + maxID; // Set a new and unused ID for the current layer
    if (i === input.inputID) {
      // If it is the input to the group that expands the other
      newLayer.properties.input = expandGroup.layers[position].properties.input; // The input to this layer is the same as the input of the expanded layer
      for (var j in expandGroup.layers[position].properties.input) {
        // For all of these inputs
        var currentPreOutput =
          expandGroup.layers[
            layerCommon.getLayerByID(
              expandGroup.layers[position].properties.input[j],
              expandGroup.layers
            )
          ].properties.output; // Get the outputs
        for (var k in currentPreOutput) {
          // Iterate over the outputs
          if (currentPreOutput[k] === expandGroup.layers[position].id) {
            // If the output matches the id of the layer to be expanded
            currentPreOutput[k] = newLayer.id; // Set the output to be the new ID
          }
        }
      }
      for (var l in newLayer.properties.output) {
        // For all outputs of this layer
        newLayer.properties.output[l] = newLayer.properties.output[l] + maxID; // The current output gets updated to reflect the new IDs of the group that expands the layer
      }
    } else if (i === output.outputID) {
      // If it is the input to the group that expands the other
      newLayer.properties.output =
        expandGroup.layers[position].properties.output; // the putput to this layer is the same as the output of the expanded Layer
      for (var m in expandGroup.layers[position].properties.output) {
        // Foe all of these outputs
        var currentPreInput =
          expandGroup.layers[
            layerCommon.getLayerByID(
              expandGroup.layers[position].properties.output[m],
              expandGroup.layers
            )
          ].properties.input; // Get the Inputs
        for (var n in currentPreInput) {
          // Iterate over the Inputs
          if (currentPreInput[n] === expandGroup.layers[position].id) {
            // If the input matches the id of the Layer to be expanded
            currentPreInput[n] = newLayer.id; // Set teh input to be the new ID
          }
        }
      }
      for (var o in newLayer.properties.input) {
        // For all inputs of this Layer
        newLayer.properties.input[o] = newLayer.properties.input[o] + maxID; // The current input gets updated to reflect the new IDs of the group that expands the layer
      }
    } else {
      // Neither in nor output of the group that expands the layer
      for (var p in newLayer.properties.output) {
        // For all outputs
        newLayer.properties.output[p] = newLayer.properties.output[p] + maxID; // The current output gets updated to reflect the new IDs of the group that expands the Layer
      }
      for (var q in newLayer.properties.input) {
        // Fro all Inputs
        newLayer.properties.input[q] = newLayer.properties.input[q] + maxID; // The current input gets updated to reflect the new IDs of the group that expands the Layer
      }
    }
    expandGroup.layers.push(newLayer); // Add the new layer
  }
  expandGroup.layers.splice(position, 1); // Remove the expanded Layer
}

// Get a group by its name
export function getGroupByName(name, groups) {
  for (var i in groups) {
    // For all group
    if (name === groups[i].name) {
      // If the names match
      return { id: i, group: groups[i] }; // Return the group
    }
  }
}
