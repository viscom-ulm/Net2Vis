import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import EdgeComponent from '../network/EdgeComponent';

import * as paths from '../../paths';

class ComplexLegendItem extends React.Component {
  render() {
    var settings = this.props.layer_types_settings[this.props.layer.layer.name];
    var color = settings.color;
    const extreme_dimensions = {max_size: this.props.legend_preferences.layer_height.value, min_size: this.props.legend_preferences.layer_height.value}; // Get the Extremes of the Display Size for the Glyphs
    const pathableLayer = {
      layer: {
        id: parseInt(this.props.layer.id, 10),
        properties: {
          input: this.props.layer.layer.properties.input,
          output: this.props.layer.layer.properties.output
        }
      },
      width: this.props.legend_preferences.layer_width.value,
      y: this.props.layer.y
    }
    const pathData = paths.calculateGlyphPath(extreme_dimensions, [extreme_dimensions.max_size,extreme_dimensions.max_size], pathableLayer, this.props.edges); // Calculate the Path of the Layer
    const current_edges = paths.getOutgoingEdges(pathableLayer, this.props.edges); // Get relevant Edges going out from the current Layer
    const style = {
      fill: color,
      stroke: this.props.active ? 'black' : 'lightgrey',
      stokeLinejoin: 'round'
    };  
    return(
      <g transform={`translate(${this.props.legend_preferences.complex_spacing.value + this.props.legend_preferences.layer_width.value + this.props.position}, ${-this.props.height/2})`}>
        {current_edges.map((edge, index) =>
          <EdgeComponent edge={edge.points} layer_max_height={this.props.legend_preferences.layer_height.value} horizontal_spacing={this.props.legend_preferences.layers_spacing_horizontal} color={this.props.active ? 'black' : 'lightgrey'} key={index}/>
        )}
        <g transform={`translate(${this.props.layer.x - (this.props.legend_preferences.layer_width.value/2.0)}, ${this.props.layer.y})`}>
          <path d={pathData} style={style} onClick={() => this.props.action(this.props.layer.layer.name)}/>
        </g>
      </g>
    ) 
  }
}

// PropTypes of this Class
ComplexLegendItem.propTypes = {
  layer_types_settings: PropTypes.object.isRequired,
  legend_preferences: PropTypes.object.isRequired
}

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    layer_types_settings: state.layer_types_settings,
    legend_preferences: state.legend_preferences
  };
}

export default connect(mapStateToProps, undefined)(ComplexLegendItem);
