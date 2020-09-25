import * as common from "./Common";

export function hideLayers(network, layerTypes) {
  var net = network;
  for (var key in layerTypes) {
    var layerType = layerTypes[key];
    if (layerType.hidden) {
      hideLayersByType(key, net);
    }
  }
  return net;
}

function hideLayersByType(key, network) {
  var layer = 0;
  while (layer < network.layers.length) {
    if (key === network.layers[layer].name) {
      var inputs = network.layers[layer].properties.input;
      var outputs = network.layers[layer].properties.output;
      for (var input in inputs) {
        var outOfIn =
          network.layers[common.getLayerByID(inputs[input], network.layers)]
            .properties.output;
        for (var outIn in outOfIn) {
          if (outOfIn[outIn] === network.layers[layer].id) {
            outOfIn.splice(outIn, 1);
          }
        }
        for (var newOut in outputs) {
          outOfIn.push(outputs[newOut]);
        }
      }
      for (var output in outputs) {
        var inOfOut =
          network.layers[common.getLayerByID(outputs[output], network.layers)]
            .properties.input;
        for (var inOut in inOfOut) {
          if (inOfOut[inOut] === network.layers[layer].id) {
            inOfOut.splice(inOut, 1);
          }
        }
        for (var newIn in inputs) {
          inOfOut.push(inputs[newIn]);
        }
      }
      network.layers.splice(layer, 1);
    } else {
      layer = layer + 1;
    }
  }
}
