import moment from 'moment';

export const makeTwoDigits = (number) => `00${number.toString()}`.slice(-2);

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const toMonthText = (number) => months[number];

export const formatDateTime = (dateTimeString, format = 'dd/mm/yy hh:MMp') => {
  if (dateTimeString === null) return '-';
  let dateString = moment(dateTimeString, 'DD-MM-YYYY', true).format();
  const dateObj = dateString !== 'Invalid date' ? new Date(dateString) : new Date(dateTimeString);
  const hours = dateObj.getHours();
  const month = dateObj.getMonth();
  return format
    .replace('p', hours > 12 ? 'pm' : 'am')
    .replace('P', hours > 12 ? 'PM' : 'AM')
    .replace('mmm', toMonthText(month))
    .replace('mm', makeTwoDigits(month + 1))
    .replace('dd', makeTwoDigits(dateObj.getDate()))
    .replace('yyyy', dateObj.getFullYear())
    .replace('yy', makeTwoDigits(dateObj.getFullYear()))
    .replace('hh', makeTwoDigits(hours % 12))
    .replace('HH', makeTwoDigits(hours))
    .replace('MM', makeTwoDigits(dateObj.getMinutes()));
};
