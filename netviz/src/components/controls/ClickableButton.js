import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const ClickableButton = ({name, image, action}) => {
  return (
    <div className='noselect menuitem'>
      <img src={image} alt='logo' />
      <a onClick={() => action()}>{name}</a>
    </div>      
  );
};

// Proptypes of ToggleBurttons
ClickableButton.propTypes = {
  name: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default ClickableButton;
