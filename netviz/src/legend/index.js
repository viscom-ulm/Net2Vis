export function calculateXPosition(element, layerTypesSettings) {
  var iterator = 0;
  for (var i in layerTypesSettings) {
    if (i === element) {
      return iterator * 30;
    }
    iterator = iterator + 1;
  }
}