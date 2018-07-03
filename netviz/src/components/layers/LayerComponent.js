import React from 'react';
import PropTypes from 'prop-types';

const Layer = ({layer, settings}) => {
  var set = {
    color: 'white'
  }

  if(settings) {
    set = settings;
  }

  return (
    <g transform={`translate(${100 + (20 * layer.id)}, 100)`}>
      <rect width="150" height="150" x="0" y="0" rx ="10" ry ="10" style={{fill:set.color, stroke: 'black'}} transform="skewY(-10)"/>
      <text x="75" y="25" textAnchor="middle" alignmentBaseline="middle" transform="skewY(-10)">{layer.name[0]}</text>
    </g>
  );
};

Layer.propTypes = {
  layer: PropTypes.object.isRequired
};

export default Layer;
