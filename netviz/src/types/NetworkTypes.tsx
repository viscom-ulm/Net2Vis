import { List, Record } from 'immutable';

import { Layer } from './LayerTypes';

const networkDefaults = {
  layers: List()
};

export interface NetworkState {
  layers?: List<Layer>;
}

export const NetworkRecord = Record(networkDefaults);

export class Network extends NetworkRecord implements NetworkState {
  layers: List<Layer>;
  
  constructor(props?: NetworkState) {
    props ? super(props) : super(networkDefaults);
  }
  
  with(params: NetworkState) {

    let newLayers = List<Layer>();
    if (params.layers) {
      for (var i in params.layers) {
        if (params.layers.hasOwnProperty(i)) {
          var lay = new Layer().with(params.layers[i]);
          newLayers = newLayers.push(lay);
        }
      }
    }
    return this.mergeDeep({layers: newLayers}) as this;
  }
}
