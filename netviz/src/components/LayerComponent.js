import React from 'react';
import PropTypes from 'prop-types';

const Layer = ({layer}) => {
  return (
    <g>
      <rect width="150" height="50" x="100" y={100 + (100 * layer.id)} style={{fill:'none', stroke: 'black'}}/>
      <text x="175" y={125 + (100 * layer.id)} textAnchor="middle" alignmentBaseline="middle">{layer.name}</text>
    </g>
  );
};

Layer.propTypes = {
  layer: PropTypes.object.isRequired
};

export default Layer;
