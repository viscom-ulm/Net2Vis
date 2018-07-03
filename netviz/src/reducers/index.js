import { combineReducers } from 'redux';
import network from './NetworkReducer';
import code from './CodeReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer'

export default combineReducers({
    network,
    code,
    group_transform,
    display
})
