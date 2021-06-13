import * as common from './Common';

export function addSplitLayers(network) {
  var net = network;
  replaceMultiOutLayers(net);
  return net;
}

function replaceMultiOutLayers(network) {
  for (var layer in network.layers) {
    var outputs = network.layers[layer].properties.output;
    if (outputs.length > 1) {
      var newID = common.maxID(network) + 1;
      var newLayer = {
        id: newID,
        name: 'Split',
        properties: {
          dimensions: {
            in: network.layers[layer].properties.dimensions.out,
            out: network.layers[layer].properties.dimensions.out,
          },
          input: [network.layers[layer].id],
          output: outputs,
          properties: {},
        },
      };
      network.layers[layer].properties.output = [newID];
      for (var output in outputs) {
        var inputs =
          network.layers[common.getLayerByID(outputs[output], network.layers)]
            .properties.input;
        for (var input in inputs) {
          if (inputs[input] === network.layers[layer].id) {
            inputs[input] = newID;
          }
        }
      }
      network.layers.push(newLayer);
    }
  }
}
