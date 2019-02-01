module.exports = (() => {
  const mongoose = require('mongoose');
  const SubreminderModel = require('../models/subreminder.model.js');
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
      const ONEDAYINMILL = 1000 * 24 * 3600;
      if (repeat.match(regexes.daily)) {
        const numOfDays = calNumOfDays(startDate, endDate, ONEDAYINMILL);
        return [...new Array(numOfDays).keys()].map(
          index => new Date(startDate.getTime() + index * ONEDAYINMILL)
        );
      } else if (repeat.match(regexes.weekly)) {
        const numOfDays = calNumOfDays(startDate, endDate, ONEDAYINMILL * 7);
        return [...new Array(numOfDays).keys()].map(
          index => new Date(startDate.getTime() + index * ONEDAYINMILL * 7)
        );
      } else if (repeat.match(regexes.monthly)) {
        return [];
      } else if (repeat.match(regexes.everyXDays)) {
        return [];
      }
    });
    console.log(occurrence);
  }

  function calNumOfDays(startDate, endDate, divider) {
    return Math.ceil((endDate - startDate) / divider);
  }

  return {
    findAllSubreminders,
    getSubremindersForReminder,
    createSubreminders
  };
})();
