module.exports = (() => {
  const mongoose = require('mongoose');
  const ReminderModel = require('../models/reminder.model.js');
  const ValidationUtils = require('../utils/validation.util.js');
  const { MyDate } = require('../utils');

  // function findAllReminders() {
  //   return ReminderModel.find().populate('event');
  // }

  // function findRemindersByCourseId(courseId) {
  //   const course = new mongoose.Types.ObjectId(courseId);
  //   return ReminderModel.find({ course });
  // }

  // function createReminders(remindersToCreate) {
  //   return new Promise((resolve, reject) => {
  //     const createPromises = remindersToCreate.map(reminderConfig => {
  //       try {
  //         return createReminderWithConfig(reminderConfig);
  //       } catch (err) {
  //         console.error(
  //           `Failed to create reminder with config "${reminderConfig}": `,
  //           err
  //         );
  //       }
  //     });
  //     return Promise.all(createPromises)
  //       .then(newReminders =>
  //         newReminders.filter(reminder => reminder !== undefined)
  //       )
  //       .then(newReminders => {
  //         resolve(newReminders);
  //       })
  //       .catch(reject);
  //   });
  // }

  // function createReminder(name, courseId, startDate) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       ValidationUtils.notNullOrEmpty(name);
  //       const course = new mongoose.Types.ObjectId(courseId);
  //       const newReminder = new ReminderModel({ name, course, startDate });
  //       newReminder
  //         .save()
  //         .then(resolve)
  //         .catch(reject);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  // function deleteReminder(reminderId) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       ValidationUtils.notNullOrEmpty(reminderId, 'reminderId');
  //       ReminderModel.deleteOne({ _id: reminderId })
  //         .then(resolve)
  //         .catch(reject);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }

  // function createReminderWithConfig(config) {
  //   ValidationUtils.notNull(config);
  //   const { name, startDate, endDate, repeats, event } = config;
  //   ValidationUtils.notNullOrEmpty(name);
  //   ValidationUtils.notNullOrEmpty(startDate);
  //   const _id = new mongoose.Types.ObjectId();
  //   return SubreminderService.createSubreminders({
  //     date: startDate,
  //     reminderId: _id
  //   }).then(() => {
  //     const newReminder = new ReminderModel({
  //       _id,
  //       name,
  //       startDate,
  //       endDate,
  //       repeats,
  //       event
  //     });
  //     return newReminder.save();
  //   });
  // }

  function createReminder(config) {
    return new Promise((resolve, reject) => {
      const { name, startDate, endDate, startTime, endTime, repeats } = config;
      const reminders = createReminders(
        startDate,
        endDate,
        repeats,
        startTime,
        endTime
      );
      const reminderModels = reminders.map(myDate => {
        const dateTime = myDate.getDateObject();
        return new Promise((resolve, reject) => {
          const newRmd = new ReminderModel({
            name,
            dateTime
          });
          newRmd
            .save()
            .then(resolve)
            .catch(reject);
        });
      });

      Promise.all(reminderModels)
        .then(values => {
          values = values.map(value => value._id);
          resolve(values);
        })
        .catch(err => {
          reject(err);
          console.log(err);
        });
    });
  }

  function createReminders(startDate, endDate, repeats, startTime, endTime) {
    const startDateSplit = startDate.split('-');
    const endDateSplit = endDate.split('-');
    const regexes = {
      daily: /DAILY/i,
      weekly: /WEEKLY/i,
      monthly: /MONTHLY/i,
      everyXDays: /EVERY ([1-9][0-9]*) DAY/
    };
    const occurrence = repeats.map(repeat => {
      if (repeat.match(regexes.daily)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2],
          time: startTime
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2],
          time: endTime
        });
        return start.countDaily(end);
      } else if (repeat.match(regexes.weekly)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2],
          time: startTime
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2],
          time: endTime
        });
        return start.countWeekly(end);
      } else if (repeat.match(regexes.monthly)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2],
          time: startTime
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2],
          time: endTime
        });
        return start.countMonthly(end);
      } else if (repeat.match(regexes.everyXDays)) {
        return [];
      }
    });
    var convertToOneDArr = [];
    for (var i = 0; i < occurrence.length; i++) {
      convertToOneDArr = convertToOneDArr.concat(occurrence[i]);
    }
    return convertToOneDArr;
  }

  return { createReminder };
})();
