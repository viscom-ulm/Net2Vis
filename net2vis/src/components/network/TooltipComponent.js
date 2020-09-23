import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "react-svg-tooltip";

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const TooltipComponent = ({
  properties_object,
  dimensions,
  tooltipRef,
  name,
}) => {
  // Build the Properties Object for the Tooltip
  const buildProperties = (properties_object, dimensions) => {
    const keys = Object.keys(properties_object); // Get the Keys from the Object
    var properties = []; // Get all Properties
    for (var i in keys) {
      if (properties_object[keys[i]]) {
        properties.push({
          key: keys[i],
          prop: properties_object[keys[i]].toString(),
        });
      }
    }
    // Add Dimensions to Properties
    properties.push({ key: "Dimensions in", prop: dimensions.in.toString() });
    properties.push({ key: "Dimensions out", prop: dimensions.out.toString() });
    return properties;
  };

  const properties = buildProperties(properties_object, dimensions);
  return (
    <Tooltip triggerRef={tooltipRef}>
      <rect
        x={10}
        y={10}
        width={200}
        height={14 + properties.length * 15}
        rx={0.5}
        ry={0.5}
        fill="black"
        fillOpacity="0.6"
      />
      <text x={13} y={20} fontSize={10} fill="white">
        Type: {name}
      </text>
      {properties.map((pro, index) => (
        <text x={13} y={35 + index * 15} fontSize={10} key={index} fill="white">
          {pro.key}: {pro.prop}
        </text>
      ))}
    </Tooltip>
  );
};

// Proptypes of ToggleBurttons
TooltipComponent.propTypes = {
  properties_object: PropTypes.object.isRequired,
  dimensions: PropTypes.object.isRequired,
  tooltipRef: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

export default TooltipComponent;
