import moment from 'moment';

export const slotRange = (slot) => {
  return '' + moment(slot.start).format("h:mm a") + ' - ' + 
    moment(slot.end).format("h:mm a");
}