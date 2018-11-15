import React from 'react';
import PropTypes from 'prop-types';
import {SketchPicker} from 'react-color';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const InputField = ({value, type, description, action, options}) => {
  if(type === 'number') {
    return (
      <div className='preferenceItem'>
        {description}:
        <input className='inputElement' type="number" step="10" value={value} onChange={(e) => action(e)}/>
      </div>
    );
  } else if (type === 'color') {
    return (
      <div className='preferenceItem'>
        {description}:
        <SketchPicker width={260} disableAlpha={true} presetColors={[]} color={ value } onChange={ (e) => action(e) } />
      </div>
    );
  } else if (type === 'choice') {
    return (
      <div className='preferenceItem'>
        {description}:
        <select className='inputElementSelect' value={value} onChange={ (e) => action(e) }>
          {options.map((opt, index) => 
            <option value={opt} key={index}>{opt}</option>
          )}
        </select>
      </div>
    );
  } else if (type === 'text') {
    return (
      <div className='preferenceItem'>
        {description}:
        <input className='inputElement' type="text" value={value} onChange={(e) => action(e)}/>
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
