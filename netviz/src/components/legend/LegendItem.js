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
        <g>
          <text textAnchor='middle' dominantBaseline='hanging' x={this.props.representation.position + (this.props.representation.layer.width / 2.0)} y={this.props.legend_preferences.layer_height.value}>{this.props.representation.layer.representer.setting.alias}</text>
          <rect x={this.props.representation.position} y='0' width={this.props.legend_preferences.layer_width.value} height={this.props.legend_preferences.layer_height.value} style={style} onClick={() => this.props.action(this.props.representation.layer.representer.name)}/>
        </g>
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
          <text textAnchor='middle' dominantBaseline='hanging' x={this.props.representation.position + (this.props.representation.layer.width / 2.0)} y={(this.props.representation.layer.height / 2.0) + (this.props.legend_preferences.layer_height.value / 2.0)}>{this.props.representation.layer.representer.setting.alias}</text>
          <rect x={this.props.representation.position} y='0' width={this.props.legend_preferences.layer_width.value} height={this.props.legend_preferences.layer_height.value} style={style} onClick={() => this.props.action(this.props.representation.layer.representer.name)}/>
          <text textAnchor='middle' dominantBaseline='middle' x={this.props.representation.position + this.props.legend_preferences.layer_width.value + (this.props.legend_preferences.complex_spacing.value / 2.0)} y={this.props.legend_preferences.layer_height.value / 2.0}>=</text>
          {nodes.map((layer, i) => 
            <ComplexLegendItem layer={layer} edges={edges} position={this.props.representation.position} height={graph.graph().height} key={i} action={this.props.action}/>
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
