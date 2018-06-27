import { combineReducers } from 'redux';
import network from './NetworkReducer';
import group_transform from './TransformReducer';

export default combineReducers({
    network,
    group_transform
})
