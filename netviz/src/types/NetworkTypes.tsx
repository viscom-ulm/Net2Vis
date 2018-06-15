import { List, Record } from 'immutable';

const networkDefaults = {
  layers: []
};

export interface NetworkState {
  layers?: List<string>;
}

export const NetworkRecord = Record(networkDefaults);

export class Network extends NetworkRecord implements NetworkState {
  layers: List<string>;
  
  constructor(props?: NetworkState) {
    props ? super(props) : super(networkDefaults);
  }
  
  with(params: NetworkState) {
    return this.mergeDeep(params) as this;
  }
}
