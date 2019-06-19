import TimestampGenerator from "./TimestampGenerator";
import { Types } from 'mongoose';
import _ from "lodash";

const dateOffsetFunctions = {
  HOUR: (date, offset) => { date.setHours(date.getHours() + offset); return date; },
  DAY: (date, offset) => { date.setDate(date.getDate() + offset); return date; },
  WEEK: (date, offset) => { date.setDate(date.getDate() + 7 * offset); return date; }
};

/**
 * Offset a date
 * @param {Date} date
 * @param {Date[]} offsets
 * @returns {Date[]}
 */
export function offsetDate(date, offsets) {
  if (!offsets || offsets.length <= 0) {
    return [date];
  }
  const result = _.map(offsets, row => dateOffsetFunctions[row[0]](new Date(date.getTime()), row[1]));
  return result;
}

const sortDates = dates => _.sortBy(dates, date => date.getTime());

/**
 * 
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @param {any[]} repeats 
 * @returns {Date[]}
 */
export function generateTimestamps(startDate, endDate, repeats) {
  if (!startDate || !endDate) {
    return [];
  }

  const resultArray = _.map(repeats, row => {
    const stepType = row[0];
    const stepSize = row[1];
    const generator = new TimestampGenerator(startDate, endDate, stepType, stepSize);
    const rowResult = [];

    generator.next();
    let timestamp = generator.next();

    while (timestamp) {
      rowResult.push(timestamp);
      timestamp = generator.next();
    }

    return rowResult;
  });
  resultArray.push(startDate);

  return sortDates(_.flatten(resultArray));
}

export function saveModel(model) {
  model.save();
  return model;
}

export const createModelPopulator = populator =>
  model => model instanceof Types.ObjectId ? model : populator(model);

export const castObjectId = id => id instanceof String ? new Types.ObjectId(id) : id;

export const getDatabaseReady = () => global.db_ready;

export const setDatabaseReady = (ready = true) => {
  global.db_ready = ready;
}
