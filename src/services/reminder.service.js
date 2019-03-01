module.exports = (() => {
  // const mongoose = require('mongoose');
  const ReminderModel = require('../models/reminder.model.js');
  const { MyDate } = require('../utils');

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
    let convertToOneDArr = [];
    for (let i = 0; i < occurrence.length; i++) {
      convertToOneDArr = convertToOneDArr.concat(occurrence[i]);
    }
    return convertToOneDArr;
  }

  return { createReminder };
})();
