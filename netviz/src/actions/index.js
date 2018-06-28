export const LOAD_NETWORK_SUCCESS = 'LOAD_NETWORK_SUCCESS';
export const MOVE_GROUP = 'MOVE_GROUP';
export const ZOOM_GROUP = 'ZOOM_GROUP';
export const TOGGLE_CODE = 'TOGGLE_CODE';
export const TOGGLE_PREFERENCES = 'TOGGLE_PREFERENCES';
export const TOGGLE_LEGEND = 'TOGGLE_LEGEND';

export function moveGroup(group_displacement) {
  return {type: MOVE_GROUP, group_displacement};
}

export function zoomGroup(group_zoom) {
  return {type: ZOOM_GROUP, group_zoom};
}

export function toggleCode() {
  return {type: TOGGLE_CODE};
}

export function togglePreferences() {
  return {type: TOGGLE_PREFERENCES};
}

export function toggleLegend() {
  return {type: TOGGLE_LEGEND};
}