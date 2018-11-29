import * as tinycolor from 'tinycolor2';

// Generate a new color that is different to all existing ones
export function generateNewColor(layerTypes) {
  var saturation = 0.8; // Fixed Saturation Value
  var value = 0.7; // Fixed color Value
  var colors = []; // Placeholder for colors that are already present
  for (var key in layerTypes) { // For all LayerTypes
    colors.push(tinycolor(layerTypes[key].color)); // Add their color to the present colors
  }
  if (colors.length === 0) { // If no colors are there
    var color = tinycolor({h: 210, s: saturation, v: value}); // Set the initial color
    return color.toHexString(); // Return it as hex
  }
  colors = colors.map(x => x.toHsv()); // Map all the colors to hsv
  colors = colors.map(x => x.h); // Extract the h value
  colors.sort(function(a, b) { // Sort them
    return a - b; // Ascending
  });
  var hue = findOptimalHue(colors); // Find a hue value that is different to all others
  var newColor = tinycolor({h: hue, s: saturation, v: value}); // Make a color with this hue
  return newColor.toHexString(); // Return it as hex
}

// Returns a hue value that has maximum absolute distance to all other hue values
function findOptimalHue(colors) {
  var hue = 0; // Initialize the new hue
  var maxDistance = 0; // Initialize the maximum distance
  var distance = 0; // Initialize the current distance
  for (var i in colors) { // Check all colors
    if (parseInt(i) === (colors.length - 1)) { // If this is the last color
      distance = colors[0] + 360 - colors[i]; // Calculate the circular distance to the first
      if (distance > maxDistance) { // If this distance is maximal
        maxDistance = distance; // Set the new maxDistance
        hue = (colors[i] + (distance / 2.0)) % 360; // Set the hue to be between the last and the first color
      }
    } else { // Not the last color
      distance = colors[parseInt(i) + 1] - colors[i]; // Calculate the distance to the next color
      if (distance > maxDistance) { // If this is the max distance
        maxDistance = distance; // Set the new maxDistance
        hue = colors[i] + (distance / 2.0); // Set the hue value to be between these two colors
      }
    }
  }
  return hue;
}