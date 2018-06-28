import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types'

import * as actions from '../actions'
import LayerList from './LayerListComponent'

class Network extends React.Component {

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

  componentWillMount() {
    if (this.props.layers === []) {
      this.props.actions.loadNetwork();
    }
  }

  render() {
    return (
      <svg width="100%" height="100%" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onWheel={this.handleScroll}>
        <LayerList />
      </svg> 
    );
  }
}

Network.propTypes = {
  layers: PropTypes.array.isRequired
}

function mapStateToProps(state, ownProps) {
  if (state.network.layers) {
    return {
      layers: state.network.layers
    };
  } else {
    return {
      layers: []
    };
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Network);