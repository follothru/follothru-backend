module.exports = (() => {
  const mongoose = require('mongoose');
  const { EventModel } = require('../models');
  const ValidationUtils = require('../utils/validation.util.js');

  const { MyDate } = require('../utils');

  function findAllEvents() {
    return EventModel.find().populate('reminders');
  }

  function getRemindersByCourseId(course) {
    course = new mongoose.Types.ObjectId(course);
    return EventModel.find({ course }).populate('reminders');
  }

  function deleteEvent(id) {
    return new Promise((resolve, reject) => {
      EventModel.deleteOne({ _id: new mongoose.Types.ObjectId(id) })
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function createEvent(config, reminderIds) {
    return new Promise((resolve, reject) => {
      var { course } = config;
      const { name, startDate, endDate, startTime, endTime, repeats } = config;
      const startDateSplit = startDate.split('-');
      const endDateSplit = endDate.split('-');
      const startDateTime = new MyDate({
        year: startDateSplit[0],
        month: startDateSplit[1],
        date: startDateSplit[2],
        time: startTime
      }).getDateObject();
      const endDateTime = new MyDate({
        year: endDateSplit[0],
        month: endDateSplit[1],
        date: endDateSplit[2],
        time: endTime
      }).getDateObject();

      // convert course to mongoose id
      course = new mongoose.Types.ObjectId(course);

      // convert reminderIds to mongoose ids
      const reminders = reminderIds.map(
        reminderId => new mongoose.Types.ObjectId(reminderId)
      );

      const _id = new mongoose.Types.ObjectId();

      const eventModel = new EventModel({
        _id,
        name,
        startDateTime,
        endDateTime,
        repeats,
        course,
        reminders
      });

      eventModel
        .save()
        .then(resolve)
        .catch(reject);
    });
  }

  // function findAllEvents() {
  //   return EventModel.find().populate('reminders');
  // }

  // function createEvent(name, date, remindersToCreate) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       ValidationUtils.notNullOrEmpty(name);
  //       // ValidationUtils.notNullOrEmpty(date);
  //       const _id = new mongoose.Types.ObjectId();
  //       // date = new Date(date);
  //       remindersToCreate = remindersToCreate.map(config => {
  //         config.event = _id;
  //         return config;
  //       });
  //       ReminderService.createReminders(remindersToCreate)
  //         .then(newReminders => {
  //           const reminders = newReminders.map(newReminder => newReminder._id);
  //           const newEvent = new EventModel({ _id, name, date, reminders });
  //           return newEvent.save();
  //         })
  //         .then(resolve);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  return { deleteEvent, findAllEvents, createEvent, getRemindersByCourseId };
})();
