import React from 'react';
import PropTypes from 'prop-types';

const EdgeComponent = ({edge}) => {
  var points = edge.points;
  return (
    <g></g>
  );
};


// Proptypes of ToggleBurttons
EdgeComponent.propTypes = {
  edge: PropTypes.object.isRequired
};

export default EdgeComponent;
