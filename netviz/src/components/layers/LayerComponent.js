import React from 'react';
import PropTypes from 'prop-types';

const Layer = ({layer}) => {
  return (
    <g transform={`translate(${100 + (100 * layer.id)}, 100)`}>
      <rect width="150" height="50" x="0" y="0" rx ="10" ry ="10" style={{fill:'white', stroke: 'black'}} transform="skewY(-10)"/>
      <text x="75" y="25" textAnchor="middle" alignmentBaseline="middle" transform="skewY(-10)">{layer.name}</text>
    </g>
  );
};

Layer.propTypes = {
  layer: PropTypes.object.isRequired
};

export default Layer;
