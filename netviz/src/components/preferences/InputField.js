import React from 'react';
import PropTypes from 'prop-types';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const InputField = ({value, type, description, action}) => {
  if(type === 'number') {
    return (
      <div className='preferenceItem'>
        {description}:
        <input className='inputElement' type="number" step="10" value={value} onChange={(e) => action(e)}/>
      </div>
    );
  }
};

// Proptypes of ToggleBurttons
InputField.propTypes = {
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired
};

export default InputField;
