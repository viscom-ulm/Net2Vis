import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../actions'
import Network from './network/NetworkComponent'
import Legend from './legend/LegendComponent'
import Preferences from './preferences/PreferencesComponent';
import Code from './code/CodeComponent'

// Main component of the Application that displays all content dependant on the Controls State
class Main extends React.Component {
  componentWillReceiveProps(newProps) {
    const { id } = newProps.match.params;
    this.props.actions.setID(id)
    this.props.actions.loadNetwork(id);
    this.props.actions.loadLayerTypes(id);
    this.props.actions.loadPreferences(id);
  }

  componentWillMount() {
    const { id } = this.props.match.params;
    this.props.actions.setID(id);
  }

  // MouseDown Listener for SVG, recording the Position and registering MouseMove Listener
  handleMouseDown = (e) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY
    }
    document.addEventListener('mousemove', this.handleMouseMove);
    this.props.actions.setPreferenceMode('network');
    if(!e.shiftKey) {
      this.props.actions.deselectLayers();
    } 
  };
  
  // MouseUp Listener for SVG, ending the drag option by removing the MouseMove Listener
  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.coords = {};
  };
  
  // MouseMove Listener, moving the SVG around
  handleMouseMove = (e) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.props.actions.moveGroup([xDiff,yDiff]);
  };

  // Scroll Listener, handling SCG zoom Actions
  handleScroll = (e) => {
    this.props.actions.zoomGroup(e.deltaY);
  }

  // Render the Main Content and call other Elements
  render() {
    return (
      <div id='networkComponent' className='flexvertical'>
        <div className='flexhorizontal'>
          <svg width="100%" height="100%" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onWheel={this.handleScroll}>
            <Network />
          </svg> 
          <Preferences />
          <Code />
        </div>
        <Legend />
      </div>
    );
  }
}

// Mapping the Actions called for SVG manipulation to the Props of this Class
function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(undefined, mapDispatchToProps)(Main);