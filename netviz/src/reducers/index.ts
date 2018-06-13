import { combineReducers } from 'redux';

import networkReducer from './NetworkReducer';
import { StoreProps } from '../types';

export const combinedReducers = combineReducers<StoreProps>({
  network: networkReducer
});

export { initialNetworkState } from './NetworkReducer';
