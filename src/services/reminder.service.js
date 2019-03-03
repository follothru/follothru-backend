module.exports = (() => {
  const mongoose = require('mongoose');
  const ReminderModel = require('../models/reminder.model.js');
  const reminderActionModel = require('../models/reminder-action.model.js');
  const ValidationUtils = require('../utils/validation.util.js');

  function findAllReminders() {
    return ReminderModel.find().populate('actions');
  }

  function findRemindersByCourseId(courseId) {
    const course = new mongoose.Types.ObjectId(courseId);
    return ReminderModel.find({ course }).populate('actions');
  }

  function generateDates(startDate, endDate, options = {}) {
    if (endDate.getTime() < startDate.getTime()) {
      return [];
    }
    const { dayInterval, weekInterval, monthInterval } = options;
    if (
      dayInterval === undefined &&
      weekInterval === undefined &&
      monthInterval === undefined
    ) {
      return [startDate];
    }
    const minInterval = 86400000; // 1000 * 3600 * 24
    const dates = Object.keys([
      ...new Array(
        Math.ceil((endDate.getTime() - startDate.getTime()) / minInterval) + 1
      )
    ])
      .map(daysDiff => {
        return {
          date: new Date(daysDiff * minInterval + startDate.getTime()),
          daysDiff: daysDiff - 0
        };
      })
      .map(obj => {
        const { date, daysDiff } = obj;
        return {
          date,
          daysDiff,
          weeksDiff: Math.floor(daysDiff / 7),
          monthsDiff:
            (date.getFullYear() - startDate.getFullYear()) * 12 +
            date.getMonth() -
            startDate.getMonth() +
            (date.getDate() < startDate.getDate() ? -1 : 0)
        };
      });

    const intvMap = {};
    if (dayInterval) {
      intvMap['daysDiff'] = dayInterval;
    }
    if (weekInterval) {
      intvMap['weeksDiff'] = weekInterval;
    }
    if (monthInterval) {
      intvMap['monthsDiff'] = monthInterval;
    }
    const intvKeys = Object.keys(intvMap);

    const results = dates
      .reduce((prev, curr) => {
        const last = prev[prev.length - 1];
        if (last === undefined) {
          return [curr];
        }
        if (
          intvKeys.some(
            key => last[key] !== curr[key] && curr[key] % intvMap[key] === 0
          )
        ) {
          return [...prev, curr];
        }
        return prev;
      }, [])
      .map(obj => obj.date);

    return results;
  }

  function createReminders(courseId, name, startDate, endDate, repeats = {}) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(courseId, 'courseId');
        ValidationUtils.notNullOrEmpty(name, 'name');
        ValidationUtils.notNullOrEmpty(startDate, 'startDate');
        if (!endDate) {
          endDate = startDate;
        }
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const { dayInterval, weekInterval, monthInterval } = repeats;
        const dates = generateDates(startDate, endDate, {
          dayInterval,
          weekInterval,
          monthInterval
        });

        const course = new mongoose.Types.ObjectId(courseId);
        const newReminder = new ReminderModel({
          _id: new mongoose.Types.ObjectId(),
          startDate,
          endDate,
          course,
          name
        });
        const promises = dates.map(date =>
          new reminderActionModel({
            _id: new mongoose.Types.ObjectId(),
            dateTime: date
          }).save()
        );

        Promise.all(promises)
          .then(actions => {
            actions = actions.map(action => action._id);
            newReminder.actions = actions;
            return newReminder.save();
          })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function createReminder(name, courseId, startDate) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(name, 'name');
        const course = new mongoose.Types.ObjectId(courseId);
        const newReminder = new ReminderModel({ name, course, startDate });
        newReminder
          .save()
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  function deleteReminder(reminderId) {
    return new Promise((resolve, reject) => {
      try {
        ValidationUtils.notNullOrEmpty(reminderId, 'reminderId');
        ReminderModel.deleteOne({ _id: reminderId })
          .then(resolve)
          .catch(reject);
      } catch (err) {
        reject(err);
      }
    });
  }

  return {
    findAllReminders,
    findRemindersByCourseId,
    createReminder,
    createReminders,
    deleteReminder
  };
})();
