import * as occurences from "./Occurences";
import * as concatenation from "./Concatenation";

// A group was added to the Network, so the groups might need to also get grouped
export function addGroup(groups, group) {
  for (var i in groups) {
    // Check each Group
    var groupOccur = occurences.findGroupOccurences(group, groups[i]); // If the new Group occurs in it
    for (var j in groupOccur) {
      // For all Occurences
      groups[i].layers = concatenation.concatenateLayers(
        groupOccur[j],
        groups[i],
        group
      ).layers; // Concatenate the Occurence
    }
  }
  groups.push(group); // Add the new Group to the existing ones
}
