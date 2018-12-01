export function sortGroups(groups, legendItems) {
  for (var i = 0; i < groups.length - 1; i++) {
    if (groupMustGoToEnd(groups, i)) {
      moveGroupToEnd(groups, i, legendItems);
      i = i - 1;
    }
  }
}

function groupMustGoToEnd(groups, i) {
  for (var j = i + 1; j < groups.length; j++) {
    for (var k in groups[i].layers) {
      if (groups[i].layers[k].name === groups[j].name) {
        return true;
      }
    }
  }
}

function moveGroupToEnd(groups, i, legendItems) {
  for (var j in legendItems) {
    if (j === groups[i].name) {
      var temp = legendItems[j];
      delete legendItems[j];
      legendItems[j] = temp;
    }
  }
  var moved = groups.splice(i, 1);
  groups = groups.push(moved[0]);
}
