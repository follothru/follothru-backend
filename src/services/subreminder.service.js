module.exports = (() => {
  const mongoose = require('mongoose');
  const SubreminderModel = require('../models/subreminder.model.js');
  const { MyDate } = require('../utils/index.js');
  // const ValidationUtils = require('../utils/validation.util.js');

  function findAllSubreminders() {
    return SubreminderModel.find().populate('reminders');
  }

  function getSubremindersForReminder(reminderId) {
    reminderId = new mongoose.Schema.Types.ObjectId(reminderId);
    SubreminderModel.find({ parentReminder: reminderId });
  }

  function createSubreminders(config) {
    const { reminderId, startDate, endDate, repeats } = config;
    const parentReminder = reminderId;
    getOccurrence(startDate, endDate, repeats);
    const subReminder = new SubreminderModel({
      date: endDate,
      parentReminder
    });
    return subReminder.save();
  }

  function getOccurrence(startDate, endDate, repeats) {
    const startDateSplit = startDate.split('-');
    const endDateSplit = endDate.split('-');
    const regexes = {
      daily: /DAILY/,
      weekly: /WEEKLY/,
      monthly: /MONTHLY/,
      everyXDays: /EVERY ([1-9][0-9]*) DAY/
    };
    const occurrence = repeats.map(repeat => {
      if (repeat.match(regexes.daily)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2]
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2]
        });
        return start.countDaily(end);
      } else if (repeat.match(regexes.weekly)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2]
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2]
        });
        return start.countWeekly(end);
      } else if (repeat.match(regexes.monthly)) {
        const start = new MyDate({
          year: startDateSplit[0],
          month: startDateSplit[1],
          date: startDateSplit[2]
        });
        const end = new MyDate({
          year: endDateSplit[0],
          month: endDateSplit[1],
          date: endDateSplit[2]
        });
        return start.countMonthly(end);
      } else if (repeat.match(regexes.everyXDays)) {
        return [];
      }
    });

    return occurrence;
  }

  return {
    findAllSubreminders,
    getSubremindersForReminder,
    createSubreminders
  };
})();
