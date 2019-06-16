import { generateTimestamps, offsetDate, saveModel } from '../../utils/UtilityFunctions';
import { notEmpty } from '../../utils/ValidationUtils';
import ReminderModel from '../../models/reminder/ReminderModel';
import ReminderNotificationModel from '../../models/reminder/ReminderNotificationModel';
import ReminderEventModel from '../../models/reminder/ReminderEventModel';
import { ReminderNotFoundError } from './errors';
import _ from 'lodash';

export const getReminders = () => ReminderModel.find();

export const getReminderById = reminderId => {
  return new Promise((resolve, reject) => {
    try {
      notEmpty(reminderId, 'reminderId');

      ReminderModel.findReminderById(reminderId)
        .populate({
          path: 'events',
          model: 'ReminderEventModel',
          populate: {
            path: 'notifications',
            model: 'ReminderNotificationModel'
          }
        })
        .then(result => {
          if (!result) {
            throw new ReminderNotFoundError('Could not find reminder.');
          }
          return result;
        })
        .then(resolve)
        .catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};

export const createReminder = (name, message, startDate, endDate, repeats, offsets) =>
  new Promise((resolve, reject) => {
    try {
      notEmpty(name, 'name');
      notEmpty(startDate, 'startDate');
      notEmpty(endDate, 'endDate');

      const timestamps = generateTimestamps(startDate, endDate, repeats, offsets);
      const events = _.map(timestamps, dateTime => {
        const offsetDateTimes = offsetDate(dateTime, offsets);
        const notifications = _.map(offsetDateTimes, offsetDateTime =>
          saveModel(new ReminderNotificationModel({ dateTime: offsetDateTime })));
        const reminderEvent = new ReminderEventModel({ dateTime });
        reminderEvent.setNotifications(notifications);
        return saveModel(reminderEvent);
      });

      const reminder = new ReminderModel({ name, startDate, message });
      reminder.setEvents(events);
      reminder.save().then(resolve).catch(reject);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });

export const deleteReminder = reminderId => new Promise((resolve, reject) => {
  try {
    ReminderModel.deleteReminderById(reminderId).then(resolve).catch(reject);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});
