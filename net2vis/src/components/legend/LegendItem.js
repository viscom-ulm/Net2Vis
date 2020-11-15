import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import * as legend from "../../legend";
import * as colors from "../../colors";

import ComplexLegendItem from "./ComplexLegendItem";

class LegendItem extends React.Component {
  render() {
    // Set the properties of the item to be drawn
    const set = this.props.representation.layer.representer.setting;
    const noColors = this.props.preferences.no_colors.value;
    const isGroup = !this.props.representation.layer.trivial;
    const selected =
      this.props.selected === this.props.representation.layer.representer.name;
    const strokeColor = this.props.representation.layer.dense
      ? colors.getFillColor(set, noColors, isGroup)
      : colors.getStrokeColor(set, noColors, isGroup, selected);
    const style = {
      fill: colors.getFillColor(set, noColors, isGroup),
      stroke: this.props.representation.layer.active
        ? strokeColor
        : "lightgrey",
      strokeLinejoin: "round",
      strokeWidth: this.props.legend_preferences.stroke_width.value,
    };
    const textStyle = {
      fill: this.props.representation.layer.active ? "black" : "lightgrey",
    };
    if (this.props.representation.layer.trivial) {
      return (
        <g>
          <text
            textAnchor="middle"
            x={
              this.props.representation.position +
              this.props.representation.layer.width / 2.0
            }
            y={this.props.legend_preferences.layer_height.value + 5 + 12}
            style={textStyle}
          >
            {this.props.representation.layer.representer.setting.alias}
          </text>
          <rect
            x={this.props.representation.position}
            y="0"
            width={this.props.legend_preferences.layer_width.value}
            height={this.props.legend_preferences.layer_height.value}
            style={style}
            onClick={() =>
              this.props.action(
                this.props.representation.layer.representer.name
              )
            }
          />
        </g>
      );
    } else {
      const graph = this.props.representation.layer.graph;
      var nodes = [];
      graph.nodes().forEach(function (e) {
        nodes.push(graph.node(e));
      });
      var edges = [];
      graph.edges().forEach(function (e) {
        edges.push({ v: e.v, w: e.w, points: graph.edge(e) });
      });
      style.strokeWidth = this.props.legend_preferences.stroke_width.value * 3;
      var displacement =
        nodes[legend.getInputNode(nodes)].y -
        this.props.legend_preferences.layer_height.value / 2.0; // Calculate the displacement if an inputnode to a legenditem is not standardly placed in the legend
      return (
        <g>
          <rect
            x={this.props.representation.position}
            y="0"
            width={this.props.legend_preferences.layer_width.value}
            height={this.props.legend_preferences.layer_height.value}
            style={style}
            onClick={() =>
              this.props.action(
                this.props.representation.layer.representer.name
              )
            }
          />
          <text
            textAnchor="middle"
            x={
              this.props.representation.position +
              this.props.legend_preferences.layer_width.value +
              this.props.legend_preferences.complex_spacing.value / 2.0
            }
            y={this.props.legend_preferences.layer_height.value / 2.0 + 6}
            style={textStyle}
          >
            =
          </text>
          <g
            transform={`translate(0, ${-(
              displacement +
              this.props.legend_preferences.layer_height.value / 2.0
            )})`}
          >
            <text
              textAnchor="middle"
              x={
                this.props.representation.position +
                this.props.representation.layer.width / 2.0
              }
              y={
                this.props.representation.layer.height +
                this.props.legend_preferences.layer_height.value / 2.0 +
                5 +
                12
              }
              style={textStyle}
            >
              {this.props.representation.layer.representer.setting.alias}
            </text>
            {nodes.map((layer, i) => (
              <ComplexLegendItem
                layer={layer}
                edges={edges}
                position={this.props.representation.position}
                active={this.props.representation.layer.active}
                height={graph.graph().height}
                selected={this.props.selected}
                key={i}
                action={this.props.action}
              />
            ))}
          </g>
        </g>
      );
    }
  }
}

// PropTypes of this Class
LegendItem.propTypes = {
  legend_preferences: PropTypes.object.isRequired,
  preferences: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
};

// Map the State of the Application to the Props of this Class
function mapStateToProps(state, ownProps) {
  return {
    legend_preferences: state.legend_preferences,
    preferences: state.preferences,
  };
}

export default connect(mapStateToProps, undefined)(LegendItem);
