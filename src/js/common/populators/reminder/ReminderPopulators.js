import { createModelPopulator } from '../../../utils/UtilityFunctions';
import _ from 'lodash';

export const populateReminderMessage = reminderMessage => {
  const { sendDate, message } = reminderMessage;
  return { sendDate, message };
};

export const populateReminderMessages = reminderMessages =>
  _.map(reminderMessages, createModelPopulator(populateReminderMessage));

export const populateReminderNotification = reminderNotification => {
  const { dateTime } = reminderNotification;
  return { dateTime };
};

export const populateReminderNotifications = reminderNotifications =>
  _.map(reminderNotifications, createModelPopulator(populateReminderNotification));

export const populateReminderEvent = reminderEvent => {
  const { dateTime } = reminderEvent;
  const notifications = populateReminderNotifications(reminderEvent.notifications);
  return { dateTime, notifications };
};

export const populateReminderEvents = reminderEvents =>
  _.map(reminderEvents, createModelPopulator(populateReminderEvent));

export const populateReminder = reminder => {
  const { _id, name, startDate, messages } = reminder;
  const events = populateReminderEvents(reminder.events);
  return { id: _id, name, startDate, events, messages };
};

export const populateReminders = reminders =>
  _.map(reminders, populateReminder);
