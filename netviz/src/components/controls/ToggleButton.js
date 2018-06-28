import React from 'react';
import PropTypes from 'prop-types';

const ToggleButton = ({name, state, action}) => {
  if(state) {
    return (
      <li><a className='selected' onClick={() => action()}>{name}</a></li>
    );
  } else {
    return (
      <li><a onClick={() => action()}>{name}</a></li>      
    );
  }
};

ToggleButton.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired
};

export default ToggleButton;
