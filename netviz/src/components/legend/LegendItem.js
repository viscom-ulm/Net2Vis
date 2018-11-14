import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import ComplexLegendItem from './ComplexLegendItem';

class LegendItem extends React.Component {
  render() {
    const style = {
      fill: this.props.representation.layer.representer.setting.color,
      stroke: 'black',
      stokeLinejoin: 'round'
    };  
    if (this.props.representation.layer.trivial) {
      return (
        <rect x={this.props.representation.position} y='10' width={this.props.legend_preferences.layer_width.value} height={this.props.legend_preferences.layer_height.value} style={style} onClick={() => this.props.action(this.props.representation.layer.representer.name)}/>
      ) 
    } else {
      const graph = this.props.representation.layer.graph;
      var nodes = [];
      graph.nodes().forEach(function(e) {
        nodes.push(graph.node(e));
      });
      var edges = [];
      graph.edges().forEach(function(e) {
        edges.push({v: e.v, w: e.w, points: graph.edge(e)});
      });
      return (
        <g>
          <rect x={this.props.representation.position} y='10' width={this.props.legend_preferences.layer_width.value} height={this.props.legend_preferences.layer_height.value} style={style} onClick={() => this.props.action(this.props.representation.layer.representer.name)}/>
          {nodes.map((layer, i) => 
            <ComplexLegendItem layer={layer} edges={edges} position={this.props.representation.position} key={i}/>
          )}
        </g>
      ) 
    }
  }
}

// PropTypes of this Class
LegendItem.propTypes = {
  layer_types_settings: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  legend_preferences: PropTypes.object.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    layer_types_settings: state.layer_types_settings,
    groups: state.groups,
    legend_preferences: state.legend_preferences
  };
}

export default connect(mapStateToProps, undefined)(LegendItem);
