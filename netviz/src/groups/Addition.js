import * as occurences from './Occurences';
import * as concatenation from './Concatenation';

// A group was added to the Network, so the groups might need to also get grouped
export function groupGroupLayers(groups, group) {
  var newState = JSON.parse(JSON.stringify(groups)); // Copy the groups state
  for (var i in newState) { // Check each Group
    var groupOccur = occurences.findGroupOccurences(group, newState[i]); // If the new Group occurs in it
    for (var j in occurences) { // For all Occurences
      newState[i] = concatenation.concatenateLayers(occurences[j], newState[i], group); // Concatenate the Occurence
    }
  }
  return newState; // Return the new groups state
}