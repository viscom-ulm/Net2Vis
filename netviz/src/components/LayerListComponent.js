import React from 'react';
import PropTypes from 'prop-types';

import Layer from './LayerComponent'

const LayerList = ({layers}) => {
  return (
      <g>
        {layers.map(layer => 
          <Layer layer={layer} />
        )}
      </g>
  );
};

LayerList.propTypes = {
  layers: PropTypes.array.isRequired
};

export default LayerList;