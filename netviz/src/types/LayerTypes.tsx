import { Record } from 'immutable';

const layerDefaults = {
  id: 0,
  name: '',
  properties: ''
};

export interface LayerState {
  id?: number;
  name?: string;
  properties?: string;
}

export const LayerRecord = Record(layerDefaults);

export class Layer extends LayerRecord implements LayerState {
  id: number;
  name: string;
  properties: string;
  
  constructor(props?: LayerState) {
    props ? super(props) : super(layerDefaults);
  }

  with(params: LayerState) {
    return this.mergeDeep(params) as this;
  }
}
