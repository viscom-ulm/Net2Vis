// Sort the Groups based on their dependancies
export function sortGroups(groups, legendItems) {
  for (var i = 0; i < groups.length - 1; i++) {
    // Go over all groups
    if (groupMustGoToEnd(groups, i)) {
      // Check if the group should be moved to the end
      moveGroupToEnd(groups, i, legendItems); // Move the Group to the end
      i = i - 1; // Do not skip a group
    }
  }
}

// Check if a Group has to go to the end of the list
function groupMustGoToEnd(groups, i) {
  for (var j = i + 1; j < groups.length; j++) {
    // For all groups after this group
    for (var k in groups[i].layers) {
      // For all the layers of the original Group
      if (groups[i].layers[k].name === groups[j].name) {
        // If the layer is the currently inspected Group
        return true; // The Group that was provided needs to be moved
      }
    }
  }
}

// Move a Group and the Legend Item to the End
function moveGroupToEnd(groups, i, legendItems) {
  for (var j in legendItems) {
    // For all Legend Items
    if (j === groups[i].name) {
      // If it is the searched one
      var temp = legendItems[j]; // Save it
      delete legendItems[j]; // Delete it from the List
      legendItems[j] = temp; // Add it to the List
    }
  }
  var moved = groups.splice(i, 1); // Get the Group to be moved out of the Groups list
  groups = groups.push(moved[0]); // Add it back in at the end
}
