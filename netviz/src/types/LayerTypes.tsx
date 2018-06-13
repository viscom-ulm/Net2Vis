import { Record } from 'immutable';

const layerDefaults = {
    id: 0
};

export interface LayerState {
    id?: number;
}

export const LayerRecord = Record(layerDefaults);

export class Layer extends LayerRecord implements LayerState {
    id: number;

    constructor(props?: LayerState) {
        props ? super(props) : super(layerDefaults);
    }

    with(params: LayerState) {
        console.log(params);
        return this.mergeDeep(params) as this;
    }
}
