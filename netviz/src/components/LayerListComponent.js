import React from 'react';
import PropTypes from 'prop-types';

const LayerList = ({layers}) => {
  return (
      <g>
        {layers.map(layer => 
          <rect width="300" height="100" x="100" y="100" />
        )}
      </g>
  );
};

LayerList.propTypes = {
  layers: PropTypes.array.isRequired
};

export default LayerList;