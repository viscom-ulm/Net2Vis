import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const ClickableButton = ({name, action}) => {
  return (
    <li className='noselect'><a onClick={() => action()}>{name}</a></li>      
  );
};

// Proptypes of ToggleBurttons
ClickableButton.propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default ClickableButton;
