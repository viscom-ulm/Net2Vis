import React from 'react';
import PropTypes from 'prop-types';
import {SketchPicker, TwitterPicker} from 'react-color';

import * as colors from '../../colors'

import { TextField, Button, FormControlLabel, FormControl, Switch, Select, MenuItem, InputLabel } from '@material-ui/core';

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const InputField = ({value, type, description, action, options}) => {
  if(type === 'number') {
    return (
      <div className='preferenceItem'>

        <TextField id="standard-number" type="number" label={description} value={value} onChange={(e) => action(e)} margin="normal" className='inputElement' inputProps={{ min: "0", max: "1000", step: "10" }}/>
      </div>
    );
  } else if (type === 'color') {
    if (options === 'Palette') {
      var palette = colors.getColorPalette();
      return (
        <div className='preferenceItem'>
          <TwitterPicker width={280} triangle={'hide'} colors={palette} color={ value } onChange={ (e) => action(e) } />
        </div>
      );
    } else if (options === 'Picker'){
      return (
        <div className='preferenceItem'>
          <SketchPicker width={260} disableAlpha={true} presetColors={[]} color={ value } onChange={ (e) => action(e) } />
        </div>
      );
    }
  } else if (type === 'text') {
    return (
      <div className='preferenceItem'>
        <TextField id="standard-name" label={description} value={value} onChange={(e) => action(e)} margin="normal" className='inputElement'/>
      </div>
    );
  } else if (type === 'button') {
    return (
      <div className='preferenceItem'>
        <Button onClick={(e) => action(e)} variant="contained" color="primary" className='inputElement'>{description}</Button>
      </div>
    );
  } else if (type === 'switch') {
    return (
      <div className='preferenceItem'>
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={(e) => action(e)}
              value="checkedB"
              color="primary"
            />
          }
          label={description}
        />
      </div>
    );
  } else if (type === 'select') {
    return (
      <div className='preferenceItem'>
        <FormControl className='inputElement'>
          <InputLabel shrink>
            {description}
          </InputLabel>
          <Select onChange={(e) => action(e)} value={value}>
            {options.map((option, index) =>
              <MenuItem value={option} key={index}>{option}</MenuItem>
            )}
          </Select>
          </FormControl>
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
