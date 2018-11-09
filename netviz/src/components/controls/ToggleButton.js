import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const ToggleButton = ({name, state, action}) => {
  if(state) {
    return (
      <div className='noselect menuitem selected'><a onClick={() => action()}>{name}</a></div>
    );
  } else {
    return (
      <div className='noselect menuitem'><a onClick={() => action()}>{name}</a></div>      
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
