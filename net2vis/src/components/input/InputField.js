import React from "react";
import PropTypes from "prop-types";
import { SketchPicker, TwitterPicker } from "react-color";

import * as colors from "../../colors";

import {
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";

// ToggleButton Control Element appearance dependant on State of the Button. Action that is provided gets called on click.
const InputField = ({
  value,
  type,
  description,
  action,
  options,
  active = true,
}) => {
  switch (type) {
    case "number":
      return (
        <div className="preferenceItem">
          <TextField
            id="standard-number"
            type="number"
            label={description}
            value={value}
            onChange={(e) => action(e)}
            margin="normal"
            className="inputElement"
            inputProps={{ min: "0", max: "1000", step: "10" }}
          />
        </div>
      );
    case "color":
      return (
        <div className="preferenceItem">
          {options === "Palette" ? (
            <TwitterPicker
              width={280}
              triangle={"hide"}
              colors={colors.getColorPalette()}
              color={value}
              onChange={(e) => action(e)}
            />
          ) : (
            <SketchPicker
              width={260}
              disableAlpha={true}
              presetColors={[]}
              color={value}
              onChange={(e) => action(e)}
            />
          )}
        </div>
      );
    case "text":
      return (
        <div className="preferenceItem">
          <TextField
            id="standard-name"
            label={description}
            value={value}
            onChange={(e) => action(e)}
            margin="normal"
            className="inputElement"
          />
        </div>
      );
    case "button":
      return (
        <div className="preferenceItem">
          <Button
            onClick={(e) => action(e)}
            variant="contained"
            color={options === "secondary" ? "secondary" : "primary"}
            className="inputElement"
            disabled={!active}
          >
            {description}
          </Button>
        </div>
      );
    case "paddedButton":
      return (
        <div className="paddedButton">
          <Button
            onClick={(e) => action(e)}
            variant="contained"
            color={options === "secondary" ? "secondary" : "primary"}
            className="inputElement"
            disabled={!active}
          >
            {description}
          </Button>
        </div>
      );
    case "codeButton":
      return (
        <div className="codeItem">
          <Button
            onClick={(e) => action(e)}
            variant="contained"
            color={options === "secondary" ? "secondary" : "primary"}
            className="inputElement"
            disabled={!active}
          >
            {description}
          </Button>
        </div>
      );
    case "switch":
      return (
        <div className="preferenceItem">
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
    case "select":
      return (
        <div className="preferenceItem formselect">
          <FormControl className="inputElement">
            <InputLabel id="select-label">{description}</InputLabel>
            <Select
              onChange={(e) => action(e)}
              value={value}
              labelId="select-label"
              label={description}
            >
              {options.map((option, index) => (
                <MenuItem value={option} key={index}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      );
    case "barselect":
      return (
        <div className="menuselect">
          <Box>
            <FormControl className="inputElement">
              <Select onChange={(e) => action(e)} value={value}>
                {options.map((option, index) => (
                  <MenuItem value={option} key={index}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
      );
    default:
      return <div></div>;
  }
};

// Proptypes of ToggleBurttons
InputField.propTypes = {
  value: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};

export default InputField;
