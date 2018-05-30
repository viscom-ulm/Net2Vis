import * as constants from '../constants';
import { NetworkState } from '../types';

export interface Action<T> {
    type: string;
    payload: T;
}  

export type NetworkAction = Action<NetworkState>;

const getNetwork = (
    network: NetworkState
): NetworkAction => ({
    type: constants.GET_NETWORK_ACTION,
    payload: network
});

export { getNetwork };