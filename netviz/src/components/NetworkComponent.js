import React from 'react'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types'

import * as actions from '../actions/Loaders'
import LayerList from './LayerListComponent'

class Network extends React.Component {
  componentWillMount() {
    if (this.props.layers === []) {
      this.props.actions.loadNetwork();
    }
  }

  render() {
    const layers = this.props.layers;
    return (
      <svg width="800" height="600" >
       <LayerList layers={layers} />
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