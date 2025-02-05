import { Interval, add, format, startOfDay, startOfMonth, sub } from 'date-fns';
import { log } from './Helper';

export const DateFormatString = {
  dMyyyy: 'd/M/yyyy',
  yyyyMMdd: 'yyyy-MM-dd',
};

export const getStartOfDayAtUTC = (date: string | Date) => {
  try {
    return sub(startOfDay(new Date(date)), { hours: 6 });
  } catch (error) {
    log('error', `could not construct time from:: ${date}`, error);
    throw error;
  }
};

export const getEndOfDayAtUTC = (date: string | Date) => {
  return add(getStartOfDayAtUTC(date), { hours: 24 });
};

export const getStartOfDayAtBD = (date: string | Date) => {
  try {
    return startOfDay(add(new Date(date), { hours: 6 }));
  } catch (error) {
    log('error', `could not construct time from:: ${date}`, error);
    throw error;
  }
};

export const getLocalDateString = (date: Date = new Date(), formatString?: string) =>
  format(add(date, { hours: 6 }), formatString ?? DateFormatString.yyyyMMdd);

export const roundNumber = (value: number, precision = 1) => {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const getFullDayTimeRangeFromDate = (date: string | Date): Interval => {
  const startDate = getStartOfDayAtUTC(date);
  return { start: startDate, end: add(startDate, { hours: 24 }) };
};

export const getFullMonthTimeRangeFromDate = (date: string | Date): Interval => {
  const startDate = getStartOfDayAtUTC(date);
  const monthStartTime = startOfMonth(startDate);
  return { start: monthStartTime, end: add(monthStartTime, { months: 1 }) };
};
