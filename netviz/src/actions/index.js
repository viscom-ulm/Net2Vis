export const LOAD_NETWORK_SUCCESS = 'LOAD_NETWORK_SUCCESS';
export const MOVE_GROUP = 'MOVE_GROUP';
export const ZOOM_GROUP = 'ZOOM_GROUP';

export function moveGroup(group_displacement) {
  return {type: MOVE_GROUP, group_displacement};
}

export function zoomGroup(group_zoom) {
  return {type: ZOOM_GROUP, group_zoom};
}