import { generateTimestamps, offsetDate, saveModel, castObjectId } from '../../utils/UtilityFunctions';
import { notEmpty } from '../../utils/ValidationUtils';
import ReminderModel from '../../models/reminder/ReminderModel';
import ReminderNotificationModel from '../../models/reminder/ReminderNotificationModel';
import ReminderEventModel from '../../models/reminder/ReminderEventModel';
import { ReminderNotFoundError } from './errors';
import * as CourseService from '../course/CourseService';
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

export const getRemindersForCourse = courseId => new Promise((resolve, reject) => {
  try {
    notEmpty(courseId, 'courseId');

    courseId = castObjectId(courseId);
    ReminderModel.find({ course: courseId })
      .then(resolve)
      .catch(reject);
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

const processMeta = meta => Object.assign({}, meta, { finishedLink: 'https://www.google.ca' });

export const createReminder = (courseId, name, message, startDate, endDate, repeats, offsets, meta = {}) =>
  new Promise((resolve, reject) => {
    try {
      notEmpty(courseId, 'courseId');
      notEmpty(name, 'name');
      notEmpty(startDate, 'startDate');
      notEmpty(endDate, 'endDate');

      meta = processMeta(meta);

      CourseService.findCourseById(courseId)
        .then(course => {
          const { studentGroup } = course;
          const timestamps = generateTimestamps(startDate, endDate, repeats, offsets);
          const events = _.map(timestamps, dateTime => {
            const offsetDateTimes = offsetDate(dateTime, offsets);
            const notifications = _.map(offsetDateTimes, offsetDateTime =>
              saveModel(new ReminderNotificationModel({ studentGroup, dateTime: offsetDateTime, meta })));
            const reminderEvent = new ReminderEventModel({ dateTime });
            reminderEvent.setNotifications(notifications);
            return saveModel(reminderEvent);
          });

          const reminder = new ReminderModel({ course: castObjectId(courseId), name, startDate, message });
          reminder.setEvents(events);
          return reminder.save()
        })
        .then(resolve)
        .catch(reject);
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
