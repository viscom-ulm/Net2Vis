import * as tinycolor from 'tinycolor2';

export function generateNewColor(layerTypes) {
  var saturation = 0.8;
  var value = 0.7;
  var colors = [];
  for (var key in layerTypes) {
    colors.push(tinycolor(layerTypes[key].color));
  }
  if (colors.length === 0) {
    var color = tinycolor({h: 210, s: saturation, v: value});
    return color.toHexString();
  }
  colors = colors.map(x => x.toHsv());
  colors = colors.map(x => x.h);
  colors.sort(function(a, b) {
    return a - b;
  });
  console.log(colors)
  var hue = findOptimalHue(colors);
  console.log(hue)
  var color = tinycolor({h: hue, s: saturation, v: value});
  return color.toHexString();
}

function findOptimalHue(colors) {
  var hue = 0;
  var maxDistance = 0;
  var distance = 0;
  for (var i in colors) {
    if (parseInt(i) === (colors.length - 1)) {
      distance = colors[0] + 360 - colors[i];
      if (distance > maxDistance) {
        maxDistance = distance;
        hue = (colors[i] + (distance / 2.0)) % 360;
      }
    } else {
      distance = colors[parseInt(i) + 1] - colors[i];
      if (distance > maxDistance) {
        maxDistance = distance;
        hue = colors[i] + (distance / 2.0);
      }
    }
  }
  return hue;
}