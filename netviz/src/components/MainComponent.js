import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../actions'
import LayerList from './layers/NetworkComponent'
import Legend from './legend/LegendComponent'
import Preferences from './preferences/PreferencesComponent';
import Code from './code/CodeComponent'

class Main extends React.Component {

  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
  };
  
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
  };
  
  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.props.actions.moveGroup([xDiff,yDiff]);
  };

  handleScroll = (e) => {
    this.props.actions.zoomGroup(e.deltaY);
  }

  render() {
    return (
      <div id='networkComponent' className='flexvertical'>
        <div className='flexhorizontal'>
          <svg width="100%" height="100%" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onWheel={this.handleScroll}>
            <LayerList />
          </svg> 
          <Preferences />
          <Code />
        </div>
        <Legend />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(undefined, mapDispatchToProps)(Main);