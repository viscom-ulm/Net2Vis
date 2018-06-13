import { Record } from 'immutable';

const layerDefaults = {
  id: 0,
  name: ''
};

export interface LayerState {
  id?: number;
  name?: string;
}

export const LayerRecord = Record(layerDefaults);

export class Layer extends LayerRecord implements LayerState {
  id: number;
  name: string;
  
  constructor(props?: LayerState) {
    props ? super(props) : super(layerDefaults);
  }
}
