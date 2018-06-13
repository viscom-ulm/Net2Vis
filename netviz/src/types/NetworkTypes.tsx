import { List, Record } from 'immutable';
import { Layer } from './LayerTypes';

const networkDefaults = {
    layers: []
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
        console.log(params);
        return this.mergeDeep(params) as this;
    }
}
