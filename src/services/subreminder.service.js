module.exports = (() => {
  const mongoose = require('mongoose');
  const SubreminderModel = require('../models/subreminder.model.js');
  const { MyDate } = require('../classes/index.js');
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
    startDate = new Date(startDate - 0);
    endDate = new Date(endDate - 0);
    const regexes = {
      daily: /DAILY/,
      weekly: /WEEKLY/,
      monthly: /MONTHLY/,
      everyXDays: /EVERY ([1-9][0-9]*) DAY/
    };
    const occurrence = repeats.map(repeat => {
      if (repeat.match(regexes.daily)) {
        const start = new MyDate({
          dateObject: startDate
        });
        const end = new MyDate({
          dateObject: endDate
        });
        return start.countDaily(end);
      } else if (repeat.match(regexes.weekly)) {
        const start = new MyDate({
          dateObject: startDate
        });
        const end = new MyDate({
          dateObject: endDate
        });
        return start.countWeekly(end);
      } else if (repeat.match(regexes.monthly)) {
        const start = new MyDate({
          dateObject: startDate
        });
        const end = new MyDate({
          dateObject: endDate
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
