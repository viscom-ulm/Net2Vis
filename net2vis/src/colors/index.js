import * as tinycolor from "tinycolor2";

// Get the used color Palette
export function getColorPalette() {
  var palette = [
    "#2196F3",
    "#8BC34A",
    "#F44336",
    "#795548",
    "#FFEB3B",
    "#9C27B0",
    "#9E9E9E",
    "#009688",
    "#FF9800",
    "#3F51B5",
    "#4CAF50",
    "#03A9F4",
    "#E91E63",
    "#00BCD4",
    "#FFC107",
    "#673AB7",
    "#607D8B",
  ];
  return palette;
}

// Get the used color Palette
export function getBlindColorPalette() {
  var palette = [
    "#000000",
    "#E69F00",
    "#56B4E9",
    "#009E73",
    "#F0E442",
    "#0072B2",
    "#D55E00",
    "#CC79A7",
  ];
  return palette;
}

// Get the used color Palette
export function getTextures() {
  var textures = [
    "url(#muster1)",
    "url(#muster2)",
    "url(#muster3)",
    "url(#muster4)",
    "url(#muster5)",
    "url(#muster6)",
    "url(#muster7)",
    "url(#muster8)",
    "url(#muster9)",
    "url(#muster10)",
    "url(#muster11)",
    "url(#muster12)",
  ];
  return textures;
}

// Generate a new Texture
export function generateNewTexture(layerTypes) {
  var textures = getTextures();
  var index = Object.keys(layerTypes).length % textures.length;
  return textures[index];
}

// Generate a new Color based on the currently set mode
export function generateNewColor(layerTypes, mode) {
  if (mode === "Palette") {
    return generatePaletteColor(layerTypes);
  } else if (mode === "Interpolation") {
    return generateInterpolatedColor(layerTypes);
  } else if (mode === "Color Blind") {
    return generateBlindPaletteColor(layerTypes);
  }
}

// Generate a new color using the color palette
function generatePaletteColor(layerTypes) {
  var palette = getColorPalette();
  var index = Object.keys(layerTypes).length % palette.length;
  return palette[index];
}

// Generate a new color using the color palette
function generateBlindPaletteColor(layerTypes) {
  var palette = getBlindColorPalette();
  var index = Object.keys(layerTypes).length % palette.length;
  return palette[index];
}

// Generate a new color that is different to all existing ones
function generateInterpolatedColor(layerTypes) {
  var saturation = 0.8; // Fixed Saturation Value
  var value = 0.7; // Fixed color Value
  var colors = []; // Placeholder for colors that are already present
  for (var key in layerTypes) {
    // For all LayerTypes
    colors.push(tinycolor(layerTypes[key].color)); // Add their color to the present colors
  }
  if (colors.length === 0) {
    // If no colors are there
    var color = tinycolor({ h: 210, s: saturation, v: value }); // Set the initial color
    return color.toHexString(); // Return it as hex
  }
  colors = colors.map((x) => x.toHsv()); // Map all the colors to hsv
  colors = colors.map((x) => x.h); // Extract the h value
  colors.sort(function (a, b) {
    // Sort them
    return a - b; // Ascending
  });
  var hue = findOptimalHue(colors); // Find a hue value that is different to all others
  var newColor = tinycolor({ h: hue, s: saturation, v: value }); // Make a color with this hue
  return newColor.toHexString(); // Return it as hex
}

// Returns a hue value that has maximum absolute distance to all other hue values
function findOptimalHue(colors) {
  var hue = 0; // Initialize the new hue
  var maxDistance = 0; // Initialize the maximum distance
  var distance = 0; // Initialize the current distance
  for (var i in colors) {
    // Check all colors
    if (parseInt(i) === colors.length - 1) {
      // If this is the last color
      distance = colors[0] + 360 - colors[i]; // Calculate the circular distance to the first
      if (distance > maxDistance) {
        // If this distance is maximal
        maxDistance = distance; // Set the new maxDistance
        hue = (colors[i] + distance / 2.0) % 360; // Set the hue to be between the last and the first color
      }
    } else {
      // Not the last color
      distance = colors[parseInt(i) + 1] - colors[i]; // Calculate the distance to the next color
      if (distance > maxDistance) {
        // If this is the max distance
        maxDistance = distance; // Set the new maxDistance
        hue = colors[i] + distance / 2.0; // Set the hue value to be between these two colors
      }
    }
  }
  return hue;
}

// Darken a given color
export function darkenColor(color) {
  var darkenedColor = tinycolor(color); // Get the color to be darkened
  darkenedColor.darken(); // Darken the color
  return darkenedColor.toHexString(); // Return it as Hex
}

export function getFillColor(set, noColors, isGroup) {
  if (noColors) {
    return set.texture;
  } else if (isGroup) {
    return darkenColor(set.color);
  } else {
    return set.color;
  }
}

export function getStrokeColor(set, noColors, isGroup, selected, isDense) {
  if (selected) {
    return "red";
  } else if (noColors) {
    return "grey";
  } else if (isGroup || isDense) {
    return set.color;
  } else {
    return darkenColor(set.color);
  }
}
