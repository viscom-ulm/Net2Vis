import * as common from './Common';

export function hideLayers(network, layerTypes) {
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
  for (var layer in network.layers) {
    if (key === network.layers[layer].name) {
      var inputs = network.layers[layer].properties.input;
      var outputs = network.layers[layer].properties.output;
      for (var input in inputs) {
        network.layers[common.getLayerByID(inputs[input], network.layers)].properties.output = outputs;
      }
      for (var output in outputs) {
        network.layers[common.getLayerByID(outputs[output], network.layers)].properties.input = inputs;
      }
      network.layers.splice(layer, 1);
    }
  }
}
