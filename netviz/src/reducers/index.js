import { combineReducers } from 'redux';
import network from './NetworkReducer';
import group_transform from './TransformReducer';
import display from './DisplayReducer'

export default combineReducers({
    network,
    group_transform,
    display
})
