import initialState from "./initialState";
import * as types from "../actions/types";

export default function colorModeReducer(
  state = initialState.color_mode,
  action
) {
  switch (action.type) {
    case types.SET_SELECTION_COLOR_MODE:
      return { selection: action.mode, generation: state.generation };
    case types.SET_GENERATION_COLOR_MODE:
      return { selection: state.selection, generation: action.mode };
    default:
      return state;
  }
}
