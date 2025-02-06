"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullMonthTimeRangeFromDate = exports.getFullDayTimeRangeFromDate = exports.roundNumber = exports.getLocalDateString = exports.getStartOfDayAtBD = exports.getEndOfDayAtUTC = exports.getStartOfDayAtUTC = exports.DateFormatString = void 0;
const date_fns_1 = require("date-fns");
const Helper_1 = require("./Helper");
exports.DateFormatString = {
    dMyyyy: 'd/M/yyyy',
    yyyyMMdd: 'yyyy-MM-dd',
};
const getStartOfDayAtUTC = (date) => {
    try {
        return (0, date_fns_1.sub)((0, date_fns_1.startOfDay)(new Date(date)), { hours: 6 });
    }
    catch (error) {
        (0, Helper_1.log)('error', `could not construct time from:: ${date}`, error);
        throw error;
    }
};
exports.getStartOfDayAtUTC = getStartOfDayAtUTC;
const getEndOfDayAtUTC = (date) => {
    return (0, date_fns_1.add)((0, exports.getStartOfDayAtUTC)(date), { hours: 24 });
};
exports.getEndOfDayAtUTC = getEndOfDayAtUTC;
const getStartOfDayAtBD = (date) => {
    try {
        return (0, date_fns_1.startOfDay)((0, date_fns_1.add)(new Date(date), { hours: 6 }));
    }
    catch (error) {
        (0, Helper_1.log)('error', `could not construct time from:: ${date}`, error);
        throw error;
    }
};
exports.getStartOfDayAtBD = getStartOfDayAtBD;
const getLocalDateString = (date = new Date(), formatString) => (0, date_fns_1.format)((0, date_fns_1.add)(date, { hours: 6 }), formatString !== null && formatString !== void 0 ? formatString : exports.DateFormatString.yyyyMMdd);
exports.getLocalDateString = getLocalDateString;
const roundNumber = (value, precision = 1) => {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};
exports.roundNumber = roundNumber;
const getFullDayTimeRangeFromDate = (date) => {
    const startDate = (0, exports.getStartOfDayAtUTC)(date);
    return { start: startDate, end: (0, date_fns_1.add)(startDate, { hours: 24 }) };
};
exports.getFullDayTimeRangeFromDate = getFullDayTimeRangeFromDate;
const getFullMonthTimeRangeFromDate = (date) => {
    const startDate = (0, exports.getStartOfDayAtUTC)(date);
    const monthStartTime = (0, date_fns_1.startOfMonth)(startDate);
    return { start: monthStartTime, end: (0, date_fns_1.add)(monthStartTime, { months: 1 }) };
};
exports.getFullMonthTimeRangeFromDate = getFullMonthTimeRangeFromDate;
//# sourceMappingURL=DateTime.js.map