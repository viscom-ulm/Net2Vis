import * as constants from '../constants';
import { NetworkState, LayerState } from '../types';

export interface Action<T> {
  type: string;
  payload: T;
}  

export type NetworkAction = Action<NetworkState>;
export type LayerAction = Action<LayerState>;

const getNetwork = (
  network: NetworkState
): NetworkAction => ({
  type: constants.GET_NETWORK_ACTION,
  payload: network
});

const addLayer = (
  layer: LayerState
): LayerAction => ({
  type: constants.GET_LAYER_ACTION,
  payload: layer
});

export { getNetwork,
         addLayer };