import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const ToggleButton = ({name, state, action}) => {
  if(state) {
    return (
      <li className='noselect'><a className='selected' onClick={() => action()}>{name}</a></li>
    );
  } else {
    return (
      <li className='noselect'><a onClick={() => action()}>{name}</a></li>      
    );
  }
};

// Proptypes of ToggleBurttons
ToggleButton.propTypes = {
  name: PropTypes.string.isRequired,
  state: PropTypes.bool.isRequired,
  action: PropTypes.func.isRequired
};

export default ToggleButton;
